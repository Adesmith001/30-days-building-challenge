import { getScenario } from "@/data/incidents";
import { buildTimeline } from "@/lib/timeline";
import { scenarioTime } from "@/lib/time";
import { SectionHeader } from "@/components/ui/section-header";
import { useGameStore } from "@/store/use-game-store";

export function TimelinePanel() {
  const run = useGameStore(
    (state) => state.run,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const timeline = buildTimeline(
    scenario,
    run,
  );

  return (
    <div>
      <SectionHeader
        eyebrow="CHRONOLOGY"
        title="INCIDENT TIMELINE"
        description="System events and your own investigation are recorded in one sequence."
      />

      <div className="border-l border-zinc-800 pl-6">
        {timeline.map((item) => (
          <div
            key={item.id}
            className="relative pb-7"
          >
            <span className="absolute -left-[29px] top-1 h-2 w-2 border border-zinc-600 bg-[#0a0c0e]" />

            <p className="font-mono text-[9px] text-zinc-600">
              {scenarioTime(
                scenario,
                item.at,
              )}
            </p>

            <p className="mt-1 text-xs font-semibold tracking-[0.08em]">
              {item.label}
            </p>

            {item.detail && (
              <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-600">
                {item.detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
