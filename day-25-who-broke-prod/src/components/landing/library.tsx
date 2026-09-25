import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
} from "lucide-react";
import { scenarios } from "@/data/incidents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

export function Library() {
  const setView = useGameStore(
    (state) => state.setView,
  );

  const startIncident = useGameStore(
    (state) => state.startIncident,
  );

  const startDaily = useGameStore(
    (state) => state.startDaily,
  );

  const history = useGameStore(
    (state) => state.history,
  );

  return (
    <main className="min-h-screen bg-[#090b0d] text-zinc-100">
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-5 md:px-10">
        <button
          onClick={() =>
            setView("landing")
          }
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          25 / 30 · WHO BROKE PROD?
        </button>

        <Button
          variant="secondary"
          onClick={startDaily}
        >
          <CalendarClock size={13} />
          DAILY
        </Button>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10">
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
          INCIDENT LIBRARY
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-0.05em] md:text-7xl">
          INCIDENTS
        </h1>

        <div className="mt-12 border-t border-zinc-800">
          {scenarios.map((scenario) => {
            const best = history
              .filter(
                (item) =>
                  item.scenarioId ===
                  scenario.id,
              )
              .sort(
                (a, b) =>
                  b.score - a.score,
              )[0];

            return (
              <button
                key={scenario.id}
                onClick={() =>
                  startIncident(
                    scenario.id,
                  )
                }
                className="group grid w-full gap-5 border-b border-zinc-800 py-6 text-left transition hover:bg-zinc-900/40 md:grid-cols-[60px_1.5fr_120px_1fr_120px]"
              >
                <span className="font-mono text-xs text-zinc-600">
                  {scenario.number}
                </span>

                <div>
                  <p className="font-semibold tracking-[0.08em]">
                    {scenario.title}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {scenario.subtitle}
                  </p>
                </div>

                <Badge
                  tone={
                    scenario.severity ===
                    "SEV-1"
                      ? "red"
                      : "amber"
                  }
                >
                  {scenario.severity}
                </Badge>

                <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-500">
                  {scenario.skill}
                </span>

                <span className="flex items-center justify-between font-mono text-[10px] text-zinc-600">
                  {best
                    ? best.score.toLocaleString()
                    : "NO RUN"}

                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1 group-hover:text-white"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
