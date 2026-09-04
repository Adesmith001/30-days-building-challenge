import {
  MODE_META,
} from '../data/gameConfig'

import type {
  Mode,
  SessionKind,
} from '../types/game'

type Props = {
  mode: Mode
  points: number
  clean: number
  bonus: number
  kind: SessionKind
  onContinue: () => void
}

export function ModeComplete({
  mode,
  points,
  clean,
  bonus,
  kind,
  onContinue,
}: Props) {
  const item =
    MODE_META[mode]

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#f4f1eb]
        px-6
        text-center
      "
    >
      <div
        className="
          w-full
          max-w-xl
          border
          border-[#c9c7b5]
          p-8
          md:p-12
        "
      >
        <div
          className="
            font-mono
            text-xs
            tracking-[0.18em]
            text-[#6b6e5d]
          "
        >
          {item.technical}
          {' // COMPLETE'}
        </div>

        <h1
          className="
            mt-6
            text-5xl
            font-black
            uppercase
            tracking-[-0.05em]
          "
        >
          {item.title}
        </h1>

        <div
          className="
            mt-8
            grid
            grid-cols-2
            border-y
            border-[#d6d2c0]
            py-6
            font-mono
            text-sm
          "
        >
          <div>
            <span
              className="
                block
                text-[10px]
                tracking-[0.14em]
                text-[#777a68]
              "
            >
              CLEAN
            </span>

            {clean}/5
          </div>

          <div>
            <span
              className="
                block
                text-[10px]
                tracking-[0.14em]
                text-[#777a68]
              "
            >
              POINTS
            </span>

            {(points +
              bonus
            ).toLocaleString()}
          </div>
        </div>

        {bonus > 0 && (
          <div className="mt-6">
            <div
              className="
                text-2xl
                font-black
              "
            >
              CLEAN SWEEP
            </div>

            <div
              className="
                mt-1
                font-mono
                text-sm
                text-[#687b1a]
              "
            >
              +300 · NO MISTAKES.
              CORRECT PERSON.
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          className="
            mt-10
            w-full
            bg-[#171717]
            px-8 py-5
            font-mono
            text-sm
            font-bold
            tracking-[0.14em]
            text-white
            hover:bg-black
          "
        >
          {kind === 'full'
            ? 'NEXT TEST →'
            : 'SEE RESULT →'}
        </button>
      </div>
    </main>
  )
}