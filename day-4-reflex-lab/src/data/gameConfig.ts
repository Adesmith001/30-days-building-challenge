import type { Mode } from '../types/game'

export type VisualVariant = {
  signal: string
  cue: string
  color: string
}

export type AudioVariant = {
  label: string
  frequency: number
  duration: number
  wave: OscillatorType
}

export type ChoiceVariant = {
  prompt: string
  leftLabel: string
  rightLabel: string
}

export type FakeoutVariant = {
  decoys: string[]
  goLabel: string
  pause: number
}

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
  challenge: string
  difficulty: string
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
    challenge: 'Catch the blackout before your brain catches up.',
    difficulty: 'WARM-UP',
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
    challenge: 'Your ears are driving. Your eyes are off duty.',
    difficulty: 'TIGHT',
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
    challenge: 'Fast hands are useless when the choice is wrong.',
    difficulty: 'SHARP',
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
    challenge: 'The hardest move is knowing when to do nothing.',
    difficulty: 'BRUTAL',
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

export const VISUAL_VARIANTS: VisualVariant[] = [
  { signal: 'UP NEPA!', cue: 'POWER CUT', color: '#171717' },
  { signal: 'LIGHT ON!', cue: 'CURRENT RESTORED', color: '#5f7f00' },
  { signal: 'GENERATOR!', cue: 'BACKUP ONLINE', color: '#bd360f' },
  { signal: 'OYA MOVE!', cue: 'WINDOW OPEN', color: '#2456c4' },
  { signal: 'E DON SHOW!', cue: 'SIGNAL FOUND', color: '#5f7f00' },
  { signal: 'WAKE UP!', cue: 'FLASH DETECTED', color: '#bd360f' },
  { signal: 'GBAM!', cue: 'TARGET LIT', color: '#2456c4' },
  { signal: 'NO DULLING!', cue: 'BRIGHTNESS SPIKE', color: '#171717' },
  { signal: 'WE MOVE!', cue: 'STATUS CHANGED', color: '#5f7f00' },
  { signal: 'CATCH AM!', cue: 'VISUAL PULSE', color: '#bd360f' },
]

export const AUDIO_VARIANTS: AudioVariant[] = [
  { label: 'HIGH PING', frequency: 1047, duration: 0.08, wave: 'sine' },
  { label: 'LOW PULSE', frequency: 392, duration: 0.14, wave: 'sine' },
  { label: 'BRIGHT CHIRP', frequency: 1319, duration: 0.06, wave: 'triangle' },
  { label: 'BASS KNOCK', frequency: 220, duration: 0.12, wave: 'square' },
  { label: 'CLEAN TONE', frequency: 880, duration: 0.1, wave: 'sine' },
  { label: 'METAL SNAP', frequency: 1760, duration: 0.045, wave: 'square' },
  { label: 'SOFT DING', frequency: 659, duration: 0.16, wave: 'triangle' },
  { label: 'DOUBLE CHECK', frequency: 523, duration: 0.09, wave: 'sawtooth' },
  { label: 'QUICK BEEP', frequency: 740, duration: 0.055, wave: 'square' },
  { label: 'FINAL BELL', frequency: 988, duration: 0.13, wave: 'triangle' },
]

export const CHOICE_VARIANTS: ChoiceVariant[] = [
  { prompt: 'PICK THE LANE', leftLabel: 'LEFT', rightLabel: 'RIGHT' },
  { prompt: 'WHICH WAY?', leftLabel: 'WEST', rightLabel: 'EAST' },
  { prompt: 'FOLLOW THE FLASH', leftLabel: '← GO', rightLabel: 'GO →' },
  { prompt: 'NO HESITATION', leftLabel: 'ONE', rightLabel: 'TWO' },
  { prompt: 'READ THE SIGNAL', leftLabel: 'A', rightLabel: 'B' },
  { prompt: 'CHOOSE WISELY', leftLabel: 'SIDE A', rightLabel: 'SIDE B' },
  { prompt: 'QUICK QUICK', leftLabel: 'LEFT SIDE', rightLabel: 'RIGHT SIDE' },
  { prompt: 'LOCK TARGET', leftLabel: 'L', rightLabel: 'R' },
  { prompt: 'WHERE AM?', leftLabel: 'THIS WAY', rightLabel: 'THAT WAY' },
  { prompt: 'FINAL CALL', leftLabel: '← TAKE', rightLabel: 'TAKE →' },
]

export const FAKEOUT_VARIANTS: FakeoutVariant[] = [
  { decoys: ['NOW?', 'OYA—'], goLabel: 'GO!', pause: 300 },
  { decoys: ['READY?', 'ALMOST'], goLabel: 'MOVE!', pause: 420 },
  { decoys: ['WAIT', 'NOW NOW'], goLabel: 'TAP!', pause: 260 },
  { decoys: ['NEARLY', 'DON’T'], goLabel: 'GO!', pause: 500 },
  { decoys: ['OYA START', 'NOT YET'], goLabel: 'NOW!', pause: 340 },
  { decoys: ['LOOK HERE', 'Ehen?'], goLabel: 'HIT IT!', pause: 280 },
  { decoys: ['CALM DOWN', 'COMING'], goLabel: 'GO!', pause: 460 },
  { decoys: ['FALSE ALARM', 'WAIT SMALL'], goLabel: 'PRESS!', pause: 320 },
  { decoys: ['YOU SURE?', 'ALMOST THERE'], goLabel: 'NOW!', pause: 390 },
  { decoys: ['DON’T BLINK', 'HOLD ON'], goLabel: 'GO!', pause: 240 },
]

export function nextVariantIndex(
  length: number,
  previous: number,
) {
  let index = Math.floor(Math.random() * length)

  while (length > 1 && index === previous) {
    index = Math.floor(Math.random() * length)
  }

  return index
}