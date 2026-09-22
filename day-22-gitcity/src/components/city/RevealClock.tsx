"use client";

import { useEffect } from "react";

import { sceneStore } from "@/stores/scene-store";

export function RevealClock() {
  useEffect(() => {
    if (!sceneStore.getState().isRevealing) {
      return;
    }

    const startedAt = performance.now();
    const duration = 6200;
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration);

      sceneStore.setRevealProgress(progress);

      if (progress >= 1) {
        sceneStore.setTourActive(false);
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
