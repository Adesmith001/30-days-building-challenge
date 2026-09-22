import { describe, expect, it } from "vitest";

import { getSceneTheme } from "./themes";

describe("getSceneTheme", () => {
  it("returns a complete theme for each supported name", () => {
    expect(getSceneTheme("graphite").accent).toBe("#44f3a9");
    expect(getSceneTheme("tungsten").accent).toBe("#f5c369");
    expect(getSceneTheme("mint-night").background).toBe("#071410");
  });
});
