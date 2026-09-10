import { motion } from "motion/react";

import type {
  ImageAsset,
} from "../types/ui-anaylsis";

const PHASES = [
  "READING STRUCTURE",
  "SAMPLING COLORS",
  "FINDING TYPE",
  "GROUPING COMPONENTS",
  "BUILDING TOKENS",
];

interface Props {
  asset: ImageAsset;
  step: number;
}

export function ProcessingState({
  asset,
  step,
}: Props) {
  const active = Math.min(step, 4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center overflow-hidden border border-line bg-panel">
          <img
            src={asset.previewUrl}
            alt={asset.name}
            className="max-h-full max-w-full object-contain opacity-35 grayscale-[25%]"
          />

          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 h-px w-full bg-accent"
          />

          <div className="absolute bottom-4 left-4 bg-ink px-3 py-2 font-mono text-[10px] text-white">
            {String(active + 1).padStart(2, "0")} / 05
            <span className="ml-3 text-white/65">
              {PHASES[active]}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-1">
          {PHASES.map((phase, index) => (
            <div
              key={phase}
              className="flex-1"
            >
              <div
                className={[
                  "h-0.5",
                  index <= active
                    ? "bg-accent"
                    : "bg-line",
                ].join(" ")}
              />

              <div className="mt-1 hidden font-mono text-[8px] text-muted md:block">
                {phase}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}