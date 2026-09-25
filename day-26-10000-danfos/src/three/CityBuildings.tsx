import {
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import type { CityLayout } from "../types";
import { getLayoutBounds } from "../data/layouts";
import { hashSeed, nextFloat } from "../simulation/rng";

function distanceToSegment(
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
) {
  const dx = bx - ax;
  const dz = bz - az;

  const lengthSq = dx * dx + dz * dz;

  const t = Math.max(
    0,
    Math.min(
      1,
      ((px - ax) * dx + (pz - az) * dz) /
        Math.max(1, lengthSq),
    ),
  );

  const x = ax + dx * t;
  const z = az + dz * t;

  return Math.hypot(px - x, pz - z);
}

export function CityBuildings({
  layout,
  night,
}: {
  layout: CityLayout;
  night: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const buildings = useMemo(() => {
    const bounds = getLayoutBounds(layout);

    let seed = hashSeed(layout.id);
    const result: Array<{
      x: number;
      z: number;
      width: number;
      depth: number;
      height: number;
    }> = [];

    for (let attempt = 0; attempt < 420; attempt += 1) {
      let value;

      [seed, value] = nextFloat(seed);
      const x =
        bounds.minX +
        value * (bounds.maxX - bounds.minX);

      [seed, value] = nextFloat(seed);
      const z =
        bounds.minZ +
        value * (bounds.maxZ - bounds.minZ);

      const tooClose = layout.edges.some((edge) => {
        const a = layout.nodes[edge.a];
        const b = layout.nodes[edge.b];

        return (
          distanceToSegment(
            x,
            z,
            a.x,
            a.z,
            b.x,
            b.z,
          ) < 23
        );
      });

      if (tooClose) continue;

      [seed, value] = nextFloat(seed);
      const width = 10 + value * 18;

      [seed, value] = nextFloat(seed);
      const depth = 10 + value * 18;

      [seed, value] = nextFloat(seed);
      const height = 7 + value * 42;

      result.push({
        x,
        z,
        width,
        depth,
        height,
      });

      if (result.length >= 115) break;
    }

    return result;
  }, [layout]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();

    buildings.forEach((building, index) => {
      dummy.position.set(
        building.x,
        building.height / 2,
        building.z,
      );

      dummy.scale.set(
        building.width,
        building.height,
        building.depth,
      );

      dummy.updateMatrix();

      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, buildings.length]}
      castShadow={false}
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />

      <meshStandardMaterial
        color={night ? "#5b584d" : "#aca38f"}
        roughness={0.9}
        emissive={night ? "#302d25" : "#000000"}
        emissiveIntensity={night ? 0.16 : 0}
      />
    </instancedMesh>
  );
}
