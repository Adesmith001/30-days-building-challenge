"use client";

import { useSyncExternalStore } from "react";

import type { TemporalState } from "@/types/temporal";

const initialState: TemporalState = {
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
