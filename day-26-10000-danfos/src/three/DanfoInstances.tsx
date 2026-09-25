import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { renderBuffer } from "../simulation/runtime";
import { MAX_DANFOS } from "../types";
import { useSimulationStore } from "../store/useSimulationStore";

function makeGeometry() {
  const body = new THREE.BoxGeometry(4.6, 1.6, 2);
  body.translate(0, 1.35, 0);

  const stripe = new THREE.BoxGeometry(4.64, 0.34, 2.04);
  stripe.translate(0, 1.28, 0);

  const windows = new THREE.BoxGeometry(2.8, 0.7, 2.05);
  windows.translate(-0.15, 2.15, 0);

  return mergeGeometries(
    [body, stripe, windows],
    true,
  );
}

export function DanfoInstances() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const population = useSimulationStore(
    (state) => state.population,
  );

  const selectAgent = useSimulationStore(
    (state) => state.selectAgent,
  );

  const selectedId = useSimulationStore(
    (state) => state.selectedId,
  );

  const geometry = useMemo(() => makeGeometry(), []);

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: "#f0c419",
        roughness: 0.68,
        metalness: 0.02,
      }),
      new THREE.MeshStandardMaterial({
        color: "#161612",
        roughness: 0.8,
      }),
      new THREE.MeshStandardMaterial({
        color: "#242c2f",
        roughness: 0.3,
        metalness: 0.15,
      }),
    ],
    [],
  );

  const dummy = useMemo(
    () => new THREE.Object3D(),
    [],
  );

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.instanceMatrix.setUsage(
      THREE.DynamicDrawUsage,
    );

    ref.current.frustumCulled = false;
  }, []);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const buffer = renderBuffer();

    for (let i = 0; i < population; i += 1) {
      const offset = i * 4;

      dummy.position.set(
        buffer[offset],
        0,
        buffer[offset + 1],
      );

      dummy.rotation.set(
        0,
        -buffer[offset + 2],
        0,
      );

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.count = population;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[
          geometry,
          materials as unknown as THREE.Material,
          MAX_DANFOS,
        ]}
        onClick={(event) => {
          if (event.instanceId === undefined) return;

          event.stopPropagation();
          selectAgent(event.instanceId);
        }}
      />

      <SelectedMarker id={selectedId} />
    </>
  );
}

function SelectedMarker({ id }: { id: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current || id < 0) return;

    const buffer = renderBuffer();
    const offset = id * 4;

    ref.current.position.set(
      buffer[offset],
      0.22,
      buffer[offset + 1],
    );
  });

  if (id < 0) return null;

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[3.3, 3.8, 32]} />

      <meshBasicMaterial
        color="#fff3a0"
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </mesh>
  );
}
