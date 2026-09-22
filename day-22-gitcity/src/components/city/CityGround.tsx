"use client";

import { Grid } from "@react-three/drei";
import { getSceneTheme } from "@/lib/city/themes";
import { useSceneStore } from "@/stores/scene-store";

export function CityGround() {
  const themeName = useSceneStore((value) => value.theme);
  const theme = getSceneTheme(themeName);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color={theme.ground} roughness={0.92} metalness={0.18} />
      </mesh>
      <Grid args={[42, 42]} position={[0, 0.01, 0]} cellSize={1.9} cellThickness={0.35} cellColor={theme.emptyLot} sectionSize={7.6} sectionThickness={0.8} sectionColor={theme.building} fadeDistance={40} infiniteGrid />
    </>
  );
}
