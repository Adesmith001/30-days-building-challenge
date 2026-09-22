"use client";

import type { CityLot } from "@/types/city";

const colors = {
  active: "#67737a",
  empty: "#273038",
  future: "#172027",
  today: "#44f3a9",
};

export function ContributionBuildings({ lots }: { lots: CityLot[] }) {
  return (
    <group>
      {lots.map((lot) => (
        <mesh key={lot.id} position={[lot.position[0], lot.height / 2, lot.position[2]]} castShadow>
          <boxGeometry args={[lot.footprint[0], Math.max(lot.height, 0.08), lot.footprint[1]]} />
          <meshStandardMaterial color={colors[lot.status]} roughness={0.56} metalness={0.58} emissive={lot.status === "today" ? "#44f3a9" : "#000000"} emissiveIntensity={lot.status === "today" ? 1.2 : 0} />
        </mesh>
      ))}
    </group>
  );
}
