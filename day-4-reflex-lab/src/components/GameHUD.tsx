import type {
  Mode,
} from '../types/game'

type Props = {
  mode: Mode
  round: number
  score: number
  combo: number
}

export function GameHUD({
  mode,
  round,
  score,
  combo,
}: Props) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-x-0
        top-0
        z-20
        flex
        items-center
        justify-between
        border-b
        border-[#d9d6c7]
        bg-[#f4f1eb]/95
        px-6 py-4
        font-mono
        text-xs
        font-semibold
        tracking-[0.12em]
        text-[#272a22]
        md:px-8
      "
    >
      <div>
        <span
          className="
            mr-2
            text-[#5f7f00]
          "
        >
          ■
        </span>

        {mode.toUpperCase()}
        {' · '}
        {String(round).padStart(
          2,
          '0',
        )}
        {' / 05'}
      </div>

      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2
          border
          border-[#cbc8b9]
          px-5 py-2
          text-center
        "
      >
        <div
          className="
            text-[9px]
            tracking-[0.18em]
            text-[#717463]
          "
        >
          SCORE
        </div>

        <div
          className="
            text-sm
            text-[#111]
          "
        >
          {score.toLocaleString()}
        </div>
      </div>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <span
          className="
            hidden
            text-[#777a68]
            sm:inline
          "
        >
          ■ SYNC_OK
        </span>

        <span>
          COMBO ×
          {Math.max(combo, 1)}
        </span>
      </div>
    </div>
  )
}