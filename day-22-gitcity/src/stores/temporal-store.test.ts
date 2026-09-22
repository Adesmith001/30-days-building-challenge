import { describe, expect, it } from "vitest";

import { temporalStore } from "./temporal-store";

describe("temporal store", () => {
  it("does not retain removed year replay state", () => {
    const state = temporalStore.getState();

    expect("replayActive" in state).toBe(false);
    expect("replayPlaying" in state).toBe(false);
    expect("replayCursor" in state).toBe(false);
    expect("replaySpeed" in state).toBe(false);
  });
});
