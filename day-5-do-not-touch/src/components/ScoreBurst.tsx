import { AnimatePresence, motion } from "motion/react";
import type { ScoreBurstData } from "../types/game";

interface Props {
  burst: ScoreBurstData | null;
}

export function ScoreBurst({ burst }: Props) {
  return (
    <AnimatePresence>
      {burst && (
        <motion.div
          key={burst.id}
          initial={{
            opacity: 0,
            y: 6,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: -26,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -42,
          }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute z-40 -translate-x-1/2 text-center font-mono"
          style={{
            left: burst.x,
            top: burst.y - 42,
          }}
        >
          <div className="text-[18px] font-bold text-[#1248ff]">
            +{burst.points}
          </div>

          <div className="mt-1 text-[9px] tracking-[0.14em] text-[#62687a]">
            {burst.label}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}