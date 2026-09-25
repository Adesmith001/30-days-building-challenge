/// <reference lib="webworker" />

import { getLayout } from "../data/layouts";
import { createGrid, rebuildGrid, cellCoordinates } from "../simulation/grid";
import { inspectNeighbours } from "../simulation/neighbors";
import { buildNextHop, edgeKey } from "../simulation/pathfinding";
import { Quadtree } from "../simulation/quadtree";
import { createState, setPopulation } from "../simulation/state";
import { stepSimulation } from "../simulation/step";
import {
  defaultParams,
  MAX_DANFOS,
  type CityLayout,
  type EngineMode,
  type PointerForce,
  type SimParams,
} from "../types";

const ctx = self as DedicatedWorkerGlobalScope;

let layout: CityLayout = getLayout("mainland");
let blocked = new Set<string>();
let nextHop = buildNextHop(layout, blocked);

let state = createState(layout, 500, nextHop);
let params: SimParams = { ...defaultParams };

let grid = createGrid(layout, params.cellSize, MAX_DANFOS);
let quadtree = new Quadtree(380);

let engine: EngineMode = "grid";
let playing = true;
let trafficLights = true;

let selectedId = -1;
let simTime = 0;

let safeNaiveLimit = 2500;

let pointer: PointerForce = {
  active: false,
  x: 0,
  z: 0,
  mode: "push",
  radius: params.pointerRadius,
};

let sharedHeader: Int32Array | null = null;
let sharedFloats: Float32Array | null = null;

const transferPool: ArrayBuffer[] = [];

let lastStepStats = {
  simulationMs: 0,
  candidateChecks: 0,
  avgNeighbours: 0,
  occupiedCells: 0,
};

function rebuildSystems() {
  nextHop = buildNextHop(layout, blocked);
  grid = createGrid(layout, params.cellSize, MAX_DANFOS);
  quadtree = new Quadtree(380);
}

function writeSnapshot() {
  if (sharedHeader && sharedFloats) {
    for (let i = 0; i < state.count; i += 1) {
      const offset = i * 4;

      sharedFloats[offset] = state.x[i];
      sharedFloats[offset + 1] = state.z[i];
      sharedFloats[offset + 2] = state.heading[i];
      sharedFloats[offset + 3] = state.status[i];
    }

    Atomics.store(sharedHeader, 1, state.count);
    Atomics.add(sharedHeader, 0, 1);

    return;
  }

  const buffer = transferPool.pop();
  if (!buffer) return;

  const floats = new Float32Array(buffer);

  for (let i = 0; i < state.count; i += 1) {
    const offset = i * 4;

    floats[offset] = state.x[i];
    floats[offset + 1] = state.z[i];
    floats[offset + 2] = state.heading[i];
    floats[offset + 3] = state.status[i];
  }

  ctx.postMessage(
    {
      type: "SNAPSHOT",
      buffer,
      count: state.count,
    },
    [buffer],
  );
}

function inspector() {
  if (selectedId < 0 || selectedId >= state.count) return null;

  if (engine === "grid") {
    rebuildGrid(grid, state);
  }

  if (engine === "quadtree") {
    quadtree.rebuild(state);
  }

  const inspected = inspectNeighbours(
    engine,
    state,
    selectedId,
    params.neighbourRadius,
    grid,
    quadtree,
  );

  const [cellX, cellZ] = cellCoordinates(
    grid,
    state.x[selectedId],
    state.z[selectedId],
  );

  const searchedCells: Array<[number, number]> = [];

  if (engine === "grid") {
    for (let z = -1; z <= 1; z += 1) {
      for (let x = -1; x <= 1; x += 1) {
        searchedCells.push([cellX + x, cellZ + z]);
      }
    }
  }

  const current = layout.nodes[state.currentNode[selectedId]];
  const destination = layout.nodes[state.destination[selectedId]];

  const speed = Math.hypot(
    state.vx[selectedId],
    state.vz[selectedId],
  );

  const stateNames = ["MOVING", "SLOWING", "REROUTING"];

  return {
    id: selectedId,
    speedKmh: speed * 3.6,
    route: `${current.name} → ${destination.name}`,
    state: stateNames[state.status[selectedId]] ?? "MOVING",
    neighbours: inspected.ids.length,
    candidates: inspected.candidates,
    cellX,
    cellZ,
    neighbourIds: inspected.ids.slice(0, 64),
    searchedCells,
  };
}

function publishStats() {
  ctx.postMessage({
    type: "STATS",
    metrics: {
      simulationMs: lastStepStats.simulationMs,
      candidateChecks: lastStepStats.candidateChecks,
      avgNeighbours: lastStepStats.avgNeighbours,
      occupiedCells: lastStepStats.occupiedCells,
      simTime,
    },
    inspector: inspector(),
  });
}

function rerouteBlockedAgents() {
  const nodeCount = layout.nodes.length;

  for (let i = 0; i < state.count; i += 1) {
    const key = edgeKey(
      state.currentNode[i],
      state.nextNode[i],
    );

    if (!blocked.has(key)) continue;

    const next =
      nextHop[
        state.currentNode[i] * nodeCount +
          state.destination[i]
      ];

    if (next >= 0) {
      state.nextNode[i] = next;
      state.status[i] = 2;
    }
  }
}

