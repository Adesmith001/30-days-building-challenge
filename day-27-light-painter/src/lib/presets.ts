import type {
  PainterSettings,
  PresetName,
} from '../types/painter'

export const DEFAULT_SETTINGS: PainterSettings = {
  mode: 'light',
  background: 'camera',

  brightnessThreshold: 0.52,
  motionThreshold: 0.075,
  motionInfluence: 0.82,

  trailDecay: 0.982,
  strength: 0.72,
  glow: 0.32,
  softness: 0.08,

  backgroundOpacity: 1,
  mirror: true,

  neonColor: '#65e8ff',
  blend: 'screen',

  symmetry: 'none',
  timeColor: false,

  quality: 'high',
}

export function getPreset(
  preset: PresetName,
): PainterSettings {
  const base = {
    ...DEFAULT_SETTINGS,
  }

  if (preset === 'write') {
    return {
      ...base,
      mode: 'light',
      background: 'black',
      brightnessThreshold: 0.6,
      motionThreshold: 0.065,
      motionInfluence: 0.75,
      trailDecay: 1,
      strength: 0.82,
      glow: 0.4,
    }
  }

  if (preset === 'portrait') {
    return {
      ...base,
      mode: 'color',
      background: 'frozen',
      trailDecay: 0.992,
      strength: 0.68,
      glow: 0.38,
      backgroundOpacity: 0.76,
    }
  }

  if (preset === 'ghost') {
    return {
      ...base,
      mode: 'ghost',
      background: 'camera',
      motionThreshold: 0.055,
      motionInfluence: 1,
      trailDecay: 0.947,
      strength: 0.38,
      glow: 0.12,
    }
  }

  if (preset === 'neon') {
    return {
      ...base,
      mode: 'neon',
      background: 'black',
      brightnessThreshold: 0.56,
      trailDecay: 0.988,
      strength: 0.76,
      glow: 0.62,
      neonColor: '#65e8ff',
    }
  }

  if (preset === 'trails') {
    return {
      ...base,
      mode: 'light',
      background: 'camera',
      trailDecay: 0.972,
      strength: 0.68,
      glow: 0.28,
    }
  }

  return base
}

export function decayLabel(decay: number) {
  if (decay >= 0.9995) return 'PERMANENT'
  if (decay >= 0.99) return 'LONG'
  if (decay >= 0.965) return 'MEDIUM'

  return 'SHORT'
}