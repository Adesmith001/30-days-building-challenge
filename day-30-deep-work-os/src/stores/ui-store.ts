import { create } from "zustand";

import type { ReentryState } from "@/types";

type Overlay =
  | null
  | "park"
  | "checkpoint"
  | "close"
  | "time-complete"
  | "parking";

interface UIState {
  overlay: Overlay;
  reentry: ReentryState | null;

  setOverlay: (overlay: Overlay) => void;
  setReentry: (reentry: ReentryState | null) => void;
}

export const useUIStore = create<UIState>(
  (set) => ({
    overlay: null,
    reentry: null,

    setOverlay: (overlay) =>
      set({ overlay }),

    setReentry: (reentry) =>
      set({ reentry }),
  }),
);