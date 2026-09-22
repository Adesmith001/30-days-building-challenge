import { describe, expect, it } from "vitest";

import { deriveReplayMilestones } from "./replay-milestones";

describe("deriveReplayMilestones", () => {
  it("creates meaningful milestones for a year", () => {
    const milestones = deriveReplayMilestones(2026, {
      date: "2026-05-11",
      count: 34,
    }, 23);

    expect(milestones.map((milestone) => milestone.kind)).toEqual([
      "year-start",
      "first-contribution",
      "longest-streak",
      "busiest-day",
      "year-end",
    ]);
    expect(milestones[3].date).toBe("2026-05-11");
  });
});
