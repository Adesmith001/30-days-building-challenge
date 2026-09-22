"use client";

import type { CityLandmark } from "@/types/city";
import { getSceneTheme } from "@/lib/city/themes";
import { useSceneStore } from "@/stores/scene-store";

export function RepositoryLandmarks({ landmarks }: { landmarks: CityLandmark[] }) {
  const themeName = useSceneStore((value) => value.theme);
  const theme = getSceneTheme(themeName);

  return (
    <group>
      {landmarks.map((landmark) => (
        <group key={landmark.repositoryId} position={[landmark.position[0], landmark.height / 2, landmark.position[2]]}>
          <mesh castShadow>
            <boxGeometry args={[landmark.footprint, landmark.height, landmark.footprint]} />
            <meshStandardMaterial color={landmark.languageColor ?? theme.building} roughness={0.35} metalness={0.74} />
          </mesh>
          <mesh position={[0, landmark.height / 2 + 0.5, 0]}>
            <boxGeometry args={[landmark.footprint * 0.62, 0.08, landmark.footprint * 0.62]} />
            <meshStandardMaterial color={theme.warm} emissive={theme.warm} emissiveIntensity={1.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
