import { BusFront, Fuel, Gauge, Volume2 } from "lucide-react";
import { DispatchOptions } from "./DispatchOptions";
import { STOP_BY_ID, STOP_IDS } from "../data/stops";
import type { GameState, StopId } from "../types/game";

interface Props {
  state: GameState;
  onSelectDanfo(id: string): void;
  onDispatch(id: StopId): void;
  onHorn(): void;
  onToggleRepeat(): void;
  onRefuel(): void;
  onBuy(): void;
  expanded: boolean;
  onToggle(): void;
  destination: StopId | null;
  onPreview(id: StopId): void;
}

export function FleetPanel({ state, onSelectDanfo, onDispatch, onHorn, onToggleRepeat, onRefuel, onBuy, expanded, onToggle, destination, onPreview }: Props) {
  const selected = state.danfos.find((danfo) => danfo.id === state.selectedDanfoId);

  return (
    <aside className="absolute bottom-2 right-3 z-20 max-h-[min(48dvh,calc(100%_-_1rem))] flex flex-col w-[calc(100%-1.5rem)] overflow-hidden border border-[#171717] bg-[#f7f4ef] shadow-[4px_4px_0_#171717] sm:bottom-auto sm:right-4 sm:top-4 sm:max-h-[calc(100%-2rem)] sm:w-[19rem]">
      <button onClick={onToggle} aria-expanded={expanded} aria-controls="fleet-details" className="flex min-h-12 shrink-0 items-center justify-between px-3 text-xs font-black sm:hidden">
        <span>{selected ? selected.name : "FLEET CONSOLE"} / {state.danfos.filter((d) => d.status === "idle").length} idle</span>
        <span>{expanded ? "Hide controls" : "Open controls"}</span>
      </button>
      <div id="fleet-details" className={`${expanded ? "block" : "hidden"} min-h-0 overflow-y-auto sm:block`}>
      <div className="border-b border-[#9f9683] px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black tracking-[0.16em]">FLEET CONSOLE</div>
          <span className="text-[9px] text-[#676052]">{state.danfos.length} ACTIVE</span>
        </div>
        <div className="mt-3 space-y-1">
          {state.danfos.map((danfo) => {
            const active = danfo.id === state.selectedDanfoId;
            const status = danfo.status === "out-of-fuel" ? "EMPTY" : danfo.status === "moving" && danfo.repeatRoute ? "SHUTTLE" : danfo.status.toUpperCase();
            return (
              <button key={danfo.id} aria-pressed={active} onClick={() => onSelectDanfo(danfo.id)} className={`flex w-full cursor-pointer items-center gap-2 min-h-11 border px-2 py-2 text-left text-[10px] transition-colors ${active ? "border-black bg-[#ffd000]" : "border-transparent hover:border-[#aaa18d] hover:bg-[#eee9df]"}`}>
                <span className="size-2 shrink-0 rounded-full bg-[#ffd000] ring-1 ring-black" />
                <span className="min-w-0 flex-1 font-black">{danfo.name}</span>
                <span className="text-[9px] text-[#676052]">{status}</span>
                <span className="font-black">{danfo.passengers.length}/{danfo.capacity}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onBuy} disabled={state.cash < 4_000} className="mt-3 min-h-11 w-full cursor-pointer border border-black bg-[#ffd000] px-3 py-2 text-[10px] font-black disabled:cursor-not-allowed disabled:opacity-40">
          + DEPLOY DANFO · ₦4,000
        </button>
      </div>

      {selected ? (
        <div className="px-3 py-3">
          <div className="flex items-center justify-between border-b border-[#aaa18d] pb-3">
            <div className="flex items-center gap-2"><BusFront size={16} /><strong className="text-xs">{selected.name}</strong></div>
            <span className="text-[9px] uppercase text-[#676052]">{selected.status}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div className="border border-[#aaa18d] p-2"><div className="text-[#676052]">ONBOARD</div><strong className="text-base">{selected.passengers.length}/{selected.capacity}</strong></div>
            <div className="border border-[#aaa18d] p-2"><div className="flex items-center gap-1 text-[#676052]"><Fuel size={11} /> FUEL</div><strong className="text-base">{Math.round(selected.fuel)}%</strong></div>
          </div>
          {selected.passengers.length > 0 && <p className="mt-2 text-xs leading-5 text-[#676052]">
            Onboard for: {STOP_IDS.map((id) => {
              const count = selected.passengers.filter((p) => p.destination === id).length;
              return count ? `${STOP_BY_ID[id].name} (${count})` : null;
            }).filter(Boolean).join(", ")}
          </p>}
          {selected.fuel < 25 && <p role="status" className="mt-3 text-xs font-bold text-[#a12d20]">Low fuel. Refuel free at Ikeja or CMS, or call roadside support when stopped.</p>}
          {(selected.status === "idle" || selected.status === "out-of-fuel") && selected.fuel < 100 && <button onClick={onRefuel} disabled={state.cash < 300} className="mt-2 min-h-11 w-full cursor-pointer border border-black px-3 text-xs font-black disabled:opacity-40">
            {state.cash < 300 ? "NEED 300 NAIRA FOR REFUEL" : "ROADSIDE REFUEL - 300 NAIRA"}
          </button>}
          <DispatchOptions state={state} danfo={selected} destination={destination} onPreview={onPreview} onDispatch={onDispatch} />
          {selected.arrival && <p className="mt-2 text-xs leading-5 text-[#676052]">{selected.arrival.message}</p>}
          <button onClick={onToggleRepeat} aria-pressed={!!selected.repeatRoute} disabled={!selected.repeatRoute && selected.status !== "moving"}
            className="mt-3 min-h-11 w-full cursor-pointer border border-black px-3 py-2 text-xs font-black disabled:opacity-40">
            {selected.repeatRoute ? "STOP REPEATING AFTER THIS TRIP" : "REPEAT THIS ROUTE"}
          </button>
          <p className="mt-1 text-[10px] leading-4 text-[#676052]">
            {selected.repeatRoute
              ? `${selected.repeatRoute.map((id) => STOP_BY_ID[id].name).join(" ↔ ")}. Stops at low fuel or if no clear route remains.`
              : "After dispatching, enable a shuttle between the trip's two endpoints."}
          </p>
          <button onClick={onHorn} disabled={selected.status !== "moving" || selected.hornUses <= 0} className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 border border-black bg-[#ffd000] px-3 py-2.5 text-xs font-black disabled:cursor-not-allowed disabled:opacity-30">
            <Volume2 size={15} /> USE HORN [{selected.hornUses}]
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-3 text-[10px] text-[#676052]"><Gauge size={14} /> Select a danfo to dispatch it.</div>
      )}
      </div>
    </aside>
  );
}
