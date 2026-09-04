import {
  motion,
} from 'framer-motion'

import {
  MODE_META,
  MODES,
} from '../data/gameConfig'

import type {
  Mode,
} from '../types/game'

import {
  LabHeader,
} from './LabHeader'

type Props = {
  onFull: () => void
  onQuick: (mode: Mode) => void
}

export function ModeSelect({
  onFull,
  onQuick,
}: Props) {
  return (
    <main
      className="
        min-h-screen
        bg-[#f4f1eb]
        text-[#171717]
      "
    >
      <LabHeader calibrated />

      <section
        className="
          mx-auto
          max-w-[1500px]
          px-6 py-16
          md:px-10
        "
      >
        <div className="mb-14">
          <div
            className="
              flex
              items-center
              gap-3
              font-mono
              text-xs
              font-semibold
              tracking-[0.14em]
              text-[#777a68]
            "
          >
            <span
              className="
                bg-[#c8ff00]
                px-3 py-1
                text-[#111]
              "
            >
              STAGE 02
            </span>

            BATTERY SPECIFICATION
          </div>

          <h2
            className="
              mt-5
              text-4xl
              font-black
              uppercase
              tracking-[-0.045em]
              md:text-5xl
            "
          >
            Four ways to
            test your reflexes
          </h2>

          <p
            className="
              mt-3
              max-w-3xl
              text-[#55594a]
            "
          >
            New here? Start with the full battery below
            to experience every test. You can still jump
            straight into any mode above.
          </p>
        </div>

        <div
          className="
            grid
            border
            border-[#c9c7b5]
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {MODES.map(
            (mode, index) => {
              const item =
                MODE_META[mode]

              return (
                <motion.article
                  key={mode}
                  role="button"
                  tabIndex={0}
                  onClick={() => onQuick(mode)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onQuick(mode)
                    }
                  }}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.06,
                  }}
                  className="
                    flex
                    min-h-[390px]
                    flex-col
                    border-b
                    border-[#c9c7b5]
                    p-8
                    last:border-b-0
                    md:border-r
                    md:[&:nth-child(2)]:border-r-0
                    xl:border-b-0
                    xl:[&:nth-child(2)]:border-r
                    xl:last:border-r-0
                    cursor-pointer
                    transition-colors
                    hover:bg-[#eeece6]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-[-2px]
                  "
                  style={{
                    borderTop:
                      index === 0
                        ? `5px solid ${item.color}`
                        : undefined,
                  }}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      font-mono
                      text-xs
                      font-semibold
                      tracking-[0.12em]
                      text-[#505444]
                    "
                  >
                    <span>
                      {item.index}
                      {' — '}
                      {mode.toUpperCase()}
                    </span>

                    {index === 0 && (
                      <span
                        className="
                          bg-[#c8ff00]
                          px-2 py-1
                          text-black
                        "
                      >
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <div
                    className="
                      mt-8
                      flex
                      items-center
                      gap-3
                      font-mono
                      text-xs
                      tracking-[0.12em]
                      text-[#7a7c69]
                    "
                  >
                    <span
                      className="
                        h-3 w-3
                      "
                      style={{
                        background:
                          item.color,
                      }}
                    />

                    {item.technical}
                  </div>

                  <div className="mt-10">
                    <h3
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        font-semibold
                        text-[#404437]
                      "
                    >
                      {item.subtitle}
                    </p>

                    <p
                      className="
                        mt-4
                        leading-7
                        text-[#5a5d4e]
                      "
                    >
                      {item.description}
                    </p>

                    <p
                      className="
                        mt-4
                        border-l-2
                        pl-3
                        font-mono
                        text-xs
                        leading-5
                        text-[#687b1a]
                      "
                      style={{
                        borderColor: item.color,
                      }}
                    >
                      {item.challenge}
                    </p>
                  </div>

                  <div
                    className="
                      mt-auto
                      border-t
                      border-[#d7d3c0]
                      pt-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-end
                        justify-between
                        gap-4
                      "
                    >
                      <div>
                        <div
                          className="
                            font-mono
                            text-[10px]
                            tracking-[0.15em]
                            text-[#858773]
                          "
                        >
                          EXPECTED_RANGE
                        </div>

                        <div
                          className="
                            mt-1
                            font-mono
                            text-sm
                          "
                        >
                          {item.expected}
                        </div>
                      </div>

                      <span
                        className="
                          font-mono
                          text-[10px]
                          font-bold
                          tracking-[0.14em]
                          text-[#858773]
                        "
                      >
                        {item.difficulty}
                      </span>

                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          onQuick(mode)
                        }}
                        onPointerDown={(event) =>
                          event.stopPropagation()
                        }
                        className="
                          font-mono
                          text-xs
                          font-bold
                          tracking-[0.14em]
                          text-[#687b1a]
                          hover:text-black
                        "
                      >
                        SELECT
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            },
          )}
        </div>

        <div className="mt-8">
          <div
            className="
              mb-3
              flex
              items-center
              justify-center
              gap-3
              font-mono
              text-[10px]
              font-bold
              tracking-[0.16em]
              text-[#687b1a]
            "
          >
            <span className="h-px w-10 bg-[#687b1a]" />
            START HERE
            <span className="h-px w-10 bg-[#687b1a]" />
          </div>

          <button
            onClick={onFull}
            className="
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
            RUN FULL BATTERY →
          </button>
        </div>
      </section>
    </main>
  )
}