import { describe, expect, it } from "vitest";

import { deriveYearStats } from "./derive-year-stats";

describe("deriveYearStats", () => {
  it("ignores future days and derives streak and peaks", () => {
    const stats = deriveYearStats([
      { date: "2025-01-01", count: 2, weekday: 3, level: "FIRST_QUARTILE", isFuture: false },
      { date: "2025-01-02", count: 5, weekday: 4, level: "SECOND_QUARTILE", isFuture: false },
      { date: "2025-01-03", count: 0, weekday: 5, level: "NONE", isFuture: false },
      { date: "2025-01-04", count: 99, weekday: 6, level: "FOURTH_QUARTILE", isFuture: true },
    ]);

    expect(stats.totalContributions).toBe(7);
    expect(stats.activeDays).toBe(2);
    expect(stats.longestStreak).toBe(2);
    expect(stats.busiestDay).toEqual({ date: "2025-01-02", count: 5 });
    expect(stats.busiestMonth).toEqual({ month: 1, count: 7 });
  });
});
