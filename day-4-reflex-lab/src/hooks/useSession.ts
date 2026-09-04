import {
  useMemo,
  useState,
} from 'react'

import {
  scoreRound,
} from '../lib/scoring'

import {
  loadBests,
  saveSession,
} from '../lib/storage'

import type {
  Mode,
  RoundInput,
  ScoredRound,
  SessionKind,
} from '../types/game'

export function useSession() {
  const [
    rounds,
    setRounds,
  ] = useState<ScoredRound[]>([])

  const [
    total,
    setTotal,
  ] = useState(0)

  const [
    combo,
    setCombo,
  ] = useState(0)

  const [
    kind,
    setKind,
  ] =
    useState<SessionKind>('full')

  const [
    bests,
    setBests,
  ] = useState(loadBests)

  const [
    modeBonuses,
    setModeBonuses,
  ] = useState<
    Partial<Record<Mode, number>>
  >({})

  const [
    newPb,
    setNewPb,
  ] = useState(false)

  function start(
    sessionKind: SessionKind,
  ) {
    setRounds([])
    setTotal(0)
    setCombo(0)
    setKind(sessionKind)
    setModeBonuses({})
    setNewPb(false)
  }

  function submitRound(
    input: RoundInput,
  ) {
    const scored = scoreRound(
      input,
      combo,
      rounds,
      bests.modeFastest[
        input.mode
      ],
    )

    setRounds(
      (current) => [
        ...current,
        scored,
      ],
    )

    setTotal(
      (current) =>
        current + scored.points,
    )

    setCombo(
      scored.comboCount,
    )

    return scored
  }

  function finishMode(
    mode: Mode,
    cleanCount: number,
  ) {
    const modeRows =
      rounds.filter(
        (round) =>
          round.mode === mode,
      )

    const faults =
      modeRows.filter(
        (round) =>
          !round.valid ||
          round.correct === false,
      ).length

    const bonus =
      cleanCount === 5 &&
      faults === 0
        ? 300
        : 0

    setModeBonuses(
      (current) => ({
        ...current,
        [mode]: bonus,
      }),
    )

    if (bonus) {
      setTotal(
        (current) =>
          current + bonus,
      )
    }

    return bonus
  }

  function finishSession() {
    const previous =
      bests.bestTotal

    const next =
      saveSession(
        rounds,
        total,
        bests,
      )

    setBests(next)

    setNewPb(
      total > previous,
    )
  }

  const modePoints =
    useMemo(() => {
      return rounds.reduce<
        Partial<
          Record<Mode, number>
        >
      >(
        (result, round) => {
          result[round.mode] =
            (
              result[
                round.mode
              ] ?? 0
            ) + round.points

          return result
        },
        {},
      )
    }, [rounds])

  return {
    rounds,
    total,
    combo,
    kind,
    bests,
    modeBonuses,
    modePoints,
    newPb,
    start,
    submitRound,
    finishMode,
    finishSession,
  }
}