import { useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { useGameStore } from "@/store/use-game-store";

const costs = [100, 250, 500];

export function Hints() {
  const run = useGameStore(
    (state) => state.run,
  );

  const useHint = useGameStore(
    (state) => state.useHint,
  );

  const [open, setOpen] =
    useState(false);

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-30 flex h-10 w-10 items-center justify-center border border-zinc-800 bg-[#0b0d0f] text-zinc-500 hover:text-amber-300 lg:bottom-5"
        aria-label="Hints"
      >
        <Lightbulb size={15} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-md border border-zinc-700 bg-[#0b0d0f]">
            <header className="flex items-center justify-between border-b border-zinc-800 p-4">
              <span className="font-mono text-[10px] tracking-wider text-zinc-500">
                PROCEDURAL HINTS
              </span>

              <button
                onClick={() =>
                  setOpen(false)
                }
              >
                <X size={14} />
              </button>
            </header>

            <div>
              {scenario.hints.map(
                (hint, index) => {
                  const revealed =
                    run.hintsUsed.includes(
                      index + 1,
                    );

                  return (
                    <button
                      key={hint}
                      onClick={() =>
                        useHint(
                          index + 1,
                        )
                      }
                      className="w-full border-b border-zinc-800 p-4 text-left last:border-0"
                    >
                      <div className="flex justify-between font-mono text-[9px]">
                        <span className="text-zinc-500">
                          HINT {index + 1}
                        </span>

                        <span className="text-amber-700">
                          -{costs[index]}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-zinc-300">
                        {revealed
                          ? hint
                          : "Reveal hint"}
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
