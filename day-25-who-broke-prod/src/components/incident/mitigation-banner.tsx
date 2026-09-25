import { getScenario } from "@/data/incidents";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

export function MitigationBanner() {
  const run = useGameStore(
    (state) => state.run,
  );

  const verifyRecovery = useGameStore(
    (state) => state.verifyRecovery,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  if (
    run.status === "mitigating" &&
    run.activeAction
  ) {
    const total =
      run.activeAction.endsAt -
      run.activeAction.startAt;

    const done =
      run.simulatedTime -
      run.activeAction.startAt;

    const progress = Math.max(
      0,
      Math.min(1, done / total),
    );

    const replaced = Math.min(
      6,
      Math.floor(progress * 6),
    );

    return (
      <div className="border-b border-blue-900/60 bg-blue-950/20 px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] tracking-wider text-blue-400">
              MITIGATING
            </p>

            <p className="mt-1 text-xs text-zinc-300">
              {run.activeAction.label}
            </p>
          </div>

          <div className="text-right font-mono text-[10px] text-zinc-500">
            {replaced} / 6 INSTANCES
          </div>
        </div>

        <div className="mt-3 h-1 bg-zinc-900">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>
      </div>
    );
  }

  if (run.status === "verifying") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900/50 bg-emerald-950/10 px-4 py-3 md:px-5">
        <div>
          <p className="font-mono text-[9px] tracking-wider text-emerald-400">
            SYSTEM RECOVERING
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Telemetry is returning toward
            baseline. Verify before closing the
            incident.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={verifyRecovery}
        >
          VERIFY RECOVERY →
        </Button>
      </div>
    );
  }

  return null;
}
