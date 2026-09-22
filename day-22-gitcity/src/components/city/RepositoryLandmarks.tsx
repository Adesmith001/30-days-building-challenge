"use client";

import type { CityLandmark } from "@/types/city";

export function RepositoryLandmarks({ landmarks }: { landmarks: CityLandmark[] }) {
  return (
    <group>
      {landmarks.map((landmark) => (
        <group key={landmark.repositoryId} position={[landmark.position[0], landmark.height / 2, landmark.position[2]]}>
          <mesh castShadow>
            <boxGeometry args={[landmark.footprint, landmark.height, landmark.footprint]} />
            <meshStandardMaterial color={landmark.languageColor ?? "#9aa7ad"} roughness={0.35} metalness={0.74} />
          </mesh>
          <mesh position={[0, landmark.height / 2 + 0.5, 0]}>
            <boxGeometry args={[landmark.footprint * 0.62, 0.08, landmark.footprint * 0.62]} />
            <meshStandardMaterial color="#f5c369" emissive="#f5c369" emissiveIntensity={1.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
