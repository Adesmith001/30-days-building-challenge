import {
  describe,
  expect,
  it,
} from "vitest";
import { getLayout } from "../src/data/layouts";
import {
  createGrid,
  rebuildGrid,
} from "../src/simulation/grid";
import { inspectNeighbours } from "../src/simulation/neighbors";
import { buildNextHop } from "../src/simulation/pathfinding";
import { Quadtree } from "../src/simulation/quadtree";
import { createState } from "../src/simulation/state";

describe("grid neighbour correctness", () => {
  it("matches brute force for deterministic fixture", () => {
    const layout = getLayout("mainland");
    const nextHop = buildNextHop(layout);

    const state = createState(
      layout,
      100,
      nextHop,
      "golden-neighbours",
    );

    const grid = createGrid(
      layout,
      22,
      state.maxCount,
    );

    rebuildGrid(grid, state);

    const quadtree = new Quadtree();

    for (let id = 0; id < 25; id += 1) {
      const naive = inspectNeighbours(
        "naive",
        state,
        id,
        18,
        grid,
        quadtree,
      );

      const spatial = inspectNeighbours(
        "grid",
        state,
        id,
        18,
        grid,
        quadtree,
      );

      expect(
        [...spatial.ids].sort((a, b) => a - b),
      ).toEqual(
        [...naive.ids].sort((a, b) => a - b),
      );
    }
  });
});
