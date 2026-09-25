import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

const stages = [
  "OBSERVE",
  "HYPOTHESIZE",
  "MITIGATE",
  "VERIFY",
  "LEARN",
];

export function HowItWorks() {
  const setView = useGameStore(
    (state) => state.setView,
  );

  const startIncident = useGameStore(
    (state) => state.startIncident,
  );

  return (
    <main className="min-h-screen bg-[#090b0d] p-5 text-zinc-100 md:p-10">
      <button
        onClick={() => setView("landing")}
        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white"
      >
        <ArrowLeft size={14} />
        BACK
      </button>

      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center">
        <p className="font-mono text-xs tracking-[0.2em] text-zinc-600">
          INCIDENT RESPONSE 101
        </p>

        <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-[-0.05em] md:text-8xl">
          DON&apos;T GUESS.
          <br />
          <span className="text-zinc-600">
            FOLLOW THE EVIDENCE.
          </span>
        </h1>

        <div className="mt-16 grid gap-px border border-zinc-800 bg-zinc-800 md:grid-cols-5">
          {stages.map((stage, index) => (
            <div
              key={stage}
              className="bg-[#0c0e10] p-5"
            >
              <span className="font-mono text-[10px] text-zinc-600">
                0{index + 1}
              </span>

              <p className="mt-8 text-xs font-semibold tracking-[0.14em]">
                {stage}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            onClick={() =>
              startIncident("bad-deploy")
            }
          >
            PAGE ME
            <ArrowRight size={14} />
          </Button>
        </div>
      </section>
    </main>
  );
}
