import { Html } from "@react-three/drei";
import type {
  GameState,
  Passenger,
  StopId,
} from "../../types/game";
import { STOP_BY_ID } from "../../data/stops";

interface Props {
  stopId: StopId;
  state: GameState;
  selected: boolean;
  onSelect(stop: StopId): void;
}

function patienceEmoji(
  passenger: Passenger,
  now: number,
) {
  const waited = now - passenger.waitingSince;

  if (waited > 40_000) return "😡";
  if (waited > 28_000) return "😒";
  if (waited > 15_000) return "😐";

  return "🙂";
}

function destinationSummary(
  state: GameState,
  stopId: StopId,
) {
  const counts = new Map<string, number>();

  state.stops[stopId].waiting.forEach(
    (passenger) => {
      const label =
        STOP_BY_ID[passenger.destination].code;

      counts.set(
        label,
        (counts.get(label) ?? 0) + 1,
      );
    },
  );

  return [...counts.entries()]
    .slice(0, 2)
    .map(([label, count]) => `${label} ×${count}`)
    .join(" · ");
}

function Passenger3D({
  passenger,
  now,
  offset,
}: {
  passenger: Passenger;
  now: number;
  offset: [number, number, number];
}) {
  return (
    <group position={offset}>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.28, 8]} />
        <meshStandardMaterial color="#55514a" />
      </mesh>

      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color="#b99372" />
      </mesh>

      <Html
        position={[0, 0.75, 0]}
        center
        distanceFactor={12}
      >
        <span className="select-none text-sm">
          {patienceEmoji(passenger, now)}
        </span>
      </Html>
    </group>
  );
}

export function Stop3D({
  stopId,
  state,
  selected,
  onSelect,
}: Props) {
  const stop = STOP_BY_ID[stopId];
  const runtime = state.stops[stopId];

  const ratio =
    runtime.waiting.length / stop.capacity;

  const crowdClass =
    ratio >= 0.9
      ? "bg-red-100 text-red-700 border-red-700"
      : ratio >= 0.6
        ? "bg-[#ffd000] border-black"
        : "bg-[#c9ead8] border-[#386b54]";

  const passengers = runtime.waiting.slice(0, 5);

  const offsets: [number, number, number][] = [
    [-0.45, 0, 0.35],
    [-0.2, 0, 0.55],
    [0.15, 0, 0.5],
    [0.4, 0, 0.3],
    [0.55, 0, -0.05],
  ];

  return (
    <group
      position={[
        stop.position[0],
        0,
        stop.position[2],
      ]}
    >
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />

        <meshStandardMaterial
          color={selected ? "#ffd000" : "#faf8f3"}
        />
      </mesh>

      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.2, 24]} />
        <meshStandardMaterial color="#171717" />
      </mesh>

      {passengers.map((passenger, index) => (
        <Passenger3D
          key={passenger.id}
          passenger={passenger}
          now={state.now}
          offset={offsets[index]}
        />
      ))}

      <Html
        position={[0, 1.1, 0]}
        center
        distanceFactor={11}
      >
        <button
          onClick={() => onSelect(stopId)}
          className="
            min-w-32 cursor-pointer
            border border-black bg-[#f7f4ef]
            px-2 py-1 text-left text-[9px]
            font-bold shadow-[2px_2px_0_#171717]
            hover:bg-[#ffd000]
          "
        >
          <div className="flex items-center justify-between gap-3">
            <span>{stop.name}</span>

            <span>
              {runtime.waiting.length}/{stop.capacity}
            </span>
          </div>

          {runtime.waiting.length > 0 && (
            <div
              className={`
                mt-1 border px-1 py-0.5
                ${crowdClass}
              `}
            >
              {destinationSummary(state, stopId)}
            </div>
          )}
        </button>
      </Html>
    </group>
  );
}