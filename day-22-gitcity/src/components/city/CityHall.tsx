"use client";

export function CityHall({ height }: { height: number }) {
  return (
    <group position={[0, height / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.8, height, 3.8]} />
        <meshStandardMaterial color="#252c31" roughness={0.38} metalness={0.72} />
      </mesh>
      <mesh position={[0, height * 0.65, 0]}>
        <boxGeometry args={[2.4, 0.2, 2.4]} />
        <meshStandardMaterial color="#f5c369" emissive="#f5c369" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, height + 0.85, 0]}>
        <coneGeometry args={[0.46, 1.7, 4]} />
        <meshStandardMaterial color="#44f3a9" emissive="#44f3a9" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}
