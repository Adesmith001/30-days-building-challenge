import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/store/use-game-store";

export function About() {
  const setView = useGameStore(
    (state) => state.setView,
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

      <section className="mx-auto max-w-5xl py-20">
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-600">
          ABOUT THE SIMULATION
        </p>

        <h1 className="mt-4 text-6xl font-black tracking-[-0.06em] md:text-8xl">
          THIS IS A
          <br />
          <span className="text-zinc-600">
            SIMULATION.
          </span>
        </h1>

        <div className="mt-16 grid gap-px border border-zinc-800 bg-zinc-800 md:grid-cols-2">
          {[
            [
              "DETERMINISTIC",
              "Every incident has a fixed hidden root cause and reproducible telemetry.",
            ],
            [
              "STATEFUL",
              "Your operational actions modify the simulated system.",
            ],
            [
              "EVIDENCE-BASED",
              "Metrics, logs, traces and system state form a discoverable case.",
            ],
            [
              "CONSEQUENTIAL",
              "Unsafe actions can make customer impact materially worse.",
            ],
            [
              "VERIFIABLE",
              "The system must visibly recover before the incident can close.",
            ],
            [
              "LOCAL",
              "Progress and incident history stay in your browser.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="bg-[#0c0e10] p-6"
            >
              <p className="font-mono text-xs tracking-wider text-zinc-300">
                {title}
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
