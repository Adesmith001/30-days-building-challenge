import {
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { renderBuffer } from "../simulation/runtime";
import { useSimulationStore } from "../store/useSimulationStore";

const COLS = 12;
const SIZE = 520;

export function FlowFieldOverlay() {
  const ref = useRef<THREE.LineSegments>(null);
  const elapsed = useRef(0);

  const show = useSimulationStore(
    (state) => state.showFlow,
  );

  const population = useSimulationStore(
    (state) => state.population,
  );

  const positions = useMemo(
    () =>
      new Float32Array(COLS * COLS * 2 * 3),
    [],
  );

  useFrame((_, delta) => {
    if (!show || !ref.current) return;

    elapsed.current += delta;
    if (elapsed.current < 0.12) return;

    elapsed.current = 0;

    const buffer = renderBuffer();

    const vx = new Float32Array(COLS * COLS);
    const vz = new Float32Array(COLS * COLS);
    const counts = new Uint16Array(COLS * COLS);

    for (let i = 0; i < population; i += 1) {
      const offset = i * 4;

      const x = buffer[offset];
      const z = buffer[offset + 1];
      const heading = buffer[offset + 2];

      const cx = Math.floor(
        ((x + SIZE / 2) / SIZE) * COLS,
      );

      const cz = Math.floor(
        ((z + SIZE / 2) / SIZE) * COLS,
      );

      if (
        cx < 0 ||
        cz < 0 ||
        cx >= COLS ||
        cz >= COLS
      ) {
        continue;
      }

      const cell = cz * COLS + cx;

      vx[cell] += Math.cos(heading);
      vz[cell] += Math.sin(heading);
      counts[cell] += 1;
    }

    let pointer = 0;

    for (let z = 0; z < COLS; z += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const index = z * COLS + x;

        const px =
          -SIZE / 2 +
          ((x + 0.5) / COLS) * SIZE;

        const pz =
          -SIZE / 2 +
          ((z + 0.5) / COLS) * SIZE;

        const count = Math.max(1, counts[index]);

        const dx = vx[index] / count;
        const dz = vz[index] / count;

        positions[pointer++] = px;
        positions[pointer++] = 1.25;
        positions[pointer++] = pz;

        positions[pointer++] = px + dx * 10;
        positions[pointer++] = 1.25;
        positions[pointer++] = pz + dz * 10;
      }
    }

    const attribute =
      ref.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;

    attribute.needsUpdate = true;
  });

  if (!show) return null;

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <lineBasicMaterial
        color="#c9bf72"
        transparent
        opacity={0.55}
      />
    </lineSegments>
  );
}
