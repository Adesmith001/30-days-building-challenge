"use client";

import { getSceneTheme } from "@/lib/city/themes";
import { useSceneStore } from "@/stores/scene-store";

export function CityHall({ height }: { height: number }) {
  const themeName = useSceneStore((value) => value.theme);
  const theme = getSceneTheme(themeName);

  return (
    <group position={[0, height / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.8, height, 3.8]} />
        <meshStandardMaterial color={theme.building} roughness={0.38} metalness={0.72} />
      </mesh>
      <mesh position={[0, height * 0.65, 0]}>
        <boxGeometry args={[2.4, 0.2, 2.4]} />
        <meshStandardMaterial color={theme.warm} emissive={theme.warm} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, height + 0.85, 0]}>
        <coneGeometry args={[0.46, 1.7, 4]} />
        <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}
