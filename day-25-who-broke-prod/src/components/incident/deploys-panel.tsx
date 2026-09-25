import { useState } from "react";
import { Pin } from "lucide-react";
import { getScenario } from "@/data/incidents";
import { scenarioTime } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

export function DeploysPanel() {
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
    scenario.deploys.find(
      (deploy) =>
        deploy.id === selectedId,
    ) ?? scenario.deploys.at(-1);

  return (
    <div>
      <SectionHeader
        eyebrow="RECENT CHANGES"
        title="DEPLOYS"
        description="Temporal correlation is evidence. It is not automatically causation."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="border border-zinc-800">
          {scenario.deploys.map(
            (deploy) => (
              <button
                key={deploy.id}
                onClick={() =>
                  setSelectedId(
                    deploy.id,
                  )
                }
                className="grid w-full gap-3 border-b border-zinc-800 p-4 text-left last:border-0 hover:bg-zinc-900 md:grid-cols-[90px_150px_1fr]"
              >
                <span className="font-mono text-[10px] text-zinc-600">
                  {scenarioTime(
                    scenario,
                    deploy.offset,
                  )}
                </span>

                <span className="font-mono text-[10px] text-zinc-300">
                  {deploy.serviceId}
                  <br />
                  <span className="text-zinc-600">
                    {deploy.version}
                  </span>
                </span>

                <span className="text-xs text-zinc-500">
                  {deploy.summary}
                </span>
              </button>
            ),
          )}
        </div>

        {selected && (
          <div className="border border-zinc-800 p-5">
            <p className="font-mono text-[9px] tracking-wider text-zinc-600">
              DEPLOY DETAIL
            </p>

            <h3 className="mt-3 text-xl font-semibold">
              {selected.serviceId}
            </h3>

            <p className="mt-1 font-mono text-sm text-blue-300">
              {selected.version}
            </p>

            <dl className="mt-8 space-y-5">
              <div>
                <dt className="font-mono text-[9px] text-zinc-600">
                  DEPLOYED
                </dt>

                <dd className="mt-1 font-mono text-xs">
                  {scenarioTime(
                    scenario,
                    selected.offset,
                  )}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[9px] text-zinc-600">
                  COMMIT
                </dt>

                <dd className="mt-1 font-mono text-xs">
                  {selected.commit}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[9px] text-zinc-600">
                  CHANGE
                </dt>

                <dd className="mt-1 text-xs leading-5 text-zinc-400">
                  {selected.summary}
                </dd>
              </div>
            </dl>

            {selected.evidenceLabel && (
              <Button
                variant="secondary"
                className="mt-8 w-full"
                onClick={() =>
                  pinEvidence({
                    sourceId:
                      selected.id,
                    kind: "deploy",
                    label:
                      selected.evidenceLabel!,
                  })
                }
              >
                <Pin size={12} />
                PIN CORRELATION
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
