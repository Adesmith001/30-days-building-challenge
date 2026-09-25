import { getScenario } from "@/data/incidents";
import { buildTimeline } from "@/lib/timeline";
import { scenarioTime } from "@/lib/time";
import { useGameStore } from "@/store/use-game-store";

export function TimelineRail() {
  const run = useGameStore(
    (state) => state.run,
  );

  const setNotes = useGameStore(
    (state) => state.setNotes,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  const timeline = buildTimeline(
    scenario,
    run,
  ).slice(-8);

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-l border-zinc-800 bg-[#090b0d] 2xl:block">
      <div className="h-14 border-b border-zinc-800 px-4 py-4">
        <span className="font-mono text-[9px] tracking-[0.16em] text-zinc-500">
          INCIDENT TIMELINE
        </span>
      </div>

      <div className="max-h-[55vh] overflow-y-auto p-4">
        <div className="border-l border-zinc-800 pl-4">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="relative pb-5"
            >
              <span className="absolute -left-[19px] top-1 h-1.5 w-1.5 bg-zinc-600" />

              <p className="font-mono text-[8px] text-zinc-700">
                {scenarioTime(
                  scenario,
                  item.at,
                )}
              </p>

              <p className="mt-1 text-[9px] font-semibold tracking-wider text-zinc-400">
                {item.label}
              </p>

              {item.detail && (
                <p className="mt-1 text-[9px] leading-4 text-zinc-700">
                  {item.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <p className="mb-2 font-mono text-[9px] tracking-wider text-zinc-600">
          NOTES
        </p>

        <textarea
          value={run.notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          placeholder="- started after deploy&#10;- payment healthy&#10;- inspect logs"
          className="h-44 w-full resize-none border border-zinc-800 bg-[#0a0c0e] p-3 font-mono text-[10px] leading-5 text-zinc-400 outline-none focus:border-zinc-600"
        />
      </div>
    </aside>
  );
}

