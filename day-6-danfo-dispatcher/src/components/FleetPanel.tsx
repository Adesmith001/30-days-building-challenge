import { BusFront, Fuel, Gauge, Volume2 } from "lucide-react";
import { STOP_IDS, STOP_BY_ID } from "../data/stops";
import type { GameState, StopId } from "../types/game";

interface Props {
  state: GameState;
  onSelectDanfo(id: string): void;
  onDispatch(id: StopId): void;
  onHorn(): void;
  onBuy(): void;
}

export function FleetPanel({ state, onSelectDanfo, onDispatch, onHorn, onBuy }: Props) {
  const selected = state.danfos.find((danfo) => danfo.id === state.selectedDanfoId);

  return (
    <aside className="absolute bottom-14 right-3 z-20 max-h-[52vh] w-[calc(100%-1.5rem)] overflow-auto border border-[#171717] bg-[#f7f4ef] shadow-[4px_4px_0_#171717] sm:bottom-auto sm:right-4 sm:top-4 sm:max-h-[calc(100%-2rem)] sm:w-[19rem]">
      <div className="border-b border-[#9f9683] px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black tracking-[0.16em]">FLEET CONSOLE</div>
          <span className="text-[9px] text-[#676052]">{state.danfos.length} ACTIVE</span>
        </div>
        <div className="mt-3 space-y-1">
          {state.danfos.map((danfo) => {
            const active = danfo.id === state.selectedDanfoId;
            const status = danfo.status === "out-of-fuel" ? "EMPTY" : danfo.status.toUpperCase();
            return (
              <button key={danfo.id} onClick={() => onSelectDanfo(danfo.id)} className={`flex w-full cursor-pointer items-center gap-2 border px-2 py-2 text-left text-[10px] transition-colors ${active ? "border-black bg-[#ffd000]" : "border-transparent hover:border-[#aaa18d] hover:bg-[#eee9df]"}`}>
                <span className="size-2 shrink-0 rounded-full bg-[#ffd000] ring-1 ring-black" />
                <span className="min-w-0 flex-1 font-black">{danfo.name}</span>
                <span className="text-[9px] text-[#676052]">{status}</span>
                <span className="font-black">{danfo.passengers.length}/{danfo.capacity}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onBuy} disabled={state.cash < 4_000} className="mt-3 w-full cursor-pointer border border-black bg-[#ffd000] px-3 py-2 text-[10px] font-black disabled:cursor-not-allowed disabled:opacity-40">
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
          <div className="mt-3 border-t border-[#aaa18d] pt-3">
            <div className="mb-2 flex items-center justify-between"><div className="text-[10px] font-black tracking-[0.12em]">NEXT MOVE</div><span className="text-[9px] text-[#676052]">{selected.status === "idle" ? "CHOOSE A STOP" : "IN TRANSIT"}</span></div>
            <div className="grid grid-cols-2 gap-1.5">
              {STOP_IDS.filter((id) => id !== selected.node).map((id) => (
                <button key={id} disabled={selected.status !== "idle"} onClick={() => onDispatch(id)} className="cursor-pointer border border-[#8e8572] px-2 py-2 text-left text-[10px] hover:bg-[#ffd000] disabled:cursor-not-allowed disabled:opacity-30">
                  <div className="flex items-center justify-between gap-1"><strong>{STOP_BY_ID[id].code}</strong><span className="text-[9px]">Q:{state.stops[id].waiting.length}</span></div>
                </button>
              ))}
            </div>
          </div>
          <button onClick={onHorn} disabled={selected.status !== "moving" || selected.hornUses <= 0} className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 border border-black bg-[#ffd000] px-3 py-2.5 text-xs font-black disabled:cursor-not-allowed disabled:opacity-30">
            <Volume2 size={15} /> USE HORN [{selected.hornUses}]
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-3 text-[10px] text-[#676052]"><Gauge size={14} /> Select a danfo to dispatch it.</div>
      )}
    </aside>
  );
}
