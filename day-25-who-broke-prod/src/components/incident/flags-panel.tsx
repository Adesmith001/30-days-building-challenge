import { Pin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { scenarioTime } from "@/lib/time";
import { getScenario } from "@/data/incidents";
import { useGameStore } from "@/store/use-game-store";

export function FlagsPanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const pinEvidence = useGameStore(
    (state) => state.pinEvidence,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  return (
    <div>
      <SectionHeader
        eyebrow="RUNTIME CONFIGURATION"
        title="FEATURE FLAGS"
        description="Inspect rollout state and recent configuration changes."
      />

      {scenario.flags.length === 0 ? (
        <div className="border border-dashed border-zinc-800 p-8 text-sm text-zinc-600">
          No incident-relevant feature flags
          are configured for this system.
        </div>
      ) : (
        <div className="border border-zinc-800">
          {scenario.flags.map((flag) => (
            <div
              key={flag.id}
              className="grid gap-4 border-b border-zinc-800 p-4 last:border-0 md:grid-cols-[1fr_100px_100px_120px_40px]"
            >
              <span className="font-mono text-xs text-zinc-300">
                {flag.name}
              </span>

              <span className="font-mono text-[10px] text-zinc-500">
                {flag.enabled
                  ? "ON"
                  : "OFF"}
              </span>

              <span className="font-mono text-[10px] text-zinc-500">
                {flag.rollout}%
              </span>

              <span className="font-mono text-[10px] text-zinc-600">
                {scenarioTime(
                  scenario,
                  flag.changedOffset,
                )}
              </span>

              <button
                onClick={() =>
                  pinEvidence({
                    sourceId: flag.id,
                    kind: "flag",
                    label: `${flag.name} ${
                      flag.enabled
                        ? "enabled"
                        : "disabled"
                    } at ${flag.rollout}% rollout`,
                  })
                }
                className="text-zinc-600 hover:text-blue-300"
              >
                <Pin size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
