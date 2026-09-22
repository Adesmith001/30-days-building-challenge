"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { getSceneTheme } from "@/lib/city/themes";
import { useSceneStore } from "@/stores/scene-store";
import type { CityModel } from "@/types/city";
import { BusiestDayBeacon } from "./BusiestDayBeacon";
import { CameraRig } from "./CameraRig";
import { CityGround } from "./CityGround";
import { CityHall } from "./CityHall";
import { ContributionBuildings } from "./ContributionBuildings";
import { LotHoverLabel } from "./LotHoverLabel";
import { MonthDistricts } from "./MonthDistricts";
import { RepositoryLandmarks } from "./RepositoryLandmarks";
import { WindowFacades } from "./WindowFacades";

export function CityCanvas({ city, busiestLot }: { city: CityModel; busiestLot: CityModel["lots"][number] | null }) {
  const themeName = useSceneStore((value) => value.theme);
  const quality = useSceneStore((value) => value.quality);
  const theme = getSceneTheme(themeName);
  const dpr = quality === "high" ? [1, 2] : quality === "low" ? [0.7, 1] : [1, 1.5];

  return (
    <Canvas shadows={quality !== "low"} dpr={dpr} gl={{ antialias: quality !== "low" }}>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.fog, 24, 48]} />
      <PerspectiveCamera makeDefault position={[28, 25, 28]} fov={38} />
      <ambientLight intensity={0.52} color="#7f8d96" />
      <directionalLight castShadow intensity={2.2} color="#f5c369" position={[10, 22, -14]} shadow-mapSize={[1024, 1024]} />
      <pointLight intensity={4} color="#44f3a9" distance={18} position={[0, 7, 0]} />
      <CityGround />
      <ContributionBuildings lots={city.lots} />
      <WindowFacades lots={city.lots} />
      <MonthDistricts lots={city.lots} />
      <CityHall height={city.hall.height} />
      <RepositoryLandmarks landmarks={city.landmarks} />
      <BusiestDayBeacon lot={busiestLot} />
      <LotHoverLabel lots={city.lots} />
      <CameraRig />
      <OrbitControls enablePan={false} minDistance={12} maxDistance={44} maxPolarAngle={Math.PI / 2.15} target={[0, 0, 0]} />
    </Canvas>
  );
}
