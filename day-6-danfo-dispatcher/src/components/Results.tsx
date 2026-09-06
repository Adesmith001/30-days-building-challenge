import { useState } from "react";
import { DIFFICULTIES } from "../lib/difficulty";
import {
  RotateCcw,
  Share2,
} from "lucide-react";
import { getNextRank, getRank } from "../lib/ranks";
import { efficiency } from "../lib/scoring";
import type { GameState } from "../types/game";
import { GlobalHeader } from "./GlobalHeader";

interface Props {
  state: GameState;
  onAgain(): void;
  onSettings(): void;
  onHome(): void;
  onAbout(): void;
}

export function Results({
  state,
  onAgain,
  onSettings,
  onHome,
  onAbout,
}: Props) {
  const [shareStatus, setShareStatus] = useState("");
  const tip = state.danfos.some((d) => d.status === "out-of-fuel")
    ? "Keep buses moving: visit Ikeja or CMS before fuel falls below 25%, or use roadside refuel when stranded."
    : state.stats.overflows > 0
    ? "Rescue full stops during their warning countdown. Send an idle bus on a route matching the waiting passengers."
    : state.stats.lost > 0
    ? "Prioritize urgent queues: passengers close to leaving need a matching route before a larger, newer queue."
    : state.stats.delivered === 0
    ? "Start with Danfo 01 at Yaba, preview CMS Marina and dispatch to complete your first delivery."
    : "Try a repeating shuttle on a busy corridor, then use Next Idle Danfo to cover the rest of the map.";
  const rank = getRank(state.score);
  const next = getNextRank(state.score);

  const networkEfficiency = efficiency(
    state.stats.delivered,
    state.stats.spawned,
  );

  const shareText = [
    "DANFO DISPATCHER",
    "",
    "DAY 06 / 30",
    `${DIFFICULTIES[state.difficulty].label.toUpperCase()} MODE`,
    "",
    state.score.toLocaleString(),
    rank.name,
    "",
    `${state.stats.delivered} DELIVERED`,
    `${networkEfficiency}% EFFICIENCY`,
    `BEST FLOW ×${state.stats.bestFlow}`,
    "",
    "LAGOS MOVED.",
  ].join("\n");

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Danfo Dispatcher", text: shareText });
        setShareStatus("Result shared.");
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus("Result copied to clipboard.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("Sharing is unavailable. You can select and copy your results here.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <GlobalHeader
        onAbout={onAbout}
        status="ROTATION COMPLETE"
      />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div
          className="
            border border-black
            shadow-[6px_6px_0_#171717]
          "
        >
          <div className="border-b border-black bg-[#eceae7] px-6 py-4 text-xs tracking-[0.16em]">
            ■ SHIFT DEBRIEF // NETWORK FINAL
          </div>

          <div className="grid lg:grid-cols-2">
            <section className="border-b border-black p-8 lg:border-b-0 lg:border-r">
              <div className="text-xs">
                {DIFFICULTIES[state.difficulty].label.toUpperCase()} / CITY SCORE
              </div>

              <div
                className="
                  mt-2 text-7xl font-black
                  tracking-[-0.06em]
                  sm:text-8xl
                "
              >
                {state.score.toLocaleString()}
              </div>

              <div className="mt-5 inline-block bg-[#ffd000] px-4 py-2 text-xl font-black">
                {rank.name}
              </div>

              {next && (
                <p className="mt-5 text-sm">
                  {(next.minimum - state.score).toLocaleString()}
                  {" "}POINTS TO
                  {" "}
                  <strong>{next.name}</strong>
                </p>
              )}

              <div className="mt-10 text-2xl font-black">
                {state.endReason ??
                  "ROTATION CONCLUDED."}
              </div>

              <p className="mt-2 text-[#686052]">
                {tip}
              </p>
            </section>

            <section className="p-8">
              <div className="text-xs tracking-[0.15em]">
                OPERATIONAL TELEMETRY
              </div>

              <div className="mt-5 divide-y divide-[#b8ae9a] border-y border-[#b8ae9a]">
                {[
                  [
                    "PASSENGERS",
                    state.stats.spawned,
                  ],
                  [
                    "DELIVERED",
                    state.stats.delivered,
                  ],
                  ["LOST", state.stats.lost],
                  [
                    "OVERFLOWS",
                    state.stats.overflows,
                  ],
                  [
                    "BEST FLOW",
                    `×${state.stats.bestFlow}`,
                  ],
                  [
                    "NETWORK EFFICIENCY",
                    `${networkEfficiency}%`,
                  ],
                  [
                    "TOTAL CASH",
                    `₦${state.cash.toLocaleString()}`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="flex justify-between py-3 text-sm"
                  >
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={onAgain}
                  className="
                    flex cursor-pointer
                    items-center justify-center
                    gap-2 border border-black
                    bg-[#ffd000] px-5 py-4
                    font-black
                    shadow-[3px_3px_0_#171717]
                  "
                >
                  <RotateCcw size={18} />
                  PLAY AGAIN
                </button>

                <button
                  onClick={share}
                  className="
                    flex cursor-pointer
                    items-center justify-center
                    gap-2 border border-black
                    px-5 py-4 font-black
                  "
                >
                  <Share2 size={18} />
                  SHARE RESULT
                </button>
              </div>

              <p role="status" className="mt-3 text-xs">{shareStatus}</p>
              <p className="mt-2 text-xs text-[#686052]">Replay starts immediately in {DIFFICULTIES[state.difficulty].label} mode, without the tutorial.</p>
              <button onClick={onSettings} className="mt-4 min-h-11 text-xs underline">CHANGE MODE / VIEW GUIDE</button>
              <button
                onClick={onHome}
                className="mt-5 text-xs underline"
              >
                RETURN TO DISPATCH OFFICE
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}