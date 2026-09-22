import { describe, expect, it } from "vitest";

import { getLongestStreakDates } from "./longest-streak";

describe("getLongestStreakDates", () => {
  it("returns the dates in the longest active run", () => {
    const dates = getLongestStreakDates([
      { date: "2026-01-01", count: 2, weekday: 4, level: "FIRST_QUARTILE", isFuture: false },
      { date: "2026-01-02", count: 4, weekday: 5, level: "SECOND_QUARTILE", isFuture: false },
      { date: "2026-01-03", count: 0, weekday: 6, level: "NONE", isFuture: false },
      { date: "2026-01-04", count: 7, weekday: 0, level: "THIRD_QUARTILE", isFuture: false },
    ]);

    expect(dates).toEqual(["2026-01-01", "2026-01-02"]);
  });
});
