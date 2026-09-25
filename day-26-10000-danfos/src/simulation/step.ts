import type {
  CityLayout,
  EngineMode,
  PointerForce,
  SimParams,
} from "../types";
import type { SpatialGrid } from "./grid";
import { rebuildGrid } from "./grid";
import { collectNeighbours } from "./neighbors";
import { nextNodeFor } from "./pathfinding";
import type { Quadtree } from "./quadtree";
import type { SimState } from "./state";
import { agentRandom } from "./state";

export interface StepContext {
  layout: CityLayout;
  state: SimState;

  grid: SpatialGrid;
  quadtree: Quadtree;

  engine: EngineMode;
  nextHop: Int16Array;

  params: SimParams;
  pointer: PointerForce;

  trafficLights: boolean;
  simTime: number;
}

const neighbourScratch = {
  candidates: 0,
  neighbours: 0,
  sepX: 0,
  sepZ: 0,
  avgVx: 0,
  avgVz: 0,
  avgX: 0,
  avgZ: 0,
};

function normalize(x: number, z: number) {
  const length = Math.max(0.0001, Math.hypot(x, z));
  return [x / length, z / length] as const;
}

function chooseNewDestination(context: StepContext, i: number) {
  const { state, layout, nextHop } = context;
  const current = state.currentNode[i];

  let destination = current;

  while (destination === current) {
    destination = Math.floor(agentRandom(state, i) * layout.nodes.length);
  }

  state.destination[i] = destination;

  const next = nextNodeFor(
    nextHop,
    layout.nodes.length,
    current,
    destination,
  );

  state.nextNode[i] = next >= 0 ? next : current;
}

function advanceRoute(context: StepContext, i: number) {
  const { state, layout, nextHop } = context;

  state.currentNode[i] = state.nextNode[i];

  if (state.currentNode[i] === state.destination[i]) {
    chooseNewDestination(context, i);
    return;
  }

  const next = nextNodeFor(
    nextHop,
    layout.nodes.length,
    state.currentNode[i],
    state.destination[i],
  );

  if (next < 0 || next === state.currentNode[i]) {
    chooseNewDestination(context, i);
    state.status[i] = 2;
    return;
  }

  state.nextNode[i] = next;
}

function redLight(nodeIndex: number, simTime: number) {
  const cycle = (simTime * 1000 + nodeIndex * 1370) % 9000;
  return cycle > 4700 && cycle < 8300;
}

export function stepSimulation(context: StepContext, dt: number) {
  const start = performance.now();

  const {
    state,
    grid,
    quadtree,
    engine,
    params,
    layout,
    pointer,
  } = context;

  if (engine === "grid") {
    rebuildGrid(grid, state);
  }

  if (engine === "quadtree") {
    quadtree.rebuild(state);
  }

  let totalCandidates = 0;
  let totalNeighbours = 0;

  for (let i = 0; i < state.count; i += 1) {
    collectNeighbours(
      engine,
      state,
      i,
      params.neighbourRadius,
      grid,
      quadtree,
      neighbourScratch,
    );

    totalCandidates += neighbourScratch.candidates;
    totalNeighbours += neighbourScratch.neighbours;

    const target = layout.nodes[state.nextNode[i]];

    let dx = target.x - state.x[i];
    let dz = target.z - state.z[i];

    const distance = Math.hypot(dx, dz);

    if (distance < 7) {
      advanceRoute(context, i);

      const nextTarget = layout.nodes[state.nextNode[i]];

      dx = nextTarget.x - state.x[i];
      dz = nextTarget.z - state.z[i];
    }

    const [roadX, roadZ] = normalize(dx, dz);

    let steerX = roadX * params.roadForce;
    let steerZ = roadZ * params.roadForce;

    if (neighbourScratch.neighbours > 0) {
      const inv = 1 / neighbourScratch.neighbours;

      const [alignX, alignZ] = normalize(
        neighbourScratch.avgVx * inv,
        neighbourScratch.avgVz * inv,
      );

      const [cohesionX, cohesionZ] = normalize(
        neighbourScratch.avgX * inv - state.x[i],
        neighbourScratch.avgZ * inv - state.z[i],
      );

      steerX += neighbourScratch.sepX * params.separation;
      steerZ += neighbourScratch.sepZ * params.separation;

      steerX += alignX * params.alignment;
      steerZ += alignZ * params.alignment;

      steerX += cohesionX * params.cohesion;
      steerZ += cohesionZ * params.cohesion;
    }

    if (
      pointer.active &&
      pointer.mode !== "roadblock" &&
      pointer.mode !== "inspect"
    ) {
      const px = state.x[i] - pointer.x;
      const pz = state.z[i] - pointer.z;

      const pointerDistance = Math.hypot(px, pz);

      if (pointerDistance < pointer.radius && pointerDistance > 0.01) {
        const influence = 1 - pointerDistance / pointer.radius;

        if (pointer.mode === "push") {
          steerX += (px / pointerDistance) * influence * 26;
          steerZ += (pz / pointerDistance) * influence * 26;
        }

        if (pointer.mode === "attract") {
          steerX -= (px / pointerDistance) * influence * 18;
          steerZ -= (pz / pointerDistance) * influence * 18;
        }

        if (pointer.mode === "vortex") {
          steerX += (-pz / pointerDistance) * influence * 30;
          steerZ += (px / pointerDistance) * influence * 30;
        }
      }
    }

    let targetSpeed = params.maxSpeed;

    const signalNode = state.nextNode[i];
    const signal = layout.nodes[signalNode];

    if (
      context.trafficLights &&
      signal.signal &&
      distance < 30 &&
      redLight(signalNode, context.simTime)
    ) {
      targetSpeed *= Math.max(0.12, distance / 30);
    }

    state.vx[i] += steerX * dt * 3.5;
    state.vz[i] += steerZ * dt * 3.5;

    const speed = Math.max(0.001, Math.hypot(state.vx[i], state.vz[i]));

    if (speed > targetSpeed) {
      state.vx[i] = (state.vx[i] / speed) * targetSpeed;
      state.vz[i] = (state.vz[i] / speed) * targetSpeed;
    }

    state.vx[i] *= 0.996;
    state.vz[i] *= 0.996;

    state.x[i] += state.vx[i] * dt;
    state.z[i] += state.vz[i] * dt;

    state.heading[i] = Math.atan2(state.vz[i], state.vx[i]);

    const finalSpeed = Math.hypot(state.vx[i], state.vz[i]);
    state.status[i] = finalSpeed < 2.5 ? 1 : 0;
  }

  return {
    simulationMs: performance.now() - start,
    candidateChecks: totalCandidates,
    avgNeighbours: totalNeighbours / Math.max(1, state.count),
    occupiedCells: engine === "grid" ? grid.occupied : 0,
  };
}
