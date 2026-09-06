import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { GameState, StopId } from "../types/game";
import { EventBanner } from "./EventBanner";
import { FleetPanel } from "./FleetPanel";
import { GameHUD } from "./GameHUD";
import { GlobalHeader } from "./GlobalHeader";
import { ScoreBurst } from "./ScoreBurst";
import { CityMap3D } from "./map/CityMap3D";
import { DeliveryFeedback } from "./DeliveryFeedback";
import { STOP_IDS, STOP_BY_ID } from "../data/stops";
import { overflowSeconds } from "../lib/difficulty";

interface Props {
  state: GameState;
  onAbout(): void;
  onSkipTutorial(): void;
  onToggleRepeat(): void;
  onRefuel(): void;
  onSelectDanfo(id: string): void;
  onDispatch(stop: StopId): void;
  onHorn(): void;
  onPolice(): void;
  onBuy(): void;
  onPause(): void;
  onSpeed(speed: 1 | 2): void;
  onEnd(): void;
}

export function GameScreen({ state, onAbout, onSkipTutorial, onToggleRepeat, onRefuel, onSelectDanfo, onDispatch, onHorn, onPolice, onBuy, onPause, onSpeed, onEnd }: Props) {
  const [statusOpen, setStatusOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [preview, setPreview] = useState<{ danfoId: string | null; stop: StopId } | null>(null);
  const selected = state.danfos.find((d) => d.id === state.selectedDanfoId);
  const destination = preview?.danfoId === state.selectedDanfoId ? preview?.stop ?? null : null;
  const selectDanfo = (id: string) => { onSelectDanfo(id); setPreview(null); setExpanded(true); };
  const previewStop = (stop: StopId) => {
    setPreview({ danfoId: state.selectedDanfoId, stop });
    setExpanded(true);
  };
  const dispatch = (stop: StopId) => { onDispatch(stop); setPreview(null); setExpanded(false); };
  const moving = state.danfos.some((d) => d.status === "moving");
  const idle = state.danfos.filter((d) => d.status === "idle");
  const nextIdle = idle[(idle.findIndex((d) => d.id === state.selectedDanfoId) + 1) % idle.length];
  const arrivals = idle.filter((d) => d.arrival && state.now - d.arrival.at < 8_000).slice(-2);
  const criticalStop = STOP_IDS.filter((id) => state.stops[id].fullSince !== null)
    .sort((a, b) => overflowSeconds(state, a)! - overflowSeconds(state, b)!)[0];

  return (
    <div className="flex h-[100dvh] min-h-[480px] flex-col overflow-hidden bg-[#f2efe8]">
      <GlobalHeader onAbout={onAbout} status="LIVE DISPATCH" />
      <GameHUD state={state} onPause={onPause} onSpeed={onSpeed} />
      <DeliveryFeedback state={state} />

      {state.tutorial && <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#918976] bg-[#fff3bd] px-4 py-2 text-xs">
        <p role="status" className="leading-5"><strong>{moving ? "3 / 3 - First delivery" : selected ? "2 / 3 - Pick a destination" : "1 / 3 - Select a danfo"}</strong><br />
          {moving ? "Your passengers are on their way. City pressure starts after your first delivery." : selected ? "Preview a route matching the waiting passengers, then dispatch. Try Danfo 01 to CMS Marina." : "Open fleet controls and select Danfo 01 at Yaba. The shift clock waits for you."}
        </p>
        <button onClick={onSkipTutorial} className="min-h-11 shrink-0 px-2 underline">Skip guide</button>
      </div>}
      <main className="relative min-h-0 flex-1">
        <CityMap3D state={state} onSelectDanfo={selectDanfo} onSelectStop={previewStop} />
        <EventBanner state={state} onPayPolice={onPolice} />
        <ScoreBurst state={state} />
        <FleetPanel state={state} onSelectDanfo={selectDanfo} onDispatch={dispatch} onHorn={onHorn} onToggleRepeat={onToggleRepeat} onRefuel={onRefuel} onBuy={onBuy} expanded={expanded} onToggle={() => setExpanded(!expanded)} destination={destination} onPreview={previewStop} />

        <div className="pointer-events-auto absolute left-3 top-3 z-10 hidden border border-[#171717] bg-[#f7f4ef] text-[10px] shadow-[3px_3px_0_#171717] lg:block">
          <button onClick={() => setStatusOpen((open) => !open)} className="pointer-events-auto flex cursor-pointer items-center gap-3 px-3 py-2 font-black tracking-[0.12em]">
            <span>SHIFT STATUS</span>
            <span className="text-[#676052]">LAGOS METRO</span>
            <ChevronDown size={13} className={statusOpen ? "rotate-180" : ""} />
          </button>
          {statusOpen && (
            <div className="border-t border-[#aaa18d] px-3 py-3">
              <div>ACTIVE CORRIDORS: 10</div>
              <div className="mt-1">CITY HEALTH: {"● ".repeat(state.health)}{"○ ".repeat(3 - state.health)}</div>
            </div>
          )}
        </div>
      </main>
      <div className="flex shrink-0 items-center gap-2 border-t border-[#918976] bg-[#fff3bd] px-3 py-1 text-[11px]">
        <button disabled={!nextIdle} onClick={() => nextIdle && selectDanfo(nextIdle.id)} className="min-h-11 shrink-0 cursor-pointer border border-black px-3 py-2 font-black disabled:opacity-40">
          NEXT IDLE DANFO ({idle.length})
        </button>
        <div className="min-w-0 flex-1" aria-live="polite">
          {criticalStop ? <button onClick={() => previewStop(criticalStop)} className="min-h-11 w-full px-2 text-left font-bold text-[#a12d20] underline">
            {STOP_BY_ID[criticalStop].name}: overflow in {overflowSeconds(state, criticalStop)}s. Send help.
          </button> : arrivals.length ? arrivals.map((danfo) => <button key={danfo.id} onClick={() => selectDanfo(danfo.id)} className="block min-h-11 w-full truncate px-2 text-left underline" title={danfo.arrival!.message}>
            {danfo.name}: {danfo.arrival!.message}
          </button>) : <span className="text-[#676052]">{idle.length ? "Ready for their next trip" : "Your fleet is busy"}</span>}
        </div>
      </div>

      <footer className="grid grid-cols-3 items-center border-t border-[#918976] bg-[#f7f4ef] px-4 py-2 text-[10px] sm:text-xs">
        <div>{state.danfos.length} DANFOS</div>
        <div className="text-center">₦{state.cash.toLocaleString()} TREASURY</div>
        <div className="flex justify-end"><button onClick={onEnd} className="cursor-pointer hover:underline">END RUN</button></div>
      </footer>
    </div>
  );
}
