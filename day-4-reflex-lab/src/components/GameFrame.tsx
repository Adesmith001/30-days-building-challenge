import type {
  ReactNode,
} from 'react'

import type {
  Mode,
} from '../types/game'

import {
  GameHUD,
} from './GameHUD'

type Props = {
  mode: Mode
  round: number
  score: number
  combo: number
  children: ReactNode
  active?: boolean
  onPointerDown?: () => void
}

export function GameFrame({
  mode,
  round,
  score,
  combo,
  children,
  active = false,
  onPointerDown,
}: Props) {
  return (
    <main
      onPointerDown={onPointerDown}
      className={`
        relative
        min-h-screen
        overflow-hidden
        select-none
        transition-colors
        duration-75

        ${
          active
            ? 'bg-[#c8ff00]'
            : 'bg-[#f4f1eb]'
        }
      `}
    >
      <GameHUD
        mode={mode}
        round={round}
        score={score}
        combo={combo}
      />

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          pt-20
        "
      >
        {children}
      </div>

      <div
        className="
          pointer-events-none
          absolute
          bottom-7
          left-6
          font-mono
          text-[10px]
          tracking-[0.14em]
          text-[#666a59]
          md:left-8
        "
      >
        CHAMBER_CALIBRATION
        <br />
        POLLING_RATE: 1000HZ ·
        JITTER: &lt;0.04MS
      </div>

      <div
        className="
          pointer-events-none
          absolute
          bottom-7
          right-6
          text-right
          font-mono
          text-[10px]
          tracking-[0.14em]
          text-[#666a59]
          md:right-8
        "
      >
        NAIJA_PROTOCOL
        <br />
        SUBJECT_STATUS: SHARP
      </div>
    </main>
  )
}