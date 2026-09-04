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
  nextVariantIndex,
  VISUAL_VARIANTS,
  waitDelay,
} from '../data/gameConfig'

import {
  useGameInput,
} from '../hooks/useGameInput'

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

export function VisualTest({
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

  const [
    variantIndex,
    setVariantIndex,
  ] = useState(0)

  const variantRef = useRef(0)

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

      const nextVariant = nextVariantIndex(
        VISUAL_VARIANTS.length,
        variantRef.current,
      )

      variantRef.current = nextVariant
      setVariantIndex(nextVariant)

      timer.current =
        window.setTimeout(
          () => {
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
            mode: 'visual',
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
          mode: 'visual',
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
      mode="visual"
      round={round}
      score={score}
      combo={combo}
      active={
        phase === 'active'
      }
      onPointerDown={
        handleInput
      }
    >
      {phase === 'wait' && (
        <div className="text-center">
          <h1
            className="
              font-mono
              text-7xl
              font-black
              tracking-[-0.07em]
              md:text-8xl
            "
          >
            WAIT
          </h1>

          <p
            className="
              mt-4
              text-lg
              text-[#4f5344]
            "
          >
            {VISUAL_VARIANTS[variantIndex].cue}
          </p>
        </div>
      )}

      {phase ===
        'active' && (
        <div className="text-center">
          <h1
            className="
              text-7xl
              font-black
              tracking-[-0.06em]
              md:text-9xl
            "
          >
            {VISUAL_VARIANTS[variantIndex].signal}
          </h1>

          <p
            className="
              mt-4
              font-mono
              text-sm
              tracking-[0.16em]
            "
            style={{
              color: VISUAL_VARIANTS[variantIndex].color,
            }}
          >
            TAP NOW
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