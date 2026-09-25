import type { EngineMode } from "../types";
import type { SpatialGrid } from "./grid";
import { cellCoordinates, cellIndex } from "./grid";
import type { Quadtree } from "./quadtree";
import type { SimState } from "./state";

export interface NeighbourStats {
  candidates: number;
  neighbours: number;

  sepX: number;
  sepZ: number;

  avgVx: number;
  avgVz: number;

  avgX: number;
  avgZ: number;
}

const scratchCandidates: number[] = [];

function reset(output: NeighbourStats) {
  output.candidates = 0;
  output.neighbours = 0;

  output.sepX = 0;
  output.sepZ = 0;

  output.avgVx = 0;
  output.avgVz = 0;

  output.avgX = 0;
  output.avgZ = 0;
}

function consider(
  state: SimState,
  i: number,
  j: number,
  radiusSq: number,
  output: NeighbourStats,
) {
  if (i === j) return;

  output.candidates += 1;

  const dx = state.x[i] - state.x[j];
  const dz = state.z[i] - state.z[j];

  const distanceSq = dx * dx + dz * dz;

  if (distanceSq <= 0.0001 || distanceSq > radiusSq) return;

  output.neighbours += 1;

  output.avgVx += state.vx[j];
  output.avgVz += state.vz[j];

  output.avgX += state.x[j];
  output.avgZ += state.z[j];

  output.sepX += dx / distanceSq;
  output.sepZ += dz / distanceSq;
}

export function collectNeighbours(
  engine: EngineMode,
  state: SimState,
  i: number,
  radius: number,
  grid: SpatialGrid,
  quadtree: Quadtree,
  output: NeighbourStats,
) {
  reset(output);

  const radiusSq = radius * radius;

  if (engine === "naive") {
    for (let j = 0; j < state.count; j += 1) {
      consider(state, i, j, radiusSq, output);
    }

    return;
  }

  if (engine === "quadtree") {
    quadtree.query(state.x[i], state.z[i], radius, scratchCandidates);

    for (const j of scratchCandidates) {
      consider(state, i, j, radiusSq, output);
    }

    return;
  }

  const [cx, cz] = cellCoordinates(grid, state.x[i], state.z[i]);

  for (let oz = -1; oz <= 1; oz += 1) {
    for (let ox = -1; ox <= 1; ox += 1) {
      const cell = cellIndex(grid, cx + ox, cz + oz);
      if (cell < 0) continue;

      let j = grid.head[cell];

      while (j !== -1) {
        consider(state, i, j, radiusSq, output);
        j = grid.next[j];
      }
    }
  }
}

export function inspectNeighbours(
  engine: EngineMode,
  state: SimState,
  i: number,
  radius: number,
  grid: SpatialGrid,
  quadtree: Quadtree,
) {
  const ids: number[] = [];
  let candidates = 0;
  const radiusSq = radius * radius;

  const test = (j: number) => {
    if (j === i) return;

    candidates += 1;

    const dx = state.x[i] - state.x[j];
    const dz = state.z[i] - state.z[j];

    if (dx * dx + dz * dz <= radiusSq) {
      ids.push(j);
    }
  };

  if (engine === "naive") {
    for (let j = 0; j < state.count; j += 1) test(j);
  } else if (engine === "quadtree") {
    quadtree.query(state.x[i], state.z[i], radius, scratchCandidates);
    scratchCandidates.forEach(test);
  } else {
    const [cx, cz] = cellCoordinates(grid, state.x[i], state.z[i]);

    for (let oz = -1; oz <= 1; oz += 1) {
      for (let ox = -1; ox <= 1; ox += 1) {
        const cell = cellIndex(grid, cx + ox, cz + oz);
        if (cell < 0) continue;

        let j = grid.head[cell];

        while (j !== -1) {
          test(j);
          j = grid.next[j];
        }
      }
    }
  }

  return {
    candidates,
    ids,
  };
}
