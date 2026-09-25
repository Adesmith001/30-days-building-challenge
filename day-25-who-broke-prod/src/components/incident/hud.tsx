import {
  Pause,
  Play,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { scenarioTime } from "@/lib/time";
import { getScenario } from "@/data/incidents";
import { useGameStore } from "@/store/use-game-store";

export function IncidentHud() {
  const run = useGameStore(
    (state) => state.run,
  );

  const togglePause = useGameStore(
    (state) => state.togglePause,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const tone =
    run.status === "verifying"
      ? "green"
      : run.status === "mitigating"
        ? "blue"
        : "amber";

  return (
    <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-zinc-800 bg-[#0a0c0e]/95 px-4 backdrop-blur md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Badge
          tone={
            scenario.severity === "SEV-1"
              ? "red"
              : "amber"
          }
        >
          {scenario.severity}
        </Badge>

        <span className="truncate text-[11px] font-semibold tracking-[0.1em] text-zinc-300">
          {scenario.subtitle}
        </span>

        <Badge tone={tone}>
          {run.status.toUpperCase()}
        </Badge>
      </div>

      <div className="hidden font-mono text-xs text-zinc-300 sm:block">
        {scenarioTime(
          scenario,
          run.simulatedTime,
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-mono text-[9px] text-zinc-600">
            IMPACT
          </p>

          <AnimatePresence mode="popLayout">
            <motion.p
              key={run.impact}
              initial={{ opacity: 0.5, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-red-300"
            >
              {run.impact.toLocaleString()} FAILED
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          onClick={togglePause}
          className="border-l border-zinc-800 pl-4 text-zinc-500 hover:text-white"
          aria-label={
            run.paused
              ? "Resume incident"
              : "Pause incident"
          }
        >
          {run.paused ? (
            <Play size={14} />
          ) : (
            <Pause size={14} />
          )}
        </button>
      </div>
    </header>
  );
}
