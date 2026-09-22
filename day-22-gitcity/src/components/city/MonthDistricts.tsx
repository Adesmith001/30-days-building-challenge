"use client";

import { Html } from "@react-three/drei";

import type { CityLot } from "@/types/city";
import { useSceneStore } from "@/stores/scene-store";
import { getSceneTheme } from "@/lib/city/themes";

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function MonthDistricts({ lots }: { lots: CityLot[] }) {
  const themeName = useSceneStore((value) => value.theme);
  const theme = getSceneTheme(themeName);
  const districts = months.map((month, index) => {
    const lot = lots.find((item) => Number(item.date.slice(5, 7)) === index + 1);

    return lot ? { month, position: lot.position } : null;
  }).filter((district): district is { month: string; position: [number, number, number] } => Boolean(district));

  return (
    <group>
      {districts.map((district) => (
        <Html key={district.month} position={[district.position[0] - 1.2, 0.08, district.position[2] - 1.2]} center distanceFactor={18}>
          <div className="pointer-events-none whitespace-nowrap border border-[#263b34] bg-[#0b0d10]/80 px-2 py-1 font-[family-name:var(--font-mono)] text-[7px] tracking-[0.16em]" style={{ color: theme.accent }}>
            {district.month} DISTRICT
          </div>
        </Html>
      ))}
    </group>
  );
}
