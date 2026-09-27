export type PainterMode =
  | 'light'
  | 'ghost'
  | 'color'
  | 'neon'

export type BackgroundMode =
  | 'camera'
  | 'frozen'
  | 'black'

export type DebugView =
  | 'final'
  | 'source'
  | 'luminance'
  | 'motion'
  | 'mask'
  | 'accumulation'

export type Quality =
  | 'high'
  | 'balanced'
  | 'low'

export type BlendMode =
  | 'add'
  | 'screen'
  | 'max'

export type Symmetry =
  | 'none'
  | 'mirror-x'
  | 'mirror-y'
  | 'quad'

export type PresetName =
  | 'write'
  | 'portrait'
  | 'trails'
  | 'ghost'
  | 'neon'
  | 'custom'

export type SettingsTab =
  | 'mode'
  | 'exposure'
  | 'more'

export interface PainterSettings {
  mode: PainterMode
  background: BackgroundMode

  brightnessThreshold: number
  motionThreshold: number
  motionInfluence: number

  trailDecay: number
  strength: number
  glow: number
  softness: number

  backgroundOpacity: number
  mirror: boolean

  neonColor: string
  blend: BlendMode

  symmetry: Symmetry
  timeColor: boolean

  quality: Quality
}

export interface PainterStats {
  fps: number
  width: number
  height: number
  engine: 'WEBGL2' | 'BASIC'
}

export interface Snapshot {
  width: number
  height: number
  data: Uint8Array
}

export interface PainterEngine {
  readonly kind: 'webgl2' | 'basic'

  start(): void
  stop(): void

  setPainting(value: boolean): void
  updateSettings(settings: PainterSettings): void
  setDebugView(view: DebugView): void

  resize(): void
  resetSource(): void

  clear(): void
  undoClear(): boolean

  saveCheckpoint(): void
  restoreCheckpoint(): boolean

  freezeBackground(): void
  hasFrozenBackground(): boolean
}