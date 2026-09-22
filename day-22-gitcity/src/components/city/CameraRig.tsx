"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";

import { useSceneStore } from "@/stores/scene-store";
import { getRevealState } from "@/lib/city/reveal";

const cameraPositions = {
  overview: [28, 25, 28],
  street: [8, 7, 13],
  hall: [9, 6, 9],
  repositories: [20, 15, 4],
} as const;

export function CameraRig() {
  const { camera } = useThree();
  const cameraMode = useSceneStore((value) => value.cameraMode);
  const revealProgress = useSceneStore((value) => value.revealProgress);
  const target = useMemo(() => ({ x: 0, y: 1.5, z: 0 }), []);

  useFrame(() => {
    const [x, y, z] = cameraPositions[cameraMode];
    const reveal = getRevealState(revealProgress);
    const tilt = reveal.phase === "tilt" || reveal.phase === "complete" ? 1 : revealProgress * 1.2;

    camera.position.lerp({ x, y: y + tilt * 2.5, z } as never, 0.04);
    camera.lookAt(target.x, target.y, target.z);
  });

  return null;
}
