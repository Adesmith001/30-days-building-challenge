import type { CityLayout } from "../types";
import { useSimulationStore } from "../store/useSimulationStore";

export function TrafficLights({
  layout,
}: {
  layout: CityLayout;
}) {
  const enabled = useSimulationStore(
    (state) => state.trafficLights,
  );

  const simTime = useSimulationStore(
    (state) => state.metrics.simTime,
  );

  if (!enabled) return null;

  return (
    <group>
      {layout.nodes.map((node, index) => {
        if (!node.signal) return null;

        const phase =
          (simTime * 1000 + index * 1370) %
          9000;

        const red =
          phase > 4700 && phase < 8300;

        return (
          <group
            key={node.id}
            position={[
              node.x + 5.5,
              0,
              node.z + 5.5,
            ]}
          >
            <mesh position={[0, 3.4, 0]}>
              <boxGeometry args={[0.55, 6.8, 0.55]} />
              <meshStandardMaterial color="#282921" />
            </mesh>

            <mesh position={[0, 6.6, 0]}>
              <sphereGeometry args={[0.8, 10, 10]} />

              <meshStandardMaterial
                color={red ? "#c24c36" : "#72a34a"}
                emissive={
                  red ? "#8c2e20" : "#4f7b31"
                }
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
