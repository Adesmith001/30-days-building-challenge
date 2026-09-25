import type { ThreeEvent } from "@react-three/fiber";
import { getLayout } from "../data/layouts";
import { updatePointer } from "../simulation/runtime";
import { useSimulationStore } from "../store/useSimulationStore";
import { CameraRig } from "./CameraRig";
import { CityBuildings } from "./CityBuildings";
import { DanfoInstances } from "./DanfoInstances";
import { FlowFieldOverlay } from "./FlowFieldOverlay";
import { GridOverlay } from "./GridOverlay";
import { HeatmapOverlay } from "./HeatmapOverlay";
import { NeighbourOverlay } from "./NeighbourOverlay";
import { PerformanceSampler } from "./PerformanceSampler";
import { PointerInfluence } from "./PointerInfluence";
import { RoadNetwork } from "./RoadNetwork";
import { TrafficLights } from "./TrafficLights";

export function CityScene() {
  const layoutId = useSimulationStore(
    (state) => state.layoutId,
  );

  const night = useSimulationStore(
    (state) => state.night,
  );

  const interaction = useSimulationStore(
    (state) => state.interaction,
  );

  const radius = useSimulationStore(
    (state) => state.params.pointerRadius,
  );

  const completeMission = useSimulationStore(
    (state) => state.completeMission,
  );

  const layout = getLayout(layoutId);

  const pointerMove = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    if (
      interaction === "roadblock" ||
      interaction === "inspect"
    ) {
      return;
    }

    updatePointer(
      event.point.x,
      event.point.z,
      true,
      interaction,
      radius,
    );

    completeMission("bend-flow");
  };

  return (
    <>
      <color
        attach="background"
        args={[night ? "#090d10" : "#c6bda8"]}
      />

      <fog
        attach="fog"
        args={[
          night ? "#090d10" : "#b7ad99",
          260,
          720,
        ]}
      />

      <ambientLight
        intensity={night ? 0.48 : 1.3}
      />

      <directionalLight
        position={[160, 260, 120]}
        intensity={night ? 1.2 : 2.5}
        color={night ? "#ffd993" : "#fff1ce"}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        onPointerMove={pointerMove}
        onPointerLeave={() =>
          updatePointer(
            0,
            0,
            false,
            interaction,
            radius,
          )
        }
      >
        <planeGeometry args={[900, 900]} />

        <meshStandardMaterial
          color={night ? "#171a18" : "#8f8878"}
          roughness={1}
        />
      </mesh>

      <RoadNetwork layout={layout} />

      <CityBuildings
        layout={layout}
        night={night}
      />

      <TrafficLights layout={layout} />

      <DanfoInstances />

      <GridOverlay layout={layout} />

      <HeatmapOverlay />

      <FlowFieldOverlay />

      <NeighbourOverlay />

      <PointerInfluence />

      <CameraRig />

      <PerformanceSampler />
    </>
  );
}
