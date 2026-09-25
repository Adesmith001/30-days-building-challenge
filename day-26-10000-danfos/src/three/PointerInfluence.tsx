import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { runtime } from "../simulation/runtime";

export function PointerInfluence() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;

    ref.current.visible = runtime.pointer.active;

    ref.current.position.set(
      runtime.pointer.x,
      0.95,
      runtime.pointer.z,
    );

    const scale = runtime.pointer.radius;

    ref.current.scale.set(scale, scale, 1);
  });

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <ringGeometry args={[0.96, 1, 64]} />

      <meshBasicMaterial
        color="#f4dda0"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}
