import { describe, expect, it } from "vitest";

import { getRevealState } from "./reveal";

describe("getRevealState", () => {
  it("keeps the city flat before construction starts", () => {
    expect(getRevealState(0)).toEqual({ progress: 0, phase: "ground" });
  });

  it("moves through skyline and camera phases", () => {
    expect(getRevealState(0.4).phase).toBe("rise");
    expect(getRevealState(0.78).phase).toBe("tilt");
    expect(getRevealState(1).phase).toBe("complete");
  });
});
