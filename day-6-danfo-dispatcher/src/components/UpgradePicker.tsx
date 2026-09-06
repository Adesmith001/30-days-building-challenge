import {
  ArrowRight,
} from "lucide-react";
import { getUpgradeChoices } from "../data/upgrades";
import type {
  GameState,
  UpgradeId,
} from "../types/game";
import { GlobalHeader } from "./GlobalHeader";

interface Props {
  state: GameState;
  onAbout(): void;
  onChoose(id: UpgradeId): void;
}

export function UpgradePicker({
  state,
  onAbout,
  onChoose,
}: Props) {
  const choices = getUpgradeChoices(state.shift);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <GlobalHeader
        onAbout={onAbout}
        status="SHIFT DEBRIEF"
      />

      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="border border-black shadow-[6px_6px_0_#171717]">
          <div className="flex items-center justify-between border-b border-black bg-[#eceae7] px-6 py-4">
            <span className="text-xs tracking-[0.18em]">
              ■ SHIFT DEBRIEF //
              ROTATION CONCLUDED
            </span>

            <span className="text-xs">
              SHIFT {String(state.shift).padStart(2, "0")}
              {" "}COMPLETE
            </span>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-2">
            <section>
              <div className="text-xs tracking-[0.16em]">
                TOTAL COMMUTERS EVACUATED
              </div>

              <div className="mt-2 text-6xl font-black">
                {state.stats.delivered}
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex justify-between border border-[#9c9480] p-4">
                  <span>PASSENGERS LOST</span>
                  <strong>{state.stats.lost}</strong>
                </div>

                <div className="flex justify-between border border-[#9c9480] p-4">
                  <span>OVERFLOWS</span>
                  <strong>{state.stats.overflows}</strong>
                </div>

                <div className="flex justify-between border border-[#9c9480] p-4">
                  <span>FLOW PEAK</span>
                  <strong>
                    ×{state.stats.bestFlow}
                  </strong>
                </div>

                <div className="flex justify-between border border-[#9c9480] bg-[#ffd000] p-4">
                  <span>CITY SCORE</span>
                  <strong>
                    {state.score.toLocaleString()}
                  </strong>
                </div>
              </div>
            </section>

            <section>
              <div className="text-xs tracking-[0.16em]">
                CHOOSE ONE UPGRADE
              </div>

              <div className="mt-4 grid gap-4">
                {choices.map((upgrade) => (
                  <button
                    key={upgrade.id}
                    onClick={() =>
                      onChoose(upgrade.id)
                    }
                    className="
                      group cursor-pointer
                      border border-black p-5
                      text-left transition
                      hover:-translate-y-1
                      hover:bg-[#ffd000]
                      hover:shadow-[4px_4px_0_#171717]
                    "
                  >
                    <div className="flex items-center justify-between gap-4">
                      <strong className="text-xl">
                        {upgrade.name}
                      </strong>

                      <ArrowRight
                        className="
                          transition
                          group-hover:translate-x-1
                        "
                      />
                    </div>

                    <p className="mt-3 text-sm text-[#625b4e]">
                      {upgrade.description}
                    </p>

                    <div className="mt-4 text-xs font-black">
                      {upgrade.stat}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}