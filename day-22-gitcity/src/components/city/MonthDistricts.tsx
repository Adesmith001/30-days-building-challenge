"use client";

import { Text } from "@react-three/drei";

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
        <Text key={district.month} position={[district.position[0] - 1.2, 0.04, district.position[2] - 1.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.28} color={theme.accent} anchorX="left" anchorY="middle">
          {district.month} DISTRICT
        </Text>
      ))}
    </group>
  );
}
