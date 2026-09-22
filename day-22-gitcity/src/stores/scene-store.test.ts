import { describe, expect, it } from "vitest";

import { sceneStore } from "./scene-store";

describe("scene store camera ownership", () => {
  it("manual navigation starts one guided move", () => {
    sceneStore.navigateTo("hall");

    expect(sceneStore.getState().cameraMode).toBe("hall");
    expect(sceneStore.getState().cameraMoving).toBe(true);
  });

  it("releases the camera when the user starts exploring", () => {
    sceneStore.releaseCamera();

    expect(sceneStore.getState().cameraMoving).toBe(false);
  });

  it("does not retain removed photo or tour state", () => {
    expect("photoMode" in sceneStore.getState()).toBe(false);
    expect("tourActive" in sceneStore.getState()).toBe(false);
  });
});
