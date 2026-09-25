import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { renderBuffer } from "../simulation/runtime";
import { useSimulationStore } from "../store/useSimulationStore";

export function NeighbourOverlay() {
  const group = useRef<THREE.Group>(null);

  const show = useSimulationStore(
    (state) => state.showNeighbours,
  );

  const inspector = useSimulationStore(
    (state) => state.inspector,
  );

  const radius = useSimulationStore(
    (state) => state.params.neighbourRadius,
  );

  useFrame(() => {
    if (!group.current || !inspector) return;

    const buffer = renderBuffer();

    group.current.children.forEach(
      (child, index) => {
        const id = inspector.neighbourIds[index];

        if (id === undefined) {
          child.visible = false;
          return;
        }

        child.visible = true;

        child.position.set(
          buffer[id * 4],
          0.85,
          buffer[id * 4 + 1],
        );
      },
    );
  });

  if (!show || !inspector) return null;

  return (
    <>
      <group ref={group}>
        {Array.from({ length: 64 }).map((_, i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[2.7, 3.05, 18]} />

            <meshBasicMaterial
              color="#fff1a6"
              transparent
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <NeighbourRadius
        id={inspector.id}
        radius={radius}
      />
    </>
  );
}

function NeighbourRadius({
  id,
  radius,
}: {
  id: number;
  radius: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;

    const buffer = renderBuffer();

    ref.current.position.set(
      buffer[id * 4],
      0.72,
      buffer[id * 4 + 1],
    );
  });

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry
        args={[
          radius - 0.3,
          radius,
          64,
        ]}
      />

      <meshBasicMaterial
        color="#e5db90"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}
