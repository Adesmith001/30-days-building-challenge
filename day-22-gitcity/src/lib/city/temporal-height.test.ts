import { describe, expect, it } from "vitest";

import { getReplayFactor, interpolateTemporalHeight } from "./temporal-height";

describe("temporal height", () => {
  it("morphs from the previous height to the current height", () => {
    expect(interpolateTemporalHeight(8, 3, 0)).toBe(3);
    expect(interpolateTemporalHeight(8, 3, 1)).toBe(8);
    expect(interpolateTemporalHeight(8, 3, 0.5)).toBe(5.5);
  });

  it("reveals replay lots only when the cursor reaches them", () => {
    expect(getReplayFactor(10, 5, true)).toBe(0);
    expect(getReplayFactor(10, 10, true)).toBe(1);
    expect(getReplayFactor(10, 5, false)).toBe(1);
  });
});
