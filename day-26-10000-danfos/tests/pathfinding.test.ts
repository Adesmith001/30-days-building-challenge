import {
  describe,
  expect,
  it,
} from "vitest";
import { getLayout } from "../src/data/layouts";
import {
  buildNextHop,
  edgeKey,
  nextNodeFor,
} from "../src/simulation/pathfinding";

describe("pathfinding", () => {
  it("finds a route across the network", () => {
    const layout = getLayout("mainland");
    const table = buildNextHop(layout);

    const next = nextNodeFor(
      table,
      layout.nodes.length,
      0,
      6,
    );

    expect(next).toBeGreaterThanOrEqual(0);
    expect(next).not.toBe(0);
  });

  it("reroutes around a blocked edge", () => {
    const layout = getLayout("mainland");

    const normal = buildNextHop(layout);

    const original = nextNodeFor(
      normal,
      layout.nodes.length,
      0,
      3,
    );

    const blocked = new Set([
      edgeKey(0, original),
    ]);

    const rerouted = buildNextHop(
      layout,
      blocked,
    );

    const next = nextNodeFor(
      rerouted,
      layout.nodes.length,
      0,
      3,
    );

    expect(next).not.toBe(original);
  });
});
