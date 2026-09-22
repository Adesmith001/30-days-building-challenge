"use client";

import { useSyncExternalStore } from "react";

import type { CameraMode, SceneThemeName } from "@/types/scene";

export type SceneQuality = "high" | "balanced" | "low";

export interface SceneState {
  theme: SceneThemeName;
  revealProgress: number;
  isRevealing: boolean;
  cameraMode: CameraMode;
  cameraMoving: boolean;
  selectedLotId: string | null;
  hoveredLotId: string | null;
  quality: SceneQuality;
}

const initialState: SceneState = {
  theme: "graphite",
  revealProgress: 1,
  isRevealing: false,
  cameraMode: "overview",
  cameraMoving: false,
  selectedLotId: null,
  hoveredLotId: null,
  quality: "balanced",
};

let state = initialState;
const listeners = new Set<() => void>();

function update(partial: Partial<SceneState>) {
  state = {
    ...state,
    ...partial,
  };

  listeners.forEach((listener) => listener());
}

export const sceneStore = {
  getState() {
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },
  setTheme(theme: SceneThemeName) {
    update({ theme });
  },
  setRevealProgress(revealProgress: number) {
    update({ revealProgress });
  },
  setRevealing(isRevealing: boolean) {
    update({ isRevealing });
  },
  navigateTo(cameraMode: CameraMode) {
    update({ cameraMode, cameraMoving: true });
  },
  releaseCamera() {
    update({ cameraMoving: false });
  },
  selectLot(selectedLotId: string | null) {
    update({ selectedLotId });
  },
  hoverLot(hoveredLotId: string | null) {
    update({ hoveredLotId });
  },
  setQuality(quality: SceneQuality) {
    update({ quality });
  },
};

export function useSceneStore<T>(selector: (value: SceneState) => T) {
  return useSyncExternalStore(
    sceneStore.subscribe,
    () => selector(sceneStore.getState()),
    () => selector(initialState),
  );
}
