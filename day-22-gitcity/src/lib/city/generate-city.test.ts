import { describe, expect, it } from "vitest";

import { createDemoSnapshot } from "@/lib/github/demo-snapshot";

import { generateCity } from "./generate-city";

describe("generateCity", () => {
  it("generates the same model for the same login and year", () => {
    const snapshot = createDemoSnapshot("octocat", 2025);
    const first = generateCity(snapshot);
    const second = generateCity(snapshot);

    expect(first).toEqual(second);
    expect(first.lots).toHaveLength(365);
    expect(first.landmarks).toHaveLength(6);
  });
});
