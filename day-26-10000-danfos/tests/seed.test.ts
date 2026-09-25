import { describe, expect, it } from "vitest";
import {
  hashSeed,
  mixSeed,
  nextU32,
} from "../src/simulation/rng";

describe("seeded RNG", () => {
  it("is deterministic", () => {
    const seed = hashSeed("lagos-demo");

    expect(nextU32(seed)).toBe(nextU32(seed));
    expect(mixSeed(seed, 12)).toBe(
      mixSeed(seed, 12),
    );
  });

  it("produces different streams per agent", () => {
    const seed = hashSeed("lagos-demo");

    expect(mixSeed(seed, 1)).not.toBe(
      mixSeed(seed, 2),
    );
  });
});
