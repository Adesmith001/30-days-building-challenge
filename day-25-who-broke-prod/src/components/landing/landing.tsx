import {
  ArrowRight,
  CalendarClock,
  History,
  Radio,
} from "lucide-react";
import { BackgroundGraph } from "./background-graph";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

export function Landing() {
  const setView = useGameStore(
    (state) => state.setView,
  );

  const startIncident = useGameStore(
    (state) => state.startIncident,
  );

  const startDaily = useGameStore(
    (state) => state.startDaily,
  );

  const startShift = useGameStore(
    (state) => state.startShift,
  );

  const run = useGameStore(
    (state) => state.run,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090b0d] text-zinc-100">
      <BackgroundGraph />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-zinc-800 px-5 md:px-10">
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs text-zinc-500">
            25 / 30
          </span>

          <span className="text-xs font-semibold tracking-[0.16em]">
            WHO BROKE PROD?
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setView("history")
            }
            className="p-2 text-zinc-500 transition hover:text-white"
            aria-label="Incident history"
          >
            <History size={16} />
          </button>

          <button
            onClick={() =>
              setView("about")
            }
            className="text-[11px] tracking-[0.14em] text-zinc-500 transition hover:text-white"
          >
            ABOUT
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col justify-center px-5 py-16 md:px-10">
        <div className="max-w-4xl">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-zinc-500">
            YOU&apos;RE ON CALL.
          </p>

          <h1 className="text-[18vw] font-black leading-[0.78] tracking-[-0.075em] text-zinc-100 sm:text-[110px] lg:text-[150px]">
            PROD
            <br />
            <span className="text-zinc-500">
              IS DOWN.
            </span>
          </h1>

          <div className="mt-10 border-l border-red-800 pl-5">
            <p className="text-lg font-semibold tracking-tight md:text-2xl">
              THE ALERT FIRED.
              <br />
              FIND OUT WHY.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
              Investigate production telemetry,
              build a case from evidence and
              restore the system before customer
              impact grows.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={() =>
                startIncident("bad-deploy")
              }
            >
              TAKE THE INCIDENT
              <ArrowRight size={14} />
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                setView("library")
              }
            >
              INCIDENT LIBRARY
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-5">
            <button
              onClick={startDaily}
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-zinc-500 hover:text-zinc-200"
            >
              <CalendarClock size={13} />
              DAILY INCIDENT
            </button>

            <button
              onClick={startShift}
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-zinc-500 hover:text-zinc-200"
            >
              <Radio size={13} />
              ON-CALL SHIFT · 3 INCIDENTS
            </button>

            <button
              onClick={() => setView("how")}
              className="font-mono text-[10px] tracking-[0.15em] text-zinc-500 hover:text-zinc-200"
            >
              HOW IT WORKS
            </button>
          </div>

          {run && (
            <button
              onClick={() =>
                setView("incident")
              }
              className="mt-8 border border-amber-900/70 bg-amber-950/20 px-4 py-3 text-left"
            >
              <span className="block font-mono text-[10px] tracking-[0.18em] text-amber-400">
                INCIDENT IN PROGRESS
              </span>

              <span className="mt-1 block text-xs text-zinc-300">
                Resume the active simulated
                incident →
              </span>
            </button>
          )}
        </div>

        <footer className="mt-16 font-mono text-[10px] tracking-[0.18em] text-zinc-600">
          SIMULATED SYSTEMS · DETERMINISTIC
          INCIDENTS · NO RANDOM ANSWERS
        </footer>
      </section>
    </main>
  );
}
