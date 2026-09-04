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

import {
  beep,
} from '../lib/audio'

import type {
  RoundInput,
  ScoredRound,
} from '../types/game'

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

export function AudioTest({
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
            startedAt.current =
              performance.now()

            beep()

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

  const handleInput =
    useCallback(() => {
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
            mode: 'audio',
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

      const reactionMs =
        performance.now() -
        startedAt.current

      const scored =
        onRound({
          mode: 'audio',
          reactionMs,
          valid: true,
          correct: true,
        })

      const nextClean =
        clean + 1

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
    }, [
      arm,
      clean,
      onComplete,
      onRound,
      phase,
      round,
    ])

  useGameInput(
    (key) => {
      if (
        key === ' ' ||
        key === 'Enter'
      ) {
        handleInput()
      }
    },
  )

  return (
    <GameFrame
      mode="audio"
      round={round}
      score={score}
      combo={combo}
      onPointerDown={
        handleInput
      }
    >
      {phase === 'wait' && (
        <div className="text-center">
          <h1
            className="
              font-mono
              text-6xl
              font-black
              md:text-8xl
            "
          >
            YOU HEAR AM?
          </h1>

          <p
            className="
              mt-5
              text-lg
              text-[#4f5344]
            "
          >
            No visual clue.
            Wait for the tone.
          </p>
        </div>
      )}

      {phase ===
        'active' && (
        <div className="text-center">
          <div
            className="
              mx-auto
              h-16 w-16
              animate-pulse
              rounded-full
              border
              border-[#8a8d78]
            "
          />

          <p
            className="
              mt-6
              font-mono
              text-xs
              tracking-[0.18em]
            "
          >
            SIGNAL_TRANSMITTED
          </p>
        </div>
      )}

      {phase ===
        'feedback' &&
        result && (
          <ReactionResult
            result={result}
          />
        )}
    </GameFrame>
  )
}