"use client";

import { Html } from "@react-three/drei";

import type { CityLot } from "@/types/city";
import { useSceneStore } from "@/stores/scene-store";

export function LotHoverLabel({ lots }: { lots: CityLot[] }) {
  const hoveredLotId = useSceneStore((value) => value.hoveredLotId);
  const lot = lots.find((item) => item.id === hoveredLotId);

  if (!lot) {
    return null;
  }

  return (
    <Html position={[lot.position[0], lot.height + 1, lot.position[2]]} center distanceFactor={12}>
      <div className="pointer-events-none whitespace-nowrap border border-[#53616b] bg-[#111419]/95 px-3 py-2 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.12em] text-white shadow-2xl">
        <div className="text-[#44f3a9]">{lot.date}</div>
        <div className="mt-1 text-[#aaa39a]">{lot.contributionCount} CONTRIBUTIONS · BOROUGH {lot.borough}</div>
      </div>
    </Html>
  );
}
