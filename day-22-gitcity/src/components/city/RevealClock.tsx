"use client";

import { useEffect } from "react";

import { sceneStore, useSceneStore } from "@/stores/scene-store";

export function RevealClock() {
  const isRevealing = useSceneStore((value) => value.isRevealing);

  useEffect(() => {
    if (!isRevealing) {
      return;
    }

    const startedAt = performance.now();
    const duration = 6200;
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration);

      sceneStore.setRevealProgress(progress);

      if (progress >= 1) {
        sceneStore.setRevealing(false);
        window.clearInterval(timer);
      }
    }, 32);

    return () => window.clearInterval(timer);
  }, [isRevealing]);

  return null;
}
