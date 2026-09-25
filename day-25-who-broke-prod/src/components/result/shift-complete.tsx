import { useGameStore } from "@/store/use-game-store";
import { Button } from "@/components/ui/button";

export function ShiftComplete() {
  const completed = useGameStore(
    (state) => state.completedShift,
  );

  const setView = useGameStore(
    (state) => state.setView,
  );

  if (!completed) {
    return null;
  }

  const total = completed.scores.reduce(
    (sum, score) => sum + score,
    0,
  );

  const average = Math.round(
    total /
      Math.max(
        1,
        completed.scores.length,
      ),
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b0d] p-5 text-zinc-100">
      <section className="w-full max-w-5xl">
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
          ON-CALL SHIFT
        </p>

        <h1 className="mt-4 text-7xl font-black leading-[0.82] tracking-[-0.06em] md:text-9xl">
          SHIFT
          <br />
          <span className="text-zinc-600">
            COMPLETE.
          </span>
        </h1>

        <div className="mt-12 grid gap-px border border-zinc-800 bg-zinc-800 md:grid-cols-3">
          <Stat
            label="INCIDENTS"
            value={`${completed.scores.length} / ${completed.ids.length}`}
          />

          <Stat
            label="COMBINED SCORE"
            value={total.toLocaleString()}
          />

          <Stat
            label="AVERAGE SCORE"
            value={average.toLocaleString()}
          />
        </div>

        <Button
          className="mt-8"
          onClick={() =>
            setView("landing")
          }
        >
          END SHIFT →
        </Button>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#090b0d] p-5">
      <p className="font-mono text-[9px] text-zinc-600">
        {label}
      </p>

      <p className="mt-3 font-mono text-2xl">
        {value}
      </p>
    </div>
  );
}
