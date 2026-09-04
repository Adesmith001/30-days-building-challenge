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
  FAKEOUT_VARIANTS,
  nextVariantIndex,
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

export function FakeoutTest({
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
    | 'wait'
    | 'decoy'
    | 'go'
    | 'feedback'
  >('wait')

  const [
    message,
    setMessage,
  ] = useState('WAIT')

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
    decoyCount,
    setDecoyCount,
  ] = useState(0)

  const variantRef = useRef(0)

  const timers =
    useRef<number[]>([])

  const startedAt =
    useRef(0)

  const clearTimers = () => {
    timers.current.forEach(
      (timer) =>
        window.clearTimeout(
          timer,
        ),
    )

    timers.current = []
  }

  const arm =
    useCallback(() => {
      clearTimers()

      setResult(null)
      setMessage('WAIT')
      setPhase('wait')
      setDecoyCount(0)

      const nextVariant = nextVariantIndex(
        FAKEOUT_VARIANTS.length,
        variantRef.current,
      )

      variantRef.current = nextVariant
      const variant =
        FAKEOUT_VARIANTS[nextVariant]

      const target =
        1 +
        Math.floor(
          Math.random() * 3,
        )

      let elapsed =
        800 +
        Math.random() * 500

      for (
        let index = 0;
        index < target;
        index += 1
      ) {
        timers.current.push(
          window.setTimeout(
            () => {
              setDecoyCount(
                index + 1,
              )

              setMessage(
                variant.decoys[
                  Math.floor(
                    Math.random() *
                      variant.decoys.length,
                  )
                ],
              )

              setPhase('decoy')
            },
            elapsed,
          ),
        )

        elapsed += variant.pause

        timers.current.push(
          window.setTimeout(
            () => {
              setMessage('WAIT')
              setPhase('wait')
            },
            elapsed,
          ),
        )

        elapsed +=
          650 +
          Math.random() * 600
      }

      timers.current.push(
        window.setTimeout(
          () => {
            setMessage(variant.goLabel)

            startedAt.current =
              performance.now()

            setPhase('go')
          },
          elapsed + 300,
        ),
      )
    }, [])

  useEffect(() => {
    arm()

    return () => {
      clearTimers()
    }
  }, [arm])

  const handleInput =
    useCallback(() => {
      if (
        phase === 'feedback'
      ) {
        return
      }

      clearTimers()

      if (phase !== 'go') {
        const reason =
          phase === 'decoy'
            ? 'fakeout'
            : 'false-start'

        const scored =
          onRound({
            mode: 'fakeout',
            valid: false,
            falseStart: true,
            reason,
            decoys:
              decoyCount,
          })

        setResult(scored)
        setPhase('feedback')

        timers.current.push(
          window.setTimeout(
            arm,
            950,
          ),
        )

        return
      }

      const scored =
        onRound({
          mode: 'fakeout',

          reactionMs:
            performance.now() -
            startedAt.current,

          valid: true,
          correct: true,
          decoys:
            decoyCount,
        })

      const nextClean =
        clean + 1

      setClean(nextClean)
      setResult(scored)
      setPhase('feedback')

      timers.current.push(
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
          1050,
        ),
      )
    }, [
      arm,
      clean,
      decoyCount,
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
      mode="fakeout"
      round={round}
      score={score}
      combo={combo}
      active={phase === 'go'}
      onPointerDown={
        handleInput
      }
    >
      {phase !==
        'feedback' && (
        <div className="text-center">
          <div
            className="
              font-mono
              text-[10px]
              tracking-[0.2em]
              text-[#666a59]
            "
          >
            ONLY REACT TO GO
          </div>

          <h1
            className={`
              mt-5
              text-7xl
              font-black
              uppercase
              tracking-[-0.06em]
              md:text-9xl

              ${
                phase ===
                'decoy'
                  ? 'text-[#bd360f]'
                  : ''
              }
            `}
          >
            {message}
          </h1>

          <p
            className="
              mt-5
              text-lg
              text-[#4f5344]
            "
          >
            Anything fit happen.
            No fall for am.
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