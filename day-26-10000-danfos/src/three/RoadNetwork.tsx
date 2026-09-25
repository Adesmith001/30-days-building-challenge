import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { CityLayout } from "../types";
import { useSimulationStore } from "../store/useSimulationStore";

interface Props {
  layout: CityLayout;
}

export function RoadNetwork({ layout }: Props) {
  const interaction = useSimulationStore(
    (state) => state.interaction,
  );

  const blocked = useSimulationStore(
    (state) => state.blockedSegments,
  );

  const toggleBlock = useSimulationStore(
    (state) => state.toggleBlock,
  );

  const blockedSet = useMemo(
    () => new Set(blocked),
    [blocked],
  );

  return (
    <group>
      {layout.edges.map((edge, index) => {
        const a = layout.nodes[edge.a];
        const b = layout.nodes[edge.b];

        const dx = b.x - a.x;
        const dz = b.z - a.z;

        const length = Math.hypot(dx, dz);
        const angle = Math.atan2(dz, dx);

        const x = (a.x + b.x) / 2;
        const z = (a.z + b.z) / 2;

        const width = edge.width ?? 15;
        const closed = blockedSet.has(index);

        return (
          <group key={`${edge.a}-${edge.b}`}>
            <mesh
              position={[x, 0.25, z]}
              rotation={[0, -angle, 0]}
              onClick={(event) => {
                if (interaction !== "roadblock") return;

                event.stopPropagation();
                toggleBlock(index);
              }}
            >
              <boxGeometry
                args={[length, 0.5, width]}
              />

              <meshStandardMaterial
                color={
                  closed ? "#5a5141" : "#262724"
                }
                roughness={0.93}
              />
            </mesh>

            <Line
              points={[
                [a.x, 0.58, a.z],
                [b.x, 0.58, b.z],
              ]}
              color="#d7d0ad"
              lineWidth={0.45}
              dashed
              dashSize={5}
              gapSize={5}
              transparent
              opacity={0.5}
            />

            {closed && (
              <Barrier
                x={x}
                z={z}
                angle={angle}
                width={width}
              />
            )}
          </group>
        );
      })}

      {layout.nodes.map((node) => (
        <group
          key={node.id}
          position={[node.x, 0, node.z]}
        >
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry
              args={[9, 9, 0.55, 20]}
            />

            <meshStandardMaterial
              color="#2c2d29"
              roughness={0.96}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Barrier({
  x,
  z,
  angle,
  width,
}: {
  x: number;
  z: number;
  angle: number;
  width: number;
}) {
  return (
    <group
      position={[x, 1.2, z]}
      rotation={[0, -angle, 0]}
    >
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[width * 0.75, 1.6, 1]} />

        <meshStandardMaterial
          color="#d9d1b3"
          emissive="#4e4320"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}
