import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

export function EvidencePanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  const openPanel = useGameStore(
    (state) => state.openPanel,
  );

  if (!run) return null;

  return (
    <div>
      <SectionHeader
        eyebrow={`${run.evidence.length} ITEMS`}
        title="EVIDENCE"
        description="Build a technical case before changing production."
      />

      {run.evidence.length === 0 ? (
        <div className="border border-dashed border-zinc-800 p-8">
          <p className="text-sm text-zinc-500">
            Nothing pinned yet.
          </p>

          <p className="mt-2 max-w-md text-xs leading-5 text-zinc-700">
            Metrics, logs, traces, deploys
            and system state can all become
            evidence.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-800">
          {run.evidence.map(
            (item, index) => (
              <div
                key={item.id}
                className="grid gap-4 border-b border-zinc-800 p-4 last:border-0 md:grid-cols-[60px_100px_1fr]"
              >
                <span className="font-mono text-sm text-zinc-700">
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </span>

                <span className="font-mono text-[9px] uppercase tracking-wider text-blue-400">
                  {item.kind}
                </span>

                <p className="text-xs leading-5 text-zinc-300">
                  {item.label}
                </p>
              </div>
            ),
          )}
        </div>
      )}

      <Button
        className="mt-6"
        disabled={
          run.evidence.length === 0
        }
        onClick={() =>
          openPanel("hypothesis")
        }
      >
        FORM HYPOTHESIS
        <ArrowRight size={13} />
      </Button>
    </div>
  );
}
