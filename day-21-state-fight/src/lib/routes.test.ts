import { describe, expect, it } from "vitest";
import * as routes from "./routes";

const { pathForScreen, screenFromPath } = routes;

describe("screen routes", () => {
  it.each([
    ["/", "home"],
    ["/modes", "modes"],
    ["/battle", "battle"],
    ["/atlas", "atlas"],
    ["/history", "history"],
    ["/results", "results"],
  ] as const)("maps %s to %s", (path, screen) => {
    expect(screenFromPath(path)).toBe(screen);
    expect(pathForScreen(screen)).toBe(path);
  });

  it("falls back to home for an unknown route", () => {
    expect(screenFromPath("/not-a-screen")).toBe("home");
  });

  it("ignores a trailing slash", () => {
    expect(screenFromPath("/atlas/")).toBe("atlas");
  });

  it("shows results when a finished battle has cleared its active run", () => {
    expect("resolveActiveScreen" in routes).toBe(true);
    const resolveActiveScreen = (routes as typeof routes & {
      resolveActiveScreen: (screen: "battle", hasRun: boolean, hasResults: boolean) => string;
    }).resolveActiveScreen;
    expect(resolveActiveScreen?.("battle", false, true)).toBe("results");
  });
});
