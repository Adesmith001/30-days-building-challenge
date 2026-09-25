import { describe, expect, it } from "vitest";
import { hashString, seededRandom } from "@/lib/rng";

describe("seeded random", () => {
  it("produces deterministic values", () => {
    const a = seededRandom(hashString("incident"));
    const b = seededRandom(hashString("incident"));

    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces values within the unit interval", () => {
    const next = seededRandom(25);
    expect(Array.from({ length: 20 }, next).every((value) => value >= 0 && value < 1)).toBe(true);
  });
});
