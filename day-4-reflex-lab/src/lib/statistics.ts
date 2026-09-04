import {
  MODES,
} from '../data/gameConfig'

import type {
  Mode,
  ModeSummary,
  ScoredRound,
} from '../types/game'

export function median(
  values: number[],
) {
  if (!values.length) {
    return null
  }

  const sorted = [
    ...values,
  ].sort((a, b) => a - b)

  const middle =
    Math.floor(sorted.length / 2)

  if (sorted.length % 2) {
    return sorted[middle]
  }

  return Math.round(
    (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2,
  )
}

export function consistencyScore(
  rounds: ScoredRound[],
) {
  const values = rounds
    .filter(
      (round) =>
        round.valid &&
        round.reactionMs !== undefined,
    )
    .map(
      (round) => round.reactionMs!,
    )

  if (values.length < 2) {
    return 100
  }

  const mean =
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length

  const variance =
    values.reduce(
      (sum, value) =>
        sum + (value - mean) ** 2,
      0,
    ) / values.length

  const coefficient =
    Math.sqrt(variance) / mean

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 - coefficient * 140,
      ),
    ),
  )
}

export function modeSummaries(
  rounds: ScoredRound[],
): ModeSummary[] {
  return MODES.map((mode) => {
    const rows = rounds.filter(
      (round) => round.mode === mode,
    )

    const clean = rows.filter(
      (round) =>
        round.valid &&
        round.correct !== false &&
        round.reactionMs !== undefined,
    )

    return {
      mode,

      median: median(
        clean.map(
          (round) => round.reactionMs!,
        ),
      ),

      points: rows.reduce(
        (sum, round) =>
          sum + round.points,
        0,
      ),

      clean: clean.length,

      faults: rows.filter(
        (round) =>
          !round.valid ||
          round.correct === false,
      ).length,
    }
  })
}

function toProfile(
  ms: number | null,
  best: number,
  slow: number,
) {
  if (ms == null) {
    return 0
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          (
            (ms - best) /
            (slow - best)
          ) *
            65,
      ),
    ),
  )
}

export function reflexProfile(
  rounds: ScoredRound[],
) {
  const summaries =
    modeSummaries(rounds)

  const getMedian = (
    mode: Mode,
  ) => {
    return (
      summaries.find(
        (item) => item.mode === mode,
      )?.median ?? null
    )
  }

  const fakeout =
    summaries.find(
      (item) =>
        item.mode === 'fakeout',
    )

  const totalFakeout =
    (fakeout?.clean ?? 0) +
    (fakeout?.faults ?? 0)

  return {
    visual: toProfile(
      getMedian('visual'),
      150,
      450,
    ),

    audio: toProfile(
      getMedian('audio'),
      130,
      420,
    ),

    decision: toProfile(
      getMedian('choice'),
      240,
      600,
    ),

    control: totalFakeout
      ? Math.round(
          (
            (fakeout?.clean ?? 0) /
            totalFakeout
          ) * 100,
        )
      : 0,
  }
}

export function getRank(
  score: number,
) {
  if (score >= 10000) {
    return 'WHO SEND YOU?'
  }

  if (score >= 9000) {
    return 'NO BE SMALL THING'
  }

  if (score >= 7500) {
    return 'SHARP SHARP'
  }

  if (score >= 6000) {
    return 'SHARP'
  }

  if (score >= 4500) {
    return 'CORRECT'
  }

  if (score >= 3000) {
    return 'YOU DEY WARM UP'
  }

  return 'E DEY LOAD'
}

export function performanceInsight(
  rounds: ScoredRound[],
) {
  const faults = rounds.filter(
    (round) =>
      !round.valid ||
      round.correct === false,
  ).length

  const profile =
    reflexProfile(rounds)

  if (faults >= 3) {
    return 'Speed no be your problem. Na patience.'
  }

  if (
    profile.audio >
    profile.visual + 8
  ) {
    return 'Your ear sharp pass your eye.'
  }

  if (
    profile.visual >
    profile.decision + 12
  ) {
    return 'Raw speed clean. Decision dey slow you small.'
  }

  if (
    consistencyScore(rounds) >= 90
  ) {
    return 'You no too vary. Steady from beginning to end.'
  }

  return 'You dey try. Run am back and chase your personal best.'
}