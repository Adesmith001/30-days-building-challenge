import { useMemo } from "react";
import type { CityLayout } from "../types";
import { getLayoutBounds } from "../data/layouts";
import { useSimulationStore } from "../store/useSimulationStore";

export function GridOverlay({
  layout,
}: {
  layout: CityLayout;
}) {
  const visible = useSimulationStore(
    (state) => state.showGrid,
  );

  const inspector = useSimulationStore(
    (state) => state.inspector,
  );

  const cellSize = useSimulationStore(
    (state) => state.params.cellSize,
  );

  const bounds = useMemo(
    () => getLayoutBounds(layout),
    [layout],
  );

  if (!visible) return null;

  const width = bounds.maxX - bounds.minX;
  const depth = bounds.maxZ - bounds.minZ;

  const size = Math.max(width, depth);
  const divisions = Math.ceil(size / cellSize);

  return (
    <group>
      <gridHelper
        args={[
          size,
          divisions,
          "#787259",
          "#3e403c",
        ]}
        position={[
          (bounds.minX + bounds.maxX) / 2,
          0.82,
          (bounds.minZ + bounds.maxZ) / 2,
        ]}
      />

      {inspector?.searchedCells.map(
        ([cx, cz], index) => {
          const x =
            bounds.minX +
            cx * cellSize +
            cellSize / 2;

          const z =
            bounds.minZ +
            cz * cellSize +
            cellSize / 2;

          const isCenter =
            cx === inspector.cellX &&
            cz === inspector.cellZ;

          return (
            <mesh
              key={`${cx}-${cz}-${index}`}
              position={[x, 0.76, z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry
                args={[
                  cellSize * 0.94,
                  cellSize * 0.94,
                ]}
              />

              <meshBasicMaterial
                color={
                  isCenter ? "#f0c419" : "#c2b864"
                }
                transparent
                opacity={isCenter ? 0.2 : 0.075}
                depthWrite={false}
              />
            </mesh>
          );
        },
      )}
    </group>
  );
}
