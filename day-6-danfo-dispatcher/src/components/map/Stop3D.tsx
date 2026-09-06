import { Html } from "@react-three/drei";
import type { GameState, StopId } from "../../types/game";
import { STOP_BY_ID } from "../../data/stops";
import { overflowSeconds } from "../../lib/difficulty";

interface Props { stopId: StopId; state: GameState; selected: boolean; onSelect(stop: StopId): void; }

function destinationSummary(state: GameState, stopId: StopId) {
  const counts = new Map<string, number>();
  state.stops[stopId].waiting.forEach((passenger) => {
    const label = STOP_BY_ID[passenger.destination].code;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });
  return [...counts.entries()].slice(0, 2).map(([label, count]) => `${label} ×${count}`).join(" · ");
}

export function Stop3D({ stopId, state, selected, onSelect }: Props) {
  const stop = STOP_BY_ID[stopId];
  const runtime = state.stops[stopId];
  const ratio = runtime.waiting.length / stop.capacity;
  const countdown = overflowSeconds(state, stopId);
  const crowdClass = ratio >= 0.9 ? "bg-red-100 text-red-700 border-red-700" : ratio >= 0.6 ? "bg-[#ffd000] border-black" : "bg-[#c9ead8] border-[#386b54]";

  return (
    <group position={[stop.position[0], 0, stop.position[2]]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.3, 0.3, 0.18, 24]} /><meshStandardMaterial color={selected ? "#ffd000" : "#faf8f3"} /></mesh>
      <mesh position={[0, 0.23, 0]}><cylinderGeometry args={[0.11, 0.11, 0.2, 24]} /><meshStandardMaterial color="#171717" /></mesh>
      <Html position={[0, 0.8, 0]} center distanceFactor={11}>
        <button onClick={() => onSelect(stopId)} className={`min-w-16 cursor-pointer border px-2 py-1 text-left text-[9px] font-black shadow-[2px_2px_0_#171717] hover:bg-[#ffd000] ${selected ? "border-black bg-[#ffd000]" : "border-[#aaa18d] bg-[#f7f4ef]"}`}>
          <div className="flex items-center justify-between gap-2"><span>{stop.code}</span><span>{runtime.waiting.length}/{stop.capacity}</span></div>
          {countdown !== null && <div className="mt-1 bg-red-100 px-1 text-red-800 motion-safe:animate-pulse">OVERFLOW IN {countdown}s</div>}
          {runtime.waiting.length > 0 && <div className={`mt-1 border px-1 py-0.5 text-[8px] ${crowdClass}`}>{destinationSummary(state, stopId)}</div>}
        </button>
      </Html>
    </group>
  );
}
