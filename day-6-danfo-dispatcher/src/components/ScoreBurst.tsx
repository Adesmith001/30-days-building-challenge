import { motion } from "motion/react";
import type { GameState } from "../types/game";

interface Props {
  state: GameState;
}

export function ScoreBurst({
  state,
}: Props) {
  const burst = state.burst;

  if (!burst) return null;

  if (state.now - burst.at > 2_000) {
    return null;
  }

  return (
    <motion.div
      key={burst.id}
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 15,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
      }}
      className="
        pointer-events-none absolute
        left-1/2 top-1/3 z-20
        -translate-x-1/2 text-center
      "
    >
      <div
        className="
          border-2 border-black
          bg-[#171717] px-5 py-2
          text-xs font-black
          tracking-[0.16em] text-white
        "
      >
        {burst.label}
      </div>

      {burst.points !== 0 && (
        <div
          className={`
            mt-1 border-2 border-black
            px-5 py-2 text-3xl font-black
            shadow-[4px_4px_0_#171717]
            ${
              burst.points > 0
                ? "bg-[#ffd000]"
                : "bg-red-600 text-white"
            }
          `}
        >
          {burst.points > 0 ? "+" : ""}
          {burst.points.toLocaleString()}
        </div>
      )}
    </motion.div>
  );
}