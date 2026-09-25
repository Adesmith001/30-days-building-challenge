import { useState } from "react";
import { Pin } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { cn } from "@/lib/cn";
import { scenarioTime } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

export function TracesPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const pinEvidence = useGameStore(
    (state) => state.pinEvidence,
  );

  const [selectedId, setSelectedId] =
    useState<string>();

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const selected =
    scenario.traces.find(
      (trace) => trace.id === selectedId,
    ) ?? scenario.traces[0];

  const maxDuration = Math.max(
    1,
    selected?.durationMs ?? 1,
  );

  return (
    <div>
      <div className="flex items-start justify-between">
        <SectionHeader
          eyebrow="DISTRIBUTED TRACING"
          title="TRACES"
          description="Follow a request through the system and identify where time or errors accumulate."
        />

        {selected?.evidenceLabel && (
          <Button
            variant="secondary"
            onClick={() =>
              pinEvidence({
                sourceId: selected.id,
                kind: "trace",
                label:
                  selected.evidenceLabel!,
              })
            }
          >
            <Pin size={12} />
            PIN TRACE
          </Button>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <div className="border border-zinc-800">
          {scenario.traces.map((trace) => (
            <button
              key={trace.id}
              onClick={() =>
                setSelectedId(trace.id)
              }
              className={cn(
                "grid w-full grid-cols-[1fr_70px] gap-4 border-b border-zinc-800 p-4 text-left last:border-0",
                selected?.id === trace.id &&
                  "bg-zinc-900",
              )}
            >
              <div>
                <p className="font-mono text-[10px] text-zinc-300">
                  {trace.id}
                </p>

                <p className="mt-1 text-[10px] text-zinc-600">
                  {trace.root}
                </p>

                <p className="mt-1 font-mono text-[9px] text-zinc-700">
                  {scenarioTime(
                    scenario,
                    trace.offset,
                  )}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "font-mono text-[10px]",
                    trace.status === "error"
                      ? "text-red-400"
                      : "text-emerald-500",
                  )}
                >
                  {trace.status.toUpperCase()}
                </p>

                <p className="mt-2 font-mono text-[10px] text-zinc-500">
                  {trace.durationMs}ms
                </p>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="overflow-x-auto border border-zinc-800 p-4">
            <div className="min-w-[620px]">
              <div className="mb-4 grid grid-cols-[170px_1fr_80px] font-mono text-[9px] text-zinc-600">
                <span>SPAN</span>
                <span>TIMELINE</span>
                <span>DURATION</span>
              </div>

              <div className="space-y-2">
                {selected.spans.map(
                  (span) => {
                    const left =
                      (span.startMs /
                        maxDuration) *
                      100;

                    const width = Math.max(
                      1,
                      (span.durationMs /
                        maxDuration) *
                        100,
                    );

                    return (
                      <div
                        key={span.id}
                        className="grid min-h-11 grid-cols-[170px_1fr_80px] items-center"
                      >
                        <div
                          style={{
                            paddingLeft:
                              span.depth * 12,
                          }}
                        >
                          <p className="font-mono text-[10px] text-zinc-300">
                            {span.service}
                          </p>

                          <p className="truncate text-[9px] text-zinc-700">
                            {span.operation}
                          </p>
                        </div>

                        <div className="relative h-5 bg-zinc-900">
                          <div
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                            }}
                            className={cn(
                              "absolute top-1 h-3 min-w-[3px]",
                              span.status ===
                                "error"
                                ? "bg-red-800"
                                : "bg-blue-800",
                            )}
                          />

                          {span.annotation && (
                            <span className="absolute right-1 top-0.5 font-mono text-[8px] text-amber-300">
                              {
                                span.annotation
                              }
                            </span>
                          )}
                        </div>

                        <p className="text-right font-mono text-[10px] text-zinc-500">
                          {span.durationMs}ms
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
