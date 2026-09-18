import {
  motion,
} from "motion/react";

import {
  formatTime,
} from "../lib/scoring";

import type {
  RoundResult,
} from "../types/game";

export function ScoreMoment({
  result,
}: {
  result: RoundResult;
}) {
  const title =
    result.perfect
      ? "PERFECT ORDER."
      : result.nearMiss
        ? "ONE SWAP AWAY."
        : `${
            result.exactPositions
          } / 4 EXACT`;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className={`
        rounded-2xl
        border
        p-4
        text-center
        ${
          result.perfect
            ? `
              border-emerald-500/50
              bg-emerald-500/10
            `
            : `
              border-amber-500/40
              bg-amber-500/10
            `
        }
      `}
    >
      <span
        className="
          font-display
          text-xl
          font-bold
        "
      >
        {title}
      </span>

      <div
        className="
          mt-2
          flex
          items-center
          justify-center
          gap-4
          text-sm
          text-slate-300
        "
      >
        <strong
          className="
            font-display
            text-gold
          "
        >
          +
          {
            result.points
              .toLocaleString()
          }
        </strong>

        <span>
          {formatTime(
            result.durationMs,
          )}
        </span>

        {result.hintUsed && (
          <span>
            HINT USED
          </span>
        )}
      </div>
    </motion.div>
  );
}