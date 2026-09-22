"use client";

import type { CityLot } from "@/types/city";
import { revealHeight } from "@/lib/city/reveal";
import { getSceneTheme } from "@/lib/city/themes";
import { sceneStore, useSceneStore } from "@/stores/scene-store";

export function ContributionBuildings({ lots }: { lots: CityLot[] }) {
  const themeName = useSceneStore((value) => value.theme);
  const revealProgress = useSceneStore((value) => value.revealProgress);
  const theme = getSceneTheme(themeName);

  return (
    <group>
      {lots.map((lot) => (
        <mesh
          key={lot.id}
          position={[lot.position[0], revealHeight(lot.height, revealProgress) / 2, lot.position[2]]}
          castShadow
          onPointerOver={() => sceneStore.hoverLot(lot.id)}
          onPointerOut={() => sceneStore.hoverLot(null)}
          onClick={() => sceneStore.selectLot(lot.id)}
        >
          <boxGeometry args={[lot.footprint[0], Math.max(revealHeight(lot.height, revealProgress), 0.08), lot.footprint[1]]} />
          <meshStandardMaterial color={lot.status === "empty" ? theme.emptyLot : lot.status === "future" ? theme.ground : theme.building} roughness={0.56} metalness={0.58} emissive={lot.status === "today" ? theme.accent : "#000000"} emissiveIntensity={lot.status === "today" ? 1.2 : 0} />
        </mesh>
      ))}
    </group>
  );
}