function toggleEdge(index: number) {
  const edge = layout.edges[index];
  if (!edge) return;

  const key = edgeKey(edge.a, edge.b);

  if (blocked.has(key)) blocked.delete(key);
  else blocked.add(key);

  nextHop = buildNextHop(layout, blocked);
  rerouteBlockedAgents();

  const blockedIndices = layout.edges
    .map((candidate, i) =>
      blocked.has(edgeKey(candidate.a, candidate.b)) ? i : -1,
    )
    .filter((i) => i >= 0);

  ctx.postMessage({
    type: "BLOCKED",
    blockedSegments: blockedIndices,
  });
}

function makeStepContext(
  targetState = state,
  targetGrid = grid,
  targetQuadtree = quadtree,
  targetEngine = engine,
) {
  return {
    layout,
    state: targetState,
    grid: targetGrid,
    quadtree: targetQuadtree,
    engine: targetEngine,
    nextHop,
    params,
    pointer,
    trafficLights,
    simTime,
  };
}

async function calibrate() {
  let safe = 500;

  for (const population of [500, 1000, 1500, 2000, 2500]) {
    const temporary = createState(
      layout,
      population,
      nextHop,
      `calibrate-naive-${population}`,
    );

    const temporaryGrid = createGrid(
      layout,
      params.cellSize,
      MAX_DANFOS,
    );

    const temporaryQuad = new Quadtree();

    stepSimulation(
      makeStepContext(
        temporary,
        temporaryGrid,
        temporaryQuad,
        "naive",
      ),
      1 / 60,
    );

    const started = performance.now();

    stepSimulation(
      makeStepContext(
        temporary,
        temporaryGrid,
        temporaryQuad,
        "naive",
      ),
      1 / 60,
    );

    const elapsed = performance.now() - started;

    if (elapsed < 22) safe = population;
    else break;

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  safeNaiveLimit = safe;

  let recommended = 2500;
  let grid10kTime = 100;

  for (const population of [2500, 5000, 10000]) {
    const temporary = createState(
      layout,
      population,
      nextHop,
      `calibrate-grid-${population}`,
    );

    const temporaryGrid = createGrid(
      layout,
      params.cellSize,
      MAX_DANFOS,
    );

    const temporaryQuad = new Quadtree();

    stepSimulation(
      makeStepContext(
        temporary,
        temporaryGrid,
        temporaryQuad,
        "grid",
      ),
      1 / 60,
    );

    const started = performance.now();

    stepSimulation(
      makeStepContext(
        temporary,
        temporaryGrid,
        temporaryQuad,
        "grid",
      ),
      1 / 60,
    );

    const elapsed = performance.now() - started;

    if (population === 10000) {
      grid10kTime = elapsed;
    }

    if (elapsed < 25) {
      recommended = population;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  ctx.postMessage({
    type: "CALIBRATION",
    result: {
      naiveSafeLimit: safeNaiveLimit,
      maxRecommended: recommended,
      quality:
        grid10kTime < 12
          ? "high"
          : grid10kTime < 24
            ? "auto"
            : "low",
      sharedMemory: Boolean(sharedFloats),
    },
  });
}

async function runBenchmark() {
  const results: unknown[] = [];

  const workloads: Array<[EngineMode, number]> = [];

  for (const population of [500, 1000, 2500, 5000, 10000]) {
    workloads.push(["grid", population]);
  }

  for (const population of [500, 1000, 2500, 5000, 10000]) {
    workloads.push(["naive", population]);
  }

  let run = 0;

  for (const [benchmarkEngine, population] of workloads) {
    run += 1;

    ctx.postMessage({
      type: "BENCHMARK_PROGRESS",
      engine: benchmarkEngine,
      population,
      run,
      totalRuns: workloads.length,
    });

    if (
      benchmarkEngine === "naive" &&
      population > safeNaiveLimit
    ) {
      results.push({
        population,
        engine: benchmarkEngine,
        simulationMs: 0,
        candidateChecks: 0,
        skipped: true,
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      continue;
    }

    const temporary = createState(
      layout,
      population,
      nextHop,
      `benchmark-${benchmarkEngine}-${population}`,
    );

    const temporaryGrid = createGrid(
      layout,
      params.cellSize,
      MAX_DANFOS,
    );

    const temporaryQuad = new Quadtree();

    const times: number[] = [];
    let checks = 0;

    for (let i = 0; i < 3; i += 1) {
      stepSimulation(
        makeStepContext(
          temporary,
          temporaryGrid,
          temporaryQuad,
          benchmarkEngine,
        ),
        1 / 60,
      );
    }

    for (let i = 0; i < 6; i += 1) {
      const result = stepSimulation(
        makeStepContext(
          temporary,
          temporaryGrid,
          temporaryQuad,
          benchmarkEngine,
        ),
        1 / 60,
      );

      times.push(result.simulationMs);
      checks += result.candidateChecks;
    }

    times.sort((a, b) => a - b);

    results.push({
      population,
      engine: benchmarkEngine,
      simulationMs: times[Math.floor(times.length / 2)],
      candidateChecks: Math.round(checks / 6),
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  ctx.postMessage({
    type: "BENCHMARK_RESULT",
    results,
  });
}

let previous = performance.now();
let accumulator = 0;
let snapshotTimer = 0;
let statsTimer = 0;

function loop() {
  const now = performance.now();

  const elapsed = Math.min(0.1, (now - previous) / 1000);
  previous = now;

  if (playing) {
    accumulator += elapsed;

    let catchup = 0;

    while (accumulator >= 1 / 60 && catchup < 3) {
      lastStepStats = stepSimulation(
        makeStepContext(),
        1 / 60,
      );

      simTime += 1 / 60;
      accumulator -= 1 / 60;
      catchup += 1;
    }
  }

  snapshotTimer += elapsed;
  statsTimer += elapsed;

  if (snapshotTimer >= 1 / 30) {
    writeSnapshot();
    snapshotTimer = 0;
  }

  if (statsTimer >= 0.25) {
    publishStats();
    statsTimer = 0;
  }

  setTimeout(loop, 4);
}

ctx.onmessage = (event) => {
  const message = event.data;

  switch (message.type) {
    case "INIT": {
      layout = getLayout(message.layoutId ?? "mainland");
      blocked = new Set();
      nextHop = buildNextHop(layout, blocked);

      state = createState(
        layout,
        message.population ?? 500,
        nextHop,
      );

      rebuildSystems();

      if (message.sharedBuffer) {
        sharedHeader = new Int32Array(
          message.sharedBuffer,
          0,
          2,
        );

        sharedFloats = new Float32Array(
          message.sharedBuffer,
          8,
          MAX_DANFOS * 4,
        );
      } else {
        transferPool.push(
          new ArrayBuffer(MAX_DANFOS * 4 * 4),
          new ArrayBuffer(MAX_DANFOS * 4 * 4),
        );
      }

      writeSnapshot();

      ctx.postMessage({
        type: "READY",
        sharedMemory: Boolean(sharedFloats),
      });

      break;
    }

    case "RECYCLE":
      transferPool.push(message.buffer);
      break;

    case "SET_POPULATION": {
      let count = message.count;

      if (engine === "naive") {
        count = Math.min(count, safeNaiveLimit);
      }

      setPopulation(state, count, layout, nextHop);

      if (count !== message.count) {
        ctx.postMessage({
          type: "POPULATION_CLAMPED",
          population: count,
        });
      }

      break;
    }

    case "SET_ENGINE":
      engine = message.engine;

      if (engine === "naive" && state.count > safeNaiveLimit) {
        setPopulation(state, safeNaiveLimit, layout, nextHop);

        ctx.postMessage({
          type: "POPULATION_CLAMPED",
          population: safeNaiveLimit,
        });
      }

      break;

    case "SET_POINTER":
      pointer = message.pointer;
      break;

    case "SET_PLAYING":
      playing = message.playing;
      break;

    case "STEP":
      lastStepStats = stepSimulation(
        makeStepContext(),
        1 / 60,
      );

      simTime += 1 / 60;
      writeSnapshot();
      publishStats();
      break;

    case "SELECT":
      selectedId = message.id;
      publishStats();
      break;

    case "TOGGLE_BLOCK":
      toggleEdge(message.segmentIndex);
      break;

    case "CLEAR_BLOCKS":
      blocked.clear();
      nextHop = buildNextHop(layout, blocked);
      rerouteBlockedAgents();

      ctx.postMessage({
        type: "BLOCKED",
        blockedSegments: [],
      });

      break;

    case "RANDOM_INCIDENT": {
      const index =
        Math.floor(simTime * 997) % layout.edges.length;

      toggleEdge(index);
      break;
    }

    case "SET_TRAFFIC_LIGHTS":
      trafficLights = message.enabled;
      break;

    case "SET_PARAMS":
      params = {
        ...params,
        ...message.params,
      };

      pointer.radius = params.pointerRadius;

      if (message.params.cellSize) {
        grid = createGrid(
          layout,
          params.cellSize,
          MAX_DANFOS,
        );
      }

      break;

    case "SET_LAYOUT":
      layout = getLayout(message.layoutId);
      blocked.clear();

      nextHop = buildNextHop(layout, blocked);

      state = createState(
        layout,
        Math.min(state.count, MAX_DANFOS),
        nextHop,
        `lagos-${layout.id}`,
      );

      rebuildSystems();

      ctx.postMessage({
        type: "BLOCKED",
        blockedSegments: [],
      });

      break;

    case "RESET":
      blocked.clear();

      nextHop = buildNextHop(layout, blocked);

      state = createState(
        layout,
        state.count,
        nextHop,
        message.seed ?? "lagos-10000-demo",
      );

      break;

    case "CALIBRATE":
      void calibrate();
      break;

    case "RUN_BENCHMARK":
      void runBenchmark();
      break;
  }
};

loop();

export {};
