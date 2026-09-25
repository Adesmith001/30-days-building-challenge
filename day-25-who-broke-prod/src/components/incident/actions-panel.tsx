import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  X,
} from "lucide-react";
import { getScenario } from "@/data/incidents";
import type { ActionDefinition } from "@/types";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

export function ActionsPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const executeAction = useGameStore(
    (state) => state.executeAction,
  );

  const [selected, setSelected] =
    useState<ActionDefinition | null>(
      null,
    );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const lastAction =
    run.actions.at(-1);

  return (
    <div>
      <SectionHeader
        eyebrow="OPERATIONAL CONTROL"
        title="ACTIONS"
        description="Every action changes simulated time or system state. Nothing is labelled correct in advance."
      />

      {lastAction && (
        <div className="mb-5 border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="font-mono text-[9px] tracking-wider text-zinc-600">
            LAST OBSERVED RESULT
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-300">
            {lastAction.consequence}
          </p>
        </div>
      )}

      <div className="border border-zinc-800">
        {scenario.actions.map(
          (action) => (
            <button
              key={action.id}
              disabled={
                run.status ===
                "mitigating"
              }
              onClick={() =>
                setSelected(action)
              }
              className="grid w-full gap-3 border-b border-zinc-800 p-4 text-left transition last:border-0 hover:bg-zinc-900 disabled:opacity-40 md:grid-cols-[1.2fr_.8fr_100px_20px]"
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.08em]">
                  {action.label}
                </p>

                <p className="mt-1 font-mono text-[9px] text-zinc-600">
                  {action.target}
                </p>
              </div>

              <p className="text-xs leading-5 text-zinc-500">
                {action.potential}
              </p>

              <span className="font-mono text-[10px] text-zinc-600">
                +{action.costSeconds}s
              </span>

              <ArrowRight
                size={13}
                className="text-zinc-700"
              />
            </button>
          ),
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="w-full max-w-lg border border-zinc-700 bg-[#0b0d0f]">
            <div className="flex justify-between border-b border-zinc-800 p-4">
              <span className="font-mono text-[10px] tracking-wider text-zinc-500">
                CONFIRM OPERATION
              </span>

              <button
                onClick={() =>
                  setSelected(null)
                }
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-6">
              <AlertTriangle
                size={18}
                className="text-amber-400"
              />

              <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                {selected.label}?
              </h3>

              <p className="mt-2 font-mono text-xs text-zinc-500">
                {selected.target}
              </p>

              <div className="mt-8 grid gap-px bg-zinc-800 sm:grid-cols-2">
                <div className="bg-[#0b0d0f] p-4">
                  <p className="font-mono text-[9px] text-zinc-600">
                    SIMULATED TIME
                  </p>

                  <p className="mt-2 font-mono text-xl">
                    {selected.costSeconds}s
                  </p>
                </div>

                <div className="bg-[#0b0d0f] p-4">
                  <p className="font-mono text-[9px] text-zinc-600">
                    POTENTIAL EFFECT
                  </p>

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    {selected.potential}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  CANCEL
                </Button>

                <Button
                  onClick={() => {
                    executeAction(
                      selected.id,
                    );
                    setSelected(null);
                  }}
                >
                  EXECUTE
                  <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
