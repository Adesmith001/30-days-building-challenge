import type { Mode } from '../types/game'

export const MODES: Mode[] = [
  'visual',
  'audio',
  'choice',
  'fakeout',
]

type ModeMeta = {
  index: string
  technical: string
  title: string
  subtitle: string
  description: string
  expected: string
  color: string
}

export const MODE_META: Record<
  Mode,
  ModeMeta
> = {
  visual: {
    index: '01',
    technical: 'PHOTIC_STIMULUS',
    title: 'UP NEPA',
    subtitle: 'See am. React.',
    description:
      'React immediately when the environment changes. Power fit come anytime.',
    expected: '140MS – 210MS',
    color: '#5f7f00',
  },

  audio: {
    index: '02',
    technical: 'ACOUSTIC_PULSE',
    title: 'YOU HEAR AM?',
    subtitle: 'Hear am. React.',
    description:
      'Wait for the isolated signal. No visual clues. No guessing.',
    expected: '120MS – 170MS',
    color: '#7d866a',
  },

  choice: {
    index: '03',
    technical: 'BILATERAL_DECISION',
    title: 'SHARP SHARP',
    subtitle: 'See am. Choose.',
    description:
      'React quickly, but make sure you choose the correct direction.',
    expected: '240MS – 320MS',
    color: '#2456c4',
  },

  fakeout: {
    index: '04',
    technical: 'PREFRONTAL_BRAKE',
    title: 'NO FALL FOR AM',
    subtitle: 'Control yourself.',
    description:
      'Anything fit happen. Only tap when you see GO.',
    expected: '0.0% FAULTS',
    color: '#bd360f',
  },
}

export const MODE_MULTIPLIER: Record<
  Mode,
  number
> = {
  visual: 1,
  audio: 1,
  choice: 1.25,
  fakeout: 1.4,
}

export const waitDelay = () => {
  return 1500 + Math.random() * 2500
}