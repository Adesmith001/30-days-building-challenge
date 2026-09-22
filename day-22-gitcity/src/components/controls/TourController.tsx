"use client";

import { useEffect } from "react";

import { sceneStore, useSceneStore } from "@/stores/scene-store";

const modes = ["overview", "street", "hall", "repositories"] as const;

export function TourController() {
  const active = useSceneStore((value) => value.tourActive);

  useEffect(() => {
    if (!active) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % modes.length;
      sceneStore.setCameraMode(modes[index]);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [active]);

  return null;
}
