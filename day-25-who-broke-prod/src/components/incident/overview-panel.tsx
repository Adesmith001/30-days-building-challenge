import {
  Activity,
  FileText,
  GitCommitHorizontal,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { SystemMap } from "./system-map";
import { useGameStore } from "@/store/use-game-store";
import { getScenario } from "@/data/incidents";

export function OverviewPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const openPanel = useGameStore(
    (state) => state.openPanel,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  return (
    <div>
      <SectionHeader
        eyebrow="INCIDENT COMMAND CENTER"
        title={scenario.alert.title}
        description="Start with the system. Correlate symptoms before changing production."
      />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_.6fr]">
        <SystemMap
          scenario={scenario}
          compact
        />

        <div className="border border-zinc-800">
          <div className="border-b border-zinc-800 p-4">
            <p className="font-mono text-[9px] tracking-[0.14em] text-zinc-600">
              CUSTOMER IMPACT
            </p>

            <p className="mt-2 font-mono text-3xl text-red-300">
              {run.impact.toLocaleString()}
            </p>

            <p className="mt-1 text-[10px] tracking-wider text-zinc-600">
              FAILED / DELAYED
            </p>
          </div>

          {[
            {
              id: "metrics" as const,
              icon: Activity,
              title: "VIEW METRICS",
              text: "Understand system behaviour.",
            },
            {
              id: "logs" as const,
              icon: FileText,
              title: "SEARCH LOGS",
              text: "Find events around the incident.",
            },
            {
              id: "deploys" as const,
              icon: GitCommitHorizontal,
              title: "RECENT CHANGES",
              text: "Inspect deploy and change timing.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() =>
                  openPanel(item.id)
                }
                className="flex w-full items-start gap-3 border-b border-zinc-800 p-4 text-left transition last:border-0 hover:bg-zinc-900"
              >
                <Icon
                  size={15}
                  className="mt-0.5 text-zinc-500"
                />

                <div>
                  <p className="text-[10px] font-semibold tracking-wider">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {item.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
