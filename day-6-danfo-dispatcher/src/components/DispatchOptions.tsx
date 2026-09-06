import { STOP_BY_ID, STOP_IDS } from "../data/stops";
import { TRAFFIC_SPEED } from "../data/routes";
import { findPath, getRouteBetween } from "../lib/routing";
import { passengerPatience, overflowSeconds } from "../lib/difficulty";
import { rainModifier } from "../lib/sim/events";
import type { Danfo, GameState, StopId } from "../types/game";

export function DispatchOptions({ state, danfo, destination, onPreview, onDispatch }: {
  state: GameState;
  danfo: Danfo;
  destination: StopId | null;
  onPreview(id: StopId): void;
  onDispatch(id: StopId): void;
}) {
  const path = destination ? findPath(state, danfo.node, destination) : [];
  const canDispatch = danfo.status === "idle" && path.length > 1;
  const waiting = state.stops[danfo.node].waiting;
  const boarding = Math.min(danfo.capacity - danfo.passengers.length,
    waiting.filter((passenger) => path.slice(1).includes(passenger.destination)).length);
  const seconds = path.slice(1).reduce((total, stop, index) => {
    const route = getRouteBetween(path[index], stop)!;
    const from = STOP_BY_ID[path[index]].position;
    const to = STOP_BY_ID[stop].position;
    const traffic = 1 - (1 - TRAFFIC_SPEED[state.routes[route.id].traffic]) * state.modifiers.trafficResistance;
    return total + Math.max(1, Math.hypot(from[0] - to[0], from[2] - to[2])) /
      (0.88 * danfo.speed * state.modifiers.speed * traffic * rainModifier(state));
  }, 0);

  if (danfo.status !== "idle") return (
    <p className="mt-3 text-xs leading-5" role="status">
      {danfo.status === "moving" && danfo.destination
        ? `Heading to ${STOP_BY_ID[danfo.destination].name}. Select another idle danfo to keep people moving.`
        : danfo.status === "held" ? "Held by police. Resolve the incident above or wait for release."
          : "Out of fuel. Use roadside refuel below the fuel meter, or choose Full Tank at the end of this shift."}
    </p>
  );

  return <div className="mt-3 border-t border-[#aaa18d] pt-3">
    <p className="text-xs">At <strong>{STOP_BY_ID[danfo.node].name}</strong></p>
    <p className="my-2 text-xs leading-5 text-[#676052]">
      {waiting.length ? `Waiting for: ${STOP_IDS.map((id) => {
        const count = waiting.filter((person) => person.destination === id).length;
        return count ? `${STOP_BY_ID[id].name} (${count})` : null;
      }).filter(Boolean).join(", ")}` : "No passengers here. Head to a stop with a queue."}
    </p>
    <p className="mb-2 text-[10px] font-black tracking-widest">CHOOSE A STOP TO PREVIEW</p>
    <div className="grid grid-cols-2 gap-2">
      {STOP_IDS.filter((id) => id !== danfo.node).map((id) => {
        const stop = STOP_BY_ID[id];
        const queue = state.stops[id].waiting;
        const countdown = overflowSeconds(state, id);
        const patience = passengerPatience(state);
        const urgent = queue.length >= stop.capacity * 0.75 || queue.some((p) => state.now - p.waitingSince > patience * 0.75);
        return <button key={id} onClick={() => onPreview(id)} aria-pressed={destination === id}
          className={`min-h-12 cursor-pointer border px-2 py-2 text-left text-[11px] ${destination === id ? "border-black bg-[#ffd000]" : "border-[#8e8572] hover:bg-[#eee9df]"}`}>
          <strong className="block">{stop.name}</strong>
          {countdown !== null && <span className="block font-bold text-[#a12d20]">Overflow in {countdown}s</span>}
          <span className={urgent ? "font-bold text-[#a12d20]" : "text-[#676052]"}>{urgent ? "Urgent · " : ""}{queue.length}/{stop.capacity} waiting</span>
          {stop.refuel && <span className="block text-[#676052]">Free refuel</span>}
        </button>;
      })}
    </div>
    {destination && <div className="mt-3 border border-[#8e8572] p-3 text-xs" aria-live="polite">
      {path.length > 1 ? <>
        <p className="font-bold">{path.map((id) => STOP_BY_ID[id].name).join(" → ")}</p>
        <p className="mt-2">About {Math.ceil(seconds / state.gameSpeed)}s at {state.gameSpeed}× · {boarding} boarding here</p>
        <p className="mt-1 text-[#676052]">Current traffic; stops along the route are served automatically.</p>
      </> : <p>No clear route. Choose another stop or wait for the road to reopen.</p>}
      <button disabled={!canDispatch} onClick={() => onDispatch(destination)} className="mt-3 min-h-11 w-full cursor-pointer border border-black bg-[#ffd000] px-3 py-2 font-black disabled:opacity-40">
        DISPATCH TO {STOP_BY_ID[destination].name}
      </button>
    </div>}
  </div>;
}
