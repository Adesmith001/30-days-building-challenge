/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  GameFrame,
} from '../components/GameFrame'

import {
  ReactionResult,
} from '../components/ReactionResult'

import {
  waitDelay,
} from '../data/gameConfig'

import {
  useGameInput,
} from '../hooks/useGameInput'

import type {
  RoundInput,
  ScoredRound,
} from '../types/game'

type Direction =
  | 'left'
  | 'right'

type Props = {
  score: number
  combo: number

  onRound: (
    input: RoundInput,
  ) => ScoredRound

  onComplete: (
    clean: number,
  ) => void
}

export function ChoiceTest({
  score,
  combo,
  onRound,
  onComplete,
}: Props) {
  const [
    round,
    setRound,
  ] = useState(1)

  const [
    phase,
    setPhase,
  ] = useState<
    'wait' |
    'active' |
    'feedback'
  >('wait')

  const [
    direction,
    setDirection,
  ] =
    useState<Direction>('left')

  const [
    result,
    setResult,
  ] =
    useState<ScoredRound | null>(
      null,
    )

  const [
    clean,
    setClean,
  ] = useState(0)

  const timer =
    useRef<number | null>(
      null,
    )

  const startedAt =
    useRef(0)

  const arm =
    useCallback(() => {
      setPhase('wait')
      setResult(null)

      timer.current =
        window.setTimeout(
          () => {
            setDirection(
              Math.random() > 0.5
                ? 'left'
                : 'right',
            )

            startedAt.current =
              performance.now()

            setPhase('active')
          },
          waitDelay(),
        )
    }, [])

  useEffect(() => {
    arm()

    return () => {
      if (timer.current) {
        window.clearTimeout(
          timer.current,
        )
      }
    }
  }, [arm])

  const choose =
    useCallback(
      (
        choice: Direction,
      ) => {
        if (
          phase === 'feedback'
        ) {
          return
        }

        if (timer.current) {
          window.clearTimeout(
            timer.current,
          )
        }

        if (phase === 'wait') {
          const scored =
            onRound({
              mode: 'choice',
              valid: false,
              falseStart: true,
              reason:
                'false-start',
            })

          setResult(scored)
          setPhase('feedback')

          timer.current =
            window.setTimeout(
              arm,
              900,
            )

          return
        }

        const correct =
          choice === direction

        const scored =
          onRound({
            mode: 'choice',

            reactionMs:
              performance.now() -
              startedAt.current,

            valid: correct,
            correct,

            reason: correct
              ? undefined
              : 'wrong-choice',
          })

        const nextClean =
          clean +
          (correct ? 1 : 0)

        setClean(nextClean)
        setResult(scored)
        setPhase('feedback')

        timer.current =
          window.setTimeout(
            () => {
              if (round === 5) {
                onComplete(
                  nextClean,
                )

                return
              }

              setRound(
                (value) =>
                  value + 1,
              )

              arm()
            },
            1000,
          )
      },
      [
        arm,
        clean,
        direction,
        onComplete,
        onRound,
        phase,
        round,
      ],
    )

  useGameInput(
    (key) => {
      if (
        key === 'ArrowLeft'
      ) {
        choose('left')
      }

      if (
        key === 'ArrowRight'
      ) {
        choose('right')
      }
    },
  )

  return (
    <GameFrame
      mode="choice"
      round={round}
      score={score}
      combo={combo}
    >
      <div
        className="
          w-full
          text-center
        "
      >
        {phase === 'wait' && (
          <>
            <h1
              className="
                font-mono
                text-7xl
                font-black
                md:text-8xl
              "
            >
              READY?
            </h1>

            <p
              className="
                mt-4
                text-lg
                text-[#4f5344]
              "
            >
              No overthink am.
            </p>
          </>
        )}

        {phase ===
          'active' && (
          <h1
            className="
              text-[9rem]
              font-black
              leading-none
              md:text-[13rem]
            "
          >
            {direction ===
            'left'
              ? '←'
              : '→'}
          </h1>
        )}

        {phase ===
          'feedback' &&
          result && (
            <ReactionResult
              result={result}
            />
          )}

        {phase !==
          'feedback' && (
          <div
            className="
              mx-auto
              mt-16
              grid
              max-w-md
              grid-cols-2
              gap-4
            "
          >
            <button
              onPointerDown={() =>
                choose('left')
              }
              className="
                border
                border-[#9f9f8f]
                py-5
                font-mono
                text-xl
                hover:bg-[#e9e6dc]
              "
            >
              ← LEFT
            </button>

            <button
              onPointerDown={() =>
                choose('right')
              }
              className="
                border
                border-[#9f9f8f]
                py-5
                font-mono
                text-xl
                hover:bg-[#e9e6dc]
              "
            >
              RIGHT →
            </button>
          </div>
        )}
      </div>
    </GameFrame>
  )
}