"use client";

import type { CityLot } from "@/types/city";
import { getSceneTheme } from "@/lib/city/themes";
import { useSceneStore } from "@/stores/scene-store";

export function BusiestDayBeacon({ lot }: { lot: CityLot | null }) {
  const themeName = useSceneStore((value) => value.theme);
  const theme = getSceneTheme(themeName);

  if (!lot) {
    return null;
  }

  return (
    <group position={[lot.position[0], lot.height + 1.4, lot.position[2]]}>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.025, 8, 32]} />
        <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
