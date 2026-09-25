import { ArrowLeft } from "lucide-react";
import { duration } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

export function History() {
  const history = useGameStore(
    (state) => state.history,
  );

  const setView = useGameStore(
    (state) => state.setView,
  );

  const startIncident = useGameStore(
    (state) => state.startIncident,
  );

  return (
    <main className="min-h-screen bg-[#090b0d] text-zinc-100">
      <header className="flex h-16 items-center border-b border-zinc-800 px-5 md:px-10">
        <button
          onClick={() =>
            setView("landing")
          }
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white"
        >
          <ArrowLeft size={14} />
          BACK
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 md:px-10">
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
          YOUR RUNS
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-[-0.05em]">
          INCIDENT
          <br />
          HISTORY.
        </h1>

        {history.length === 0 ? (
          <div className="mt-12 border border-dashed border-zinc-800 p-8 text-sm text-zinc-500">
            No resolved incidents yet.
          </div>
        ) : (
          <div className="mt-12 border-t border-zinc-800">
            {history.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 border-b border-zinc-800 py-5 md:grid-cols-[1fr_110px_130px_120px]"
              >
                <div>
                  <p className="text-sm font-semibold tracking-wide">
                    {item.scenarioTitle}
                  </p>

                  <p className="mt-1 font-mono text-[10px] text-zinc-600">
                    {new Date(
                      item.completedAt,
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-lg">
                    {item.score.toLocaleString()}
                  </p>

                  <p className="text-[9px] tracking-wider text-zinc-600">
                    SCORE
                  </p>
                </div>

                <div>
                  <p className="font-mono text-sm">
                    {duration(
                      item.recoveryTime,
                    )}
                  </p>

                  <p className="text-[9px] tracking-wider text-zinc-600">
                    RECOVERY
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() =>
                    startIncident(
                      item.scenarioId,
                    )
                  }
                >
                  REPLAY
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
