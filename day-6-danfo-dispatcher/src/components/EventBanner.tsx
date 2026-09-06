import { AlertTriangle } from "lucide-react";
import type { GameState } from "../types/game";

interface Props { state: GameState; onPayPolice(): void; }

export function EventBanner({ state, onPayPolice }: Props) {
  const event = state.incident;
  if (!event) return null;
  const dangerous = event.type === "roadblock" || event.type === "police";

  return <div className={`pointer-events-auto absolute left-1/2 top-3 z-30 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 border px-3 py-2 shadow-[3px_3px_0_#171717] ${dangerous ? "border-red-700 bg-red-50" : "border-[#817762] bg-[#f7f4ef]"}`}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2"><AlertTriangle size={15} className={dangerous ? "shrink-0 text-red-700" : "shrink-0"} /><div className="min-w-0"><div className={`truncate text-[10px] font-black tracking-[0.12em] ${dangerous ? "text-red-700" : ""}`}>{event.title}</div><div className="truncate text-[10px] text-[#676052]">{event.detail}</div></div></div>
      {event.type === "police" && event.bribeCost && <button onClick={onPayPolice} disabled={state.cash < event.bribeCost} className="shrink-0 cursor-pointer border border-black bg-[#ffd000] px-3 py-1.5 text-[10px] font-black disabled:cursor-not-allowed disabled:opacity-40">SETTLE ₦{event.bribeCost.toLocaleString()}</button>}
    </div>
  </div>;
}
