import { describe, expect, it } from "vitest";

import { fillCalendarYear } from "./fill-calendar";

describe("fillCalendarYear", () => {
  it("returns every day in a leap year and fills missing days", () => {
    const days = fillCalendarYear(2024, [
      {
        date: "2024-02-29",
        contributionCount: 7,
        weekday: 4,
        contributionLevel: "SECOND_QUARTILE",
      },
    ]);

    expect(days).toHaveLength(366);
    expect(days.find((day) => day.date === "2024-02-29")?.count).toBe(7);
    expect(days.find((day) => day.date === "2024-02-28")?.count).toBe(0);
  });
});
