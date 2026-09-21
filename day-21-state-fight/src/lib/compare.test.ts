import { describe, expect, it } from "vitest";
import { getWinner, resolveBattle } from "./compare";
import type { Battle } from "../types/game";

const battle = (overrides: Partial<Battle> = {}): Battle => ({
  id: "test",
  stateAId: "oyo",
  stateBId: "enugu",
  metricId: "area",
  difficulty: "easy",
  final: false,
  ...overrides,
});

describe("battle comparison", () => {
  it("selects the larger land area", () => {
    expect(getWinner(battle())).toBe("oyo");
  });

  it("selects the earlier creation year", () => {
    expect(getWinner(battle({ stateAId: "rivers", stateBId: "abia", metricId: "created" }))).toBe("rivers");
  });

  it("awards no points for an incorrect pick", () => {
    expect(resolveBattle(battle(), "enugu", 0).score).toBe(0);
  });
});
