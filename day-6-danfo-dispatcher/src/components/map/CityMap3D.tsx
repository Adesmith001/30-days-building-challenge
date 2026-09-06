import { Canvas } from "@react-three/fiber";
import {
  Environment,
} from "@react-three/drei";
import { ROUTES } from "../../data/routes";
import { STOPS } from "../../data/stops";
import type {
  GameState,
  StopId,
} from "../../types/game";
import { CityBlocks } from "./CityBlocks";
import { Danfo3D } from "./Danfo3D";
import { Route3D } from "./Route3D";
import { Stop3D } from "./Stop3D";

interface Props {
  state: GameState;
  onSelectDanfo(id: string): void;
  onSelectStop(id: StopId): void;
}

export function CityMap3D({
  state,
  onSelectDanfo,
  onSelectStop,
}: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{
        position: [0, 15, 14],
        fov: 42,
      }}
    >
      <color
        attach="background"
        args={["#f2efe8"]}
      />

      <ambientLight intensity={1.3} />

      <directionalLight
        castShadow
        intensity={2}
        position={[-5, 12, 8]}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.11, 0]}
        receiveShadow
      >
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial color="#f4f1eb" />
      </mesh>

      <gridHelper
        args={[
          24,
          24,
          "#d4cdc0",
          "#e8e2d8",
        ]}
        position={[0, -0.08, 0]}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[7.3, -0.05, 1]}
      >
        <planeGeometry args={[7, 16]} />
        <meshStandardMaterial
          color="#dfe8fb"
          transparent
          opacity={0.75}
        />
      </mesh>

      <CityBlocks />

      {ROUTES.map((route) => (
        <Route3D
          key={route.id}
          route={route}
          state={state}
        />
      ))}

      {STOPS.map((stop) => (
        <Stop3D
          key={stop.id}
          stopId={stop.id}
          state={state}
          selected={false}
          onSelect={onSelectStop}
        />
      ))}

      {state.danfos.map((danfo) => (
        <Danfo3D
          key={danfo.id}
          danfo={danfo}
          state={state}
          selected={
            danfo.id === state.selectedDanfoId
          }
          onSelect={onSelectDanfo}
        />
      ))}

      <Environment preset="city" />
    </Canvas>
  );
}