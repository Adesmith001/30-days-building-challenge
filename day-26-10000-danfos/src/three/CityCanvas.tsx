import { Canvas } from "@react-three/fiber";
import { CityScene } from "./CityScene";
import { useSimulationStore } from "../store/useSimulationStore";

export function CityCanvas() {
  const quality = useSimulationStore(
    (state) => state.quality,
  );

  const dpr =
    quality === "high"
      ? [1, 1.5]
      : quality === "low"
        ? [0.8, 1]
        : [0.9, 1.25];

  return (
    <Canvas
      dpr={dpr}
      camera={{
        position: [330, 340, 330],
        fov: 42,
        near: 0.5,
        far: 1400,
      }}
      gl={{
        antialias: quality !== "low",
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
    >
      <CityScene />
    </Canvas>
  );
}
