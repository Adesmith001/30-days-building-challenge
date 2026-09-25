import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { duration } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/use-game-store";

export function RecoveryScreen() {
  const run = useGameStore(
    (state) => state.run,
  );

  const goRootCause = useGameStore(
    (state) => state.goRootCause,
  );

  if (!run) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090b] p-5 text-zinc-100">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-6xl"
      >
        <p className="font-mono text-xs tracking-[0.22em] text-emerald-500">
          INCIDENT STATE · STABLE
        </p>

        <h1 className="mt-5 text-[16vw] font-black leading-[0.78] tracking-[-0.07em] sm:text-[110px]">
          PROD
          <br />
          <span className="text-emerald-700">
            RECOVERED.
          </span>
        </h1>

        <div className="mt-14 grid gap-px border border-zinc-800 bg-zinc-800 md:grid-cols-4">
          <Stat
            label="TIME TO MITIGATION"
            value={duration(
              run.mitigationStartedAt ??
                run.simulatedTime,
            )}
          />

          <Stat
            label="TIME TO RECOVERY"
            value={duration(
              run.recoveryAt ??
                run.simulatedTime,
            )}
          />

          <Stat
            label="CUSTOMERS IMPACTED"
            value={run.impact.toLocaleString()}
          />

          <Stat
            label="ACTIONS TAKEN"
            value={String(
              run.actions.length,
            )}
          />
        </div>

        <Button
          className="mt-8"
          onClick={goRootCause}
        >
          IDENTIFY ROOT CAUSE
          <ArrowRight size={13} />
        </Button>
      </motion.section>
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
      <p className="font-mono text-[9px] tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-3 font-mono text-2xl">
        {value}
      </p>
    </div>
  );
}
