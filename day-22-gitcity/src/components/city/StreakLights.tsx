"use client";

import type { CityLot } from "@/types/city";
import type { GitHubYearSnapshot } from "@/types/github";
import { useTemporalStore } from "@/stores/temporal-store";

export function StreakLights({ lots, snapshot }: { lots: CityLot[]; snapshot: GitHubYearSnapshot }) {
  const visible = useTemporalStore((value) => value.layers.streaks);
  const streakDates = new Set(snapshot.days.filter((day) => day.count > 0).slice(0, snapshot.stats.longestStreak).map((day) => day.date));

  if (!visible) {
    return null;
  }

  return (
    <group>
      {lots.filter((lot) => streakDates.has(lot.date)).map((lot) => <mesh key={`streak-${lot.id}`} position={[lot.position[0], lot.height + 0.15, lot.position[2]]}><sphereGeometry args={[0.08, 8, 8]} /><meshBasicMaterial color="#44f3a9" toneMapped={false} /></mesh>)}
    </group>
  );
}
