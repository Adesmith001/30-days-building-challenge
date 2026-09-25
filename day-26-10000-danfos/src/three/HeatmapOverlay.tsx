import {
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { renderBuffer } from "../simulation/runtime";
import { useSimulationStore } from "../store/useSimulationStore";

const CELLS = 12;
const SIZE = 520;

export function HeatmapOverlay() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const elapsed = useRef(0);

  const show = useSimulationStore(
    (state) => state.showHeatmap,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const dummy = useMemo(
    () => new THREE.Object3D(),
    [],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    mesh.instanceMatrix.setUsage(
      THREE.DynamicDrawUsage,
    );
  }, []);

  useFrame((_, delta) => {
    if (!show || !ref.current) return;

    elapsed.current += delta;
    if (elapsed.current < 0.15) return;

    elapsed.current = 0;

    const counts = new Uint16Array(
      CELLS * CELLS,
    );

    const buffer = renderBuffer();

    for (let i = 0; i < population; i += 1) {
      const x = buffer[i * 4];
      const z = buffer[i * 4 + 1];

      const cx = Math.floor(
        ((x + SIZE / 2) / SIZE) * CELLS,
      );

      const cz = Math.floor(
        ((z + SIZE / 2) / SIZE) * CELLS,
      );

      if (
        cx < 0 ||
        cz < 0 ||
        cx >= CELLS ||
        cz >= CELLS
      ) {
        continue;
      }

      counts[cz * CELLS + cx] += 1;
    }

    const max = Math.max(
      1,
      ...counts,
    );

    for (let z = 0; z < CELLS; z += 1) {
      for (let x = 0; x < CELLS; x += 1) {
        const index = z * CELLS + x;

        const ratio = counts[index] / max;

        dummy.position.set(
          -SIZE / 2 +
            ((x + 0.5) / CELLS) * SIZE,
          0.69,
          -SIZE / 2 +
            ((z + 0.5) / CELLS) * SIZE,
        );

        dummy.rotation.set(
          -Math.PI / 2,
          0,
          0,
        );

        const scale = SIZE / CELLS;

        dummy.scale.set(scale, scale, 1);
        dummy.updateMatrix();

        ref.current.setMatrixAt(
          index,
          dummy.matrix,
        );

        ref.current.setColorAt(
          index,
          new THREE.Color().setHSL(
            0.13 - ratio * 0.12,
            0.72,
            0.34 + ratio * 0.13,
          ),
        );
      }
    }

    ref.current.instanceMatrix.needsUpdate = true;

    if (ref.current.instanceColor) {
      ref.current.instanceColor.needsUpdate = true;
    }
  });

  if (!show) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, CELLS * CELLS]}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        transparent
        opacity={0.11}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
