"use client";

import type { CityLot } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";
import { useTemporalStore } from "@/stores/temporal-store";

export function DifferenceLayer({ lots, previousSnapshot }: { lots: CityLot[]; previousSnapshot: GitHubYearSnapshot }) {
  const visible = useTemporalStore((value) => value.layers.differences);

  if (!visible) {
    return null;
  }

  const previousDays = new Map(previousSnapshot.days.map((day) => [day.date.slice(5), day.count]));

  return (
    <group>
      {lots.filter((lot) => lot.contributionCount !== (previousDays.get(lot.date.slice(5)) ?? 0)).map((lot) => <mesh key={`difference-${lot.id}`} position={[lot.position[0], lot.height + 0.25, lot.position[2]]}><torusGeometry args={[0.18, 0.03, 8, 20]} /><meshBasicMaterial color={lot.contributionCount > (previousDays.get(lot.date.slice(5)) ?? 0) ? "#44f3a9" : "#f56f7b"} toneMapped={false} /></mesh>)}
    </group>
  );
}
