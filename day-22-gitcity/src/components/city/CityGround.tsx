"use client";

import { Grid } from "@react-three/drei";

export function CityGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#0e1215" roughness={0.92} metalness={0.18} />
      </mesh>
      <Grid args={[42, 42]} position={[0, 0.01, 0]} cellSize={1.9} cellThickness={0.35} cellColor="#26313a" sectionSize={7.6} sectionThickness={0.8} sectionColor="#3b4b55" fadeDistance={40} infiniteGrid />
    </>
  );
}
