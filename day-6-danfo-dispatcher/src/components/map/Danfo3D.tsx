import {
  Html,
  RoundedBox,
} from "@react-three/drei";
import { STOP_BY_ID } from "../../data/stops";
import type {
  Danfo,
  GameState,
} from "../../types/game";

interface Props {
  danfo: Danfo;
  state: GameState;
  selected: boolean;
  onSelect(id: string): void;
}

function positionForDanfo(
  danfo: Danfo,
): [number, number, number] {
  const current =
    STOP_BY_ID[
      danfo.path[danfo.pathIndex] ?? danfo.node
    ].position;

  const nextId =
    danfo.path[danfo.pathIndex + 1];

  if (!nextId) {
    return [
      current[0],
      0.48,
      current[2],
    ];
  }

  const next = STOP_BY_ID[nextId].position;

  return [
    current[0] +
      (next[0] - current[0]) * danfo.progress,
    0.48,
    current[2] +
      (next[2] - current[2]) * danfo.progress,
  ];
}

function angleForDanfo(danfo: Danfo) {
  const current =
    STOP_BY_ID[
      danfo.path[danfo.pathIndex] ?? danfo.node
    ].position;

  const nextId =
    danfo.path[danfo.pathIndex + 1];

  if (!nextId) return 0;

  const next = STOP_BY_ID[nextId].position;

  return -Math.atan2(
    next[2] - current[2],
    next[0] - current[0],
  );
}

function Wheel({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.11, 0.11, 0.08, 12]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
}

export function Danfo3D({
  danfo,
  state,
  selected,
  onSelect,
}: Props) {
  const full =
    danfo.passengers.length === danfo.capacity;

  return (
    <group
      position={positionForDanfo(danfo)}
      rotation={[0, angleForDanfo(danfo), 0]}
    >
      {selected && (
        <mesh
          position={[0, -0.38, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.6, 0.78, 32]} />
          <meshBasicMaterial color="#ffd000" />
        </mesh>
      )}

      <RoundedBox
        args={[1.25, 0.55, 0.58]}
        radius={0.08}
        smoothness={3}
        castShadow
      >
        <meshStandardMaterial color="#ffd000" />
      </RoundedBox>

      <mesh position={[0, 0.02, 0.3]}>
        <boxGeometry args={[0.65, 0.18, 0.035]} />
        <meshStandardMaterial color="#171717" />
      </mesh>

      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.68, 0.11, 0.6]} />
        <meshStandardMaterial color="#171717" />
      </mesh>

      <Wheel position={[-0.4, -0.3, 0.28]} />
      <Wheel position={[0.4, -0.3, 0.28]} />
      <Wheel position={[-0.4, -0.3, -0.28]} />
      <Wheel position={[0.4, -0.3, -0.28]} />

      <Html
        position={[0, 0.9, 0]}
        center
        distanceFactor={10}
      >
        <button
          onClick={() => onSelect(danfo.id)}
          className={`
            cursor-pointer whitespace-nowrap
            border border-black px-2 py-1
            text-[9px] font-black
            shadow-[2px_2px_0_#171717]
            ${
              selected
                ? "bg-[#171717] text-white"
                : "bg-[#ffd000] text-black"
            }
          `}
        >
          {danfo.name}
          {" · "}
          {danfo.passengers.length}/{danfo.capacity}
          {full ? " FULL" : ""}
        </button>
      </Html>

      {danfo.status === "held" && (
        <Html
          position={[0, 1.3, 0]}
          center
          distanceFactor={10}
        >
          <span className="bg-red-700 px-2 py-1 text-[9px] font-black text-white">
            HELD
          </span>
        </Html>
      )}

      {danfo.hornUntil > state.now && (
        <Html
          position={[0.7, 0.3, 0]}
          center
          distanceFactor={10}
        >
          <span className="text-xl">
            📣
          </span>
        </Html>
      )}
    </group>
  );
}