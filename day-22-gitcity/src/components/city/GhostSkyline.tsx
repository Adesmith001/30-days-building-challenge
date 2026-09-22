"use client";

import type { CityLot } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";
import { contributionHeight } from "@/lib/city/building-height";
import { interpolateTemporalHeight } from "@/lib/city/temporal-height";
import { useTemporalStore } from "@/stores/temporal-store";

export function GhostSkyline({ lots, previousSnapshot }: { lots: CityLot[]; previousSnapshot: GitHubYearSnapshot }) {
  const visible = useTemporalStore((value) => value.layers.ghost);
  const yearShift = useTemporalStore((value) => value.yearShift);

  if (!visible) {
    return null;
  }

  const previousDays = new Map(previousSnapshot.days.map((day) => [day.date.slice(5), day.count]));

  return (
    <group>
      {lots.map((lot) => {
        const previousHeight = contributionHeight(previousDays.get(lot.date.slice(5)) ?? 0);
        const height = interpolateTemporalHeight(lot.height, previousHeight, yearShift);

        return <mesh key={`ghost-${lot.id}`} position={[lot.position[0], height / 2, lot.position[2]]}><boxGeometry args={[lot.footprint[0], Math.max(height, 0.08), lot.footprint[1]]} /><meshBasicMaterial color="#91a6a0" transparent opacity={0.18} wireframe /></mesh>;
      })}
    </group>
  );
}
