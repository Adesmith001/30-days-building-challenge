import type { CityLayout } from "../types";
import type { SimState } from "./state";
import { getLayoutBounds } from "../data/layouts";

export interface SpatialGrid {
  minX: number;
  minZ: number;
  cols: number;
  rows: number;
  cellSize: number;

  head: Int32Array;
  next: Int32Array;
  agentCell: Int32Array;

  occupied: number;
}

export function createGrid(
  layout: CityLayout,
  cellSize: number,
  maxAgents: number,
) {
  const bounds = getLayoutBounds(layout);

  const cols = Math.ceil((bounds.maxX - bounds.minX) / cellSize);
  const rows = Math.ceil((bounds.maxZ - bounds.minZ) / cellSize);

  return {
    minX: bounds.minX,
    minZ: bounds.minZ,
    cols,
    rows,
    cellSize,
    head: new Int32Array(cols * rows),
    next: new Int32Array(maxAgents),
    agentCell: new Int32Array(maxAgents),
    occupied: 0,
  } satisfies SpatialGrid;
}

export function cellCoordinates(grid: SpatialGrid, x: number, z: number) {
  const cx = Math.floor((x - grid.minX) / grid.cellSize);
  const cz = Math.floor((z - grid.minZ) / grid.cellSize);

  return [
    Math.max(0, Math.min(grid.cols - 1, cx)),
    Math.max(0, Math.min(grid.rows - 1, cz)),
  ] as const;
}

export function cellIndex(grid: SpatialGrid, cx: number, cz: number) {
  if (cx < 0 || cz < 0 || cx >= grid.cols || cz >= grid.rows) {
    return -1;
  }

  return cz * grid.cols + cx;
}

export function rebuildGrid(grid: SpatialGrid, state: SimState) {
  grid.head.fill(-1);
  grid.occupied = 0;

  for (let i = 0; i < state.count; i += 1) {
    const [cx, cz] = cellCoordinates(grid, state.x[i], state.z[i]);
    const cell = cellIndex(grid, cx, cz);

    if (grid.head[cell] === -1) {
      grid.occupied += 1;
    }

    grid.agentCell[i] = cell;
    grid.next[i] = grid.head[cell];
    grid.head[cell] = i;
  }
}
