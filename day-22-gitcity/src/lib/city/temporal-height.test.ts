import { describe, expect, it } from "vitest";

import { interpolateTemporalHeight } from "./temporal-height";

describe("temporal height", () => {
  it("morphs from the previous height to the current height", () => {
    expect(interpolateTemporalHeight(8, 3, 0)).toBe(3);
    expect(interpolateTemporalHeight(8, 3, 1)).toBe(8);
    expect(interpolateTemporalHeight(8, 3, 0.5)).toBe(5.5);
  });
});
