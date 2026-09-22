"use client";

import type { CityLot } from "@/types/city";
import { getSceneTheme } from "@/lib/city/themes";
import { useSceneStore } from "@/stores/scene-store";

function windowCount(height: number) {
  return Math.min(5, Math.max(1, Math.floor(height / 1.4)));
}

export function WindowFacades({ lots }: { lots: CityLot[] }) {
  const themeName = useSceneStore((value) => value.theme);
  const theme = getSceneTheme(themeName);

  return (
    <group>
      {lots.filter((lot) => lot.height > 0.7).map((lot) => {
        const rows = windowCount(lot.height);

        return Array.from({ length: rows }, (_, row) => (
          <mesh key={`${lot.id}-${row}`} position={[lot.position[0], 0.45 + row * 1.15, lot.position[2] - lot.footprint[1] / 2 - 0.012]}>
            <planeGeometry args={[lot.footprint[0] * 0.55, 0.12]} />
            <meshBasicMaterial color={row % 3 === 0 ? theme.warm : theme.accent} toneMapped={false} />
          </mesh>
        ));
      })}
    </group>
  );
}
