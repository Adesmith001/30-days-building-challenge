import type {
  Mode,
  PersonalBests,
  ScoredRound,
} from '../types/game'

let audioContext: AudioContext | null = null

export function initAudio() {
  audioContext ??= new AudioContext()

  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
}

export function beep(
  frequency = 880,
  duration = 0.08,
  wave: OscillatorType = 'sine',
) {
  initAudio()

  const context = audioContext!
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.frequency.value = frequency
  oscillator.type = wave
  gain.gain.setValueAtTime(0.08, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + duration,
  )

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration)
}

const STORAGE_KEY =
  'reflex-lab-naija-pb-v1'

const emptyModes:
  Record<Mode, number | null> = {
    visual: null,
    audio: null,
    choice: null,
    fakeout: null,
  }

export function defaultBests():
  PersonalBests {
  return {
    bestTotal: 0,
    fastestReaction: null,
    bestCombo: 0,
    sessionsPlayed: 0,
    modeFastest: {
      ...emptyModes,
    },
  }
}

export function loadBests():
  PersonalBests {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      )

    if (!raw) {
      return defaultBests()
    }

    const saved = JSON.parse(raw)

    return {
      ...defaultBests(),
      ...saved,

      modeFastest: {
        ...emptyModes,
        ...(saved.modeFastest ?? {}),
      },
    }
  } catch {
    return defaultBests()
  }
}

export function saveSession(
  rounds: ScoredRound[],
  total: number,
  current: PersonalBests,
) {
  const valid = rounds.filter(
    (round) =>
      round.valid &&
      round.reactionMs !== undefined,
  )

  const fastest =
    valid.length > 0
      ? Math.min(
          ...valid.map(
            (round) =>
              round.reactionMs!,
          ),
        )
      : null

  const bestCombo =
    rounds.length > 0
      ? Math.max(
          ...rounds.map(
            (round) =>
              round.comboCount,
          ),
        )
      : 0

  const next: PersonalBests = {
    ...current,

    bestTotal: Math.max(
      current.bestTotal,
      total,
    ),

    fastestReaction:
      fastest == null
        ? current.fastestReaction
        : Math.min(
            current.fastestReaction ??
              Infinity,
            fastest,
          ),

    bestCombo: Math.max(
      current.bestCombo,
      bestCombo,
    ),

    sessionsPlayed:
      current.sessionsPlayed + 1,

    modeFastest: {
      ...current.modeFastest,
    },
  }

  const modes: Mode[] = [
    'visual',
    'audio',
    'choice',
    'fakeout',
  ]

  modes.forEach((mode) => {
    const values = valid
      .filter(
        (round) =>
          round.mode === mode,
      )
      .map(
        (round) =>
          round.reactionMs!,
      )

    if (!values.length) {
      return
    }

    const best =
      Math.min(...values)

    next.modeFastest[mode] =
      Math.min(
        next.modeFastest[mode] ??
          Infinity,
        best,
      )
  })

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(next),
  )

  return next
}