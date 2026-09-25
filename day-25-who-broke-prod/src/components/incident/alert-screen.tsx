import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { getScenario } from "@/data/incidents";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

function pagerTone() {
  try {
    const Context =
      window.AudioContext ??
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!Context) return;

    const context = new Context();
    const oscillator =
      context.createOscillator();
    const gain = context.createGain();

    oscillator.frequency.value = 690;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(
      0.04,
      context.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.16,
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + 0.16,
    );
  } catch {
    // Sound is enhancement only.
  }
}

export function AlertScreen() {
  const run = useGameStore(
    (state) => state.run,
  );

  const acknowledge = useGameStore(
    (state) => state.acknowledge,
  );

  if (!run) return null;

  const scenario = getScenario(
    run.scenarioId,
  );

  function handleAcknowledge() {
    pagerTone();
    acknowledge();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090b] p-5 text-zinc-100">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl border border-zinc-800 bg-[#0b0d0f]"
      >
        <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <span className="font-mono text-xs tracking-[0.2em] text-zinc-500">
            PAGER
          </span>

          <span className="font-mono text-[10px] text-zinc-600">
            INCIDENT #{scenario.number}
          </span>
        </header>

        <div className="grid md:grid-cols-[1.25fr_.75fr]">
          <div className="border-b border-zinc-800 p-6 md:border-b-0 md:border-r md:p-10">
            <span className="font-mono text-sm tracking-[0.16em] text-red-400">
              {scenario.severity}
            </span>

            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
              {scenario.alert.title}
            </h1>

            <p className="mt-10 text-xs font-semibold tracking-[0.14em] text-zinc-500">
              {scenario.alert.customerText}
            </p>
          </div>

          <div className="p-6 md:p-10">
            <p className="font-mono text-[10px] tracking-[0.16em] text-zinc-600">
              {scenario.alert.metric}
            </p>

            <p className="mt-2 font-mono text-5xl tracking-tight">
              {scenario.alert.current}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px bg-zinc-800">
              {[
                [
                  "BASELINE",
                  scenario.alert.baseline,
                ],
                [
                  "STARTED",
                  scenario.alert.startedAgo,
                ],
                [
                  "AFFECTED",
                  scenario.alert.affected,
                ],
                [
                  "REGION",
                  scenario.alert.region,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-[#0b0d0f] p-4"
                >
                  <p className="font-mono text-[9px] text-zinc-600">
                    {label}
                  </p>

                  <p className="mt-2 text-xs font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleAcknowledge}
              className="mt-8 w-full justify-between"
            >
              ACKNOWLEDGE
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
