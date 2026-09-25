import type { CityLayout } from "../types";
import { MAX_DANFOS } from "../types";
import { hashSeed, mixSeed, nextFloat } from "./rng";
import { nextNodeFor } from "./pathfinding";

export interface SimState {
  count: number;
  maxCount: number;

  x: Float32Array;
  z: Float32Array;
  vx: Float32Array;
  vz: Float32Array;
  heading: Float32Array;

  currentNode: Uint16Array;
  nextNode: Uint16Array;
  destination: Uint16Array;

  status: Uint8Array;
  rng: Uint32Array;
}

function random(state: SimState, index: number) {
  const [seed, value] = nextFloat(state.rng[index]);
  state.rng[index] = seed;
  return value;
}

function chooseDestination(
  state: SimState,
  index: number,
  nodeCount: number,
  current: number,
) {
  let destination = current;

  while (destination === current) {
    destination = Math.floor(random(state, index) * nodeCount);
  }

  return destination;
}

function spawnAgent(
  state: SimState,
  index: number,
  layout: CityLayout,
  nextHop: Int16Array,
) {
  const nodeCount = layout.nodes.length;

  const current = Math.floor(random(state, index) * nodeCount);
  const destination = chooseDestination(state, index, nodeCount, current);

  let next = nextNodeFor(nextHop, nodeCount, current, destination);

  if (next < 0 || next === current) {
    next = (current + 1) % nodeCount;
  }

  const a = layout.nodes[current];
  const b = layout.nodes[next];

  const progress = random(state, index) * 0.9;
  const lane = (random(state, index) - 0.5) * 6;

  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const length = Math.max(1, Math.hypot(dx, dz));

  const nx = -dz / length;
  const nz = dx / length;

  state.x[index] = a.x + dx * progress + nx * lane;
  state.z[index] = a.z + dz * progress + nz * lane;

  const speed = 7 + random(state, index) * 4;

  state.vx[index] = (dx / length) * speed;
  state.vz[index] = (dz / length) * speed;
  state.heading[index] = Math.atan2(state.vz[index], state.vx[index]);

  state.currentNode[index] = current;
  state.nextNode[index] = next;
  state.destination[index] = destination;
  state.status[index] = 0;
}

export function createState(
  layout: CityLayout,
  count: number,
  nextHop: Int16Array,
  seed = "lagos-10000-demo",
) {
  const maxCount = MAX_DANFOS;
  const rootSeed = hashSeed(seed);

  const state: SimState = {
    count: 0,
    maxCount,

    x: new Float32Array(maxCount),
    z: new Float32Array(maxCount),
    vx: new Float32Array(maxCount),
    vz: new Float32Array(maxCount),
    heading: new Float32Array(maxCount),

    currentNode: new Uint16Array(maxCount),
    nextNode: new Uint16Array(maxCount),
    destination: new Uint16Array(maxCount),

    status: new Uint8Array(maxCount),
    rng: new Uint32Array(maxCount),
  };

  for (let i = 0; i < maxCount; i += 1) {
    state.rng[i] = mixSeed(rootSeed, i);
  }

  setPopulation(state, count, layout, nextHop);

  return state;
}

export function setPopulation(
  state: SimState,
  count: number,
  layout: CityLayout,
  nextHop: Int16Array,
) {
  const target = Math.min(state.maxCount, Math.max(1, count));

  if (target > state.count) {
    for (let i = state.count; i < target; i += 1) {
      spawnAgent(state, i, layout, nextHop);
    }
  }

  state.count = target;
}

export function agentRandom(state: SimState, index: number) {
  return random(state, index);
}
