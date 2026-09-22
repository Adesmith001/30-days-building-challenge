"use client";

import { useSyncExternalStore } from "react";

import type { ReplaySpeed, TemporalState } from "@/types/temporal";

const initialState: TemporalState = {
  replayActive: false,
  replayPlaying: false,
  replayCursor: 0,
  replaySpeed: 2,
  yearShift: 1,
  layers: {
    ghost: false,
    streaks: true,
    differences: false,
  },
};

let state = initialState;
const listeners = new Set<() => void>();

function update(partial: Partial<TemporalState>) {
  state = {
    ...state,
    ...partial,
  };

  listeners.forEach((listener) => listener());
}

export const temporalStore = {
  getState() {
    return state;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },
  beginReplay() {
    update({ replayActive: true, replayPlaying: true, replayCursor: 0 });
  },
  endReplay() {
    update({ replayActive: false, replayPlaying: false, replayCursor: 0 });
  },
  setReplayPlaying(replayPlaying: boolean) {
    update({ replayPlaying });
  },
  setReplayCursor(replayCursor: number) {
    update({ replayCursor });
  },
  setReplaySpeed(replaySpeed: ReplaySpeed) {
    update({ replaySpeed });
  },
  setYearShift(yearShift: number) {
    update({ yearShift: Math.min(1, Math.max(0, yearShift)) });
  },
  toggleLayer(layer: keyof TemporalState["layers"]) {
    update({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer],
      },
    });
  },
};

export function useTemporalStore<T>(selector: (value: TemporalState) => T) {
  return useSyncExternalStore(
    temporalStore.subscribe,
    () => selector(temporalStore.getState()),
    () => selector(initialState),
  );
}
