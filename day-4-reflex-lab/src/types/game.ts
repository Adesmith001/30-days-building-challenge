export type Mode =
  | 'visual'
  | 'audio'
  | 'choice'
  | 'fakeout'

export type SessionKind =
  | 'full'
  | 'quick'

export type RoundInput = {
  mode: Mode
  reactionMs?: number
  valid: boolean
  falseStart?: boolean
  correct?: boolean
  decoys?: number
  reason?:
    | 'false-start'
    | 'wrong-choice'
    | 'fakeout'
}

export type ScoredRound = RoundInput & {
  id: string
  points: number
  speedPoints: number
  bonus: number
  comboCount: number
  comboMultiplier: number
  achievement?: string
  label: string
  flavor: string
  deltaVsPb?: number
}

export type PersonalBests = {
  bestTotal: number
  fastestReaction: number | null
  bestCombo: number
  sessionsPlayed: number

  modeFastest: Record<
    Mode,
    number | null
  >
}

export type ModeSummary = {
  mode: Mode
  median: number | null
  points: number
  clean: number
  faults: number
}