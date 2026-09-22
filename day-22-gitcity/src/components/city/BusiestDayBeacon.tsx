"use client";

import type { CityLot } from "@/types/city";

export function BusiestDayBeacon({ lot }: { lot: CityLot | null }) {
  if (!lot) {
    return null;
  }

  return (
    <group position={[lot.position[0], lot.height + 1.4, lot.position[2]]}>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#44f3a9" emissive="#44f3a9" emissiveIntensity={4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.48, 0.025, 8, 32]} />
        <meshStandardMaterial color="#44f3a9" emissive="#44f3a9" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
