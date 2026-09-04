import {
  useMemo,
  useRef,
} from 'react'

import {
  toPng,
} from 'html-to-image'

import {
  MODE_META,
} from '../data/gameConfig'

import {
  consistencyScore,
  getRank,
  median,
  modeSummaries,
  performanceInsight,
  reflexProfile,
} from '../lib/statistics'

import type {
  PersonalBests,
  ScoredRound,
  SessionKind,
} from '../types/game'

type Props = {
  rounds: ScoredRound[]
  total: number
  kind: SessionKind
  newPb: boolean
  bests: PersonalBests
  onReplay: () => void
  onMenu: () => void
}

export function ResultsScreen({
  rounds,
  total,
  kind,
  newPb,
  bests,
  onReplay,
  onMenu,
}: Props) {
  const cardRef =
    useRef<HTMLDivElement>(
      null,
    )

  const valid =
    rounds.filter(
      (round) =>
        round.valid &&
        round.reactionMs !==
          undefined,
    )

  const fastest =
    valid.length
      ? Math.round(
          Math.min(
            ...valid.map(
              (round) =>
                round.reactionMs!,
            ),
          ),
        )
      : 0

  const med =
    median(
      valid.map(
        (round) =>
          round.reactionMs!,
      ),
    ) ?? 0

  const consistency =
    consistencyScore(rounds)

  const summaries =
    modeSummaries(rounds)
      .filter((item) => {
        return rounds.some(
          (round) =>
            round.mode ===
            item.mode,
        )
      })

  const profile =
    reflexProfile(rounds)

  const rank =
    getRank(total)

  const insight =
    performanceInsight(rounds)

  const bestCombo =
    Math.max(
      1,
      ...rounds.map(
        (round) =>
          round.comboCount,
      ),
    )

  const faults =
    rounds.filter(
      (round) =>
        !round.valid ||
        round.correct === false,
    ).length

  const secretRank =
    total >= 9000 &&
    faults === 0 &&
    fastest > 0 &&
    fastest < 170

  const displayRank =
    secretRank
      ? 'CONFIRMED NIGERIAN'
      : rank

  const replayLabel =
    useMemo(() => {
      if (newPb) {
        return 'PROVE SAY NO BE LUCK →'
      }

      if (total < 4500) {
        return 'RUN AM BACK →'
      }

      if (total >= 9000) {
        return 'YOU FIT BEAT AM AGAIN? →'
      }

      return 'CHASE YOUR PB →'
    }, [
      newPb,
      total,
    ])

  async function saveCard() {
    if (!cardRef.current) {
      return
    }

    const dataUrl =
      await toPng(
        cardRef.current,
        {
          pixelRatio: 2,
          backgroundColor:
            '#f4f1eb',
        },
      )

    const link =
      document.createElement(
        'a',
      )

    link.download =
      `reflex-lab-${total}.png`

    link.href = dataUrl

    link.click()
  }

  async function shareCard() {
    const text =
      `I scored ${total.toLocaleString()} ` +
      `in Reflex Lab — ${displayRank}. ` +
      `You fit beat am?`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Reflex Lab',
          text,
        })

        return
      }

      await navigator.clipboard
        .writeText(text)
    } catch {
      // Sharing was cancelled.
    }
  }

  const statCards = [
    [
      'FASTEST',
      `${fastest}MS`,
    ],

    [
      'MEDIAN',
      `${med}MS`,
    ],

    [
      'CONSISTENCY',
      `${consistency}%`,
    ],

    [
      'BEST COMBO',
      `×${bestCombo}`,
    ],

    [
      'FAULTS',
      String(faults),
    ],
  ]

  return (
    <main
      className="
        min-h-screen
        bg-[#f4f1eb]
        px-6 py-12
        text-[#171717]
        md:px-10
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        <div
          className="
            font-mono
            text-xs
            font-semibold
            tracking-[0.18em]
            text-[#687b1a]
          "
        >
          ■ SESSION_COMPLETE
          {' // '}
          NAIJA_PROTOCOL
        </div>

        <div
          className="
            mt-7
            grid
            gap-10
            lg:grid-cols-[1.1fr_.9fr]
          "
        >
          <section>
            {newPb && (
              <div
                className="
                  mb-4
                  inline-block
                  bg-[#c8ff00]
                  px-3 py-1
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.14em]
                "
              >
                NEW PERSONAL BEST
              </div>
            )}

            <div
              className="
                font-mono
                text-xs
                tracking-[0.18em]
                text-[#737665]
              "
            >
              {kind === 'full'
                ? 'REFLEX SCORE'
                : 'QUICK SCORE'}
            </div>

            <h1
              className="
                mt-2
                text-7xl
                font-black
                tracking-[-0.07em]
                md:text-9xl
              "
            >
              {total.toLocaleString()}
            </h1>

            <h2
              className="
                mt-4
                text-3xl
                font-black
                uppercase
                tracking-tight
                md:text-5xl
              "
            >
              {displayRank}
            </h2>

            {secretRank && (
              <div
                className="
                  mt-2
                  font-mono
                  text-xs
                  tracking-[0.16em]
                  text-[#687b1a]
                "
              >
                SPECIAL
                CLASSIFICATION
              </div>
            )}

            <p
              className="
                mt-6
                max-w-2xl
                text-xl
                text-[#4d5142]
              "
            >
              {insight}
            </p>

            <div
              className="
                mt-10
                grid
                grid-cols-2
                gap-px
                border
                border-[#cbc8b8]
                bg-[#cbc8b8]
                sm:grid-cols-5
              "
            >
              {statCards.map(
                ([
                  label,
                  value,
                ]) => (
                  <div
                    key={label}
                    className="
                      bg-[#f4f1eb]
                      p-5
                    "
                  >
                    <div
                      className="
                        font-mono
                        text-[9px]
                        tracking-[0.15em]
                        text-[#7a7c69]
                      "
                    >
                      {label}
                    </div>

                    <div
                      className="
                        mt-2
                        font-mono
                        text-lg
                        font-bold
                      "
                    >
                      {value}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div
              className="
                mt-10
                space-y-3
              "
            >
              {summaries.map(
                (item) => (
                  <div
                    key={item.mode}
                    className="
                      grid
                      grid-cols-[1fr_auto_auto]
                      items-center
                      gap-5
                      border-b
                      border-[#d4d1c0]
                      py-4
                    "
                  >
                    <div>
                      <div
                        className="
                          font-black
                        "
                      >
                        {
                          MODE_META[
                            item.mode
                          ].title
                        }
                      </div>

                      <div
                        className="
                          font-mono
                          text-[10px]
                          tracking-[0.14em]
                          text-[#7a7c69]
                        "
                      >
                        {item.mode.toUpperCase()}
                      </div>
                    </div>

                    <div
                      className="
                        font-mono
                        text-sm
                      "
                    >
                      {item.median
                        ? `${item.median}MS`
                        : '—'}
                    </div>

                    <div
                      className="
                        w-24
                        text-right
                        font-mono
                        text-sm
                      "
                    >
                      {item.points
                        .toLocaleString()}
                      {' PTS'}
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          <aside>
            <div
              ref={cardRef}
              className="
                border
                border-[#bbb9a8]
                bg-[#f4f1eb]
                p-8
                md:p-10
              "
            >
              <div
                className="
                  flex
                  justify-between
                  font-mono
                  text-[10px]
                  tracking-[0.16em]
                "
              >
                <span>
                  REFLEX LAB
                </span>

                <span>
                  DAY 04 / 30
                </span>
              </div>

              <div
                className="
                  mt-14
                  font-mono
                  text-[10px]
                  tracking-[0.2em]
                  text-[#6b6e5d]
                "
              >
                NAIJA PROTOCOL
              </div>

              <div
                className="
                  mt-3
                  text-6xl
                  font-black
                  tracking-[-0.06em]
                "
              >
                {total.toLocaleString()}
              </div>

              <div
                className="
                  mt-2
                  text-2xl
                  font-black
                  uppercase
                "
              >
                {displayRank}
              </div>

              <div
                className="
                  mt-10
                  space-y-3
                  border-y
                  border-[#d5d2c0]
                  py-5
                  font-mono
                  text-xs
                "
              >
                <div
                  className="
                    flex
                    justify-between
                  "
                >
                  <span>
                    FASTEST
                  </span>

                  <span>
                    {fastest}MS
                  </span>
                </div>

                <div
                  className="
                    flex
                    justify-between
                  "
                >
                  <span>
                    MEDIAN
                  </span>

                  <span>
                    {med}MS
                  </span>
                </div>

                <div
                  className="
                    flex
                    justify-between
                  "
                >
                  <span>
                    BEST COMBO
                  </span>

                  <span>
                    ×{bestCombo}
                  </span>
                </div>
              </div>

              <div
                className="
                  mt-10
                  text-2xl
                  font-black
                "
              >
                YOU FIT BEAT AM?
              </div>
            </div>

            <div
              className="
                mt-8
                border
                border-[#cbc8b8]
                p-6
              "
            >
              <div
                className="
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.15em]
                "
              >
                REFLEX PROFILE
              </div>

              {Object.entries(
                profile,
              ).map(
                ([
                  label,
                  value,
                ]) => (
                  <div
                    key={label}
                    className="mt-5"
                  >
                    <div
                      className="
                        mb-2
                        flex
                        justify-between
                        font-mono
                        text-[10px]
                        tracking-[0.13em]
                      "
                    >
                      <span>
                        {label.toUpperCase()}
                      </span>

                      <span>
                        {value}
                      </span>
                    </div>

                    <div
                      className="
                        h-2
                        bg-[#ddd9ca]
                      "
                    >
                      <div
                        className="
                          h-full
                          bg-[#171717]
                        "
                        style={{
                          width:
                            `${value}%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              <button
                onClick={
                  shareCard
                }
                className="
                  border
                  border-[#171717]
                  px-5 py-4
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.12em]
                "
              >
                SHARE SCORE
              </button>

              <button
                onClick={
                  saveCard
                }
                className="
                  border
                  border-[#171717]
                  px-5 py-4
                  font-mono
                  text-xs
                  font-bold
                  tracking-[0.12em]
                "
              >
                SAVE RESULT
              </button>
            </div>

            <button
              onClick={onReplay}
              className="
                mt-3
                w-full
                bg-[#171717]
                px-6 py-5
                font-mono
                text-xs
                font-bold
                tracking-[0.12em]
                text-white
              "
            >
              {replayLabel}
            </button>

            <button
              onClick={onMenu}
              className="
                mt-3
                w-full
                px-6 py-4
                font-mono
                text-xs
                font-bold
                tracking-[0.12em]
                text-[#626654]
              "
            >
              BACK TO LAB
            </button>

            <p
              className="
                mt-4
                text-center
                font-mono
                text-[9px]
                tracking-[0.12em]
                text-[#8a8c7a]
              "
            >
              PB{' '}
              {bests.bestTotal
                .toLocaleString()}
              {' · '}
              SESSIONS{' '}
              {bests.sessionsPlayed}
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}