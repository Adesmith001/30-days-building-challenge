import {
  motion,
} from 'framer-motion'

import {
  comboCopy,
} from '../data/copy'

import type {
  ScoredRound,
} from '../types/game'

type Props = {
  result: ScoredRound
}

export function ReactionResult({
  result,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="text-center"
    >
      {result.reactionMs !==
        undefined && (
        <div
          className="
            font-mono
            text-6xl
            font-black
            tracking-[-0.06em]
            md:text-8xl
          "
        >
          {Math.round(
            result.reactionMs,
          )}
          MS
        </div>
      )}

      <div
        className="
          mt-5
          text-2xl
          font-black
          uppercase
          tracking-tight
          md:text-3xl
        "
      >
        {result.achievement ??
          result.label}
      </div>

      <div
        className="
          mt-2
          text-lg
          text-[#4f5344]
        "
      >
        {result.flavor}
      </div>

      <div
        className="
          mt-6
          font-mono
          text-lg
          font-bold
        "
      >
        +
        {result.points.toLocaleString()}
      </div>

      {result.comboCount > 1 && (
        <div
          className="
            mt-2
            font-mono
            text-xs
            tracking-[0.18em]
            text-[#687b1a]
          "
        >
          COMBO ×
          {result.comboCount}
          {' · '}
          {result.comboMultiplier}
          × POINTS
        </div>
      )}

      {result.comboCount >= 3 && (
        <div
          className="
            mt-2
            font-mono
            text-[10px]
            font-bold
            tracking-[0.16em]
          "
        >
          {comboCopy(
            result.comboCount,
          )}
        </div>
      )}

      {!result.valid && (
        <div
          className="
            mt-2
            font-mono
            text-[10px]
            tracking-[0.16em]
            text-[#bd360f]
          "
        >
          COMBO LOST
        </div>
      )}

      {result.deltaVsPb !==
        undefined && (
        <div
          className="
            mt-4
            font-mono
            text-[11px]
            tracking-[0.15em]
            text-[#777a68]
          "
        >
          {result.deltaVsPb < 0
            ? `${result.deltaVsPb}MS VS PB · NEW BEST PACE`
            : `+${result.deltaVsPb}MS VS PB`}
        </div>
      )}
    </motion.div>
  )
}