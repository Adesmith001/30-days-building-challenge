import { describe, expect, it } from "vitest";
import { clockToSeconds, duration, secondsToClock } from "@/lib/time";

describe("incident time", () => {
  it("round-trips a clock value", () => {
    expect(secondsToClock(clockToSeconds("14:10:25"))).toBe("14:10:25");
  });

  it("wraps clock values across midnight", () => {
    expect(secondsToClock(24 * 3600 + 7)).toBe("00:00:07");
  });

  it("formats elapsed time", () => {
    expect(duration(125)).toBe("02:05");
  });
});
