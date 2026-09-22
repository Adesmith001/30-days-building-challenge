import { describe, expect, it } from "vitest";

import { contributionHeight } from "./building-height";

describe("contributionHeight", () => {
  it("keeps zero contribution days flat", () => {
    expect(contributionHeight(0)).toBe(0);
  });

  it("is deterministic and capped", () => {
    expect(contributionHeight(8)).toBe(contributionHeight(8));
    expect(contributionHeight(1_000_000)).toBeLessThanOrEqual(10);
  });
});
