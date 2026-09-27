import type {
  PainterEngine,
  PainterSettings,
  PainterStats,
} from '../types/painter'

import { BasicEngine } from './basic-engine'
import { WebGLEngine } from './webgl-engine'

export function createPainterEngine(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  settings: PainterSettings,
  onStats: (
    stats: PainterStats,
  ) => void,
): PainterEngine {
  try {
    return new WebGLEngine(
      video,
      canvas,
      settings,
      onStats,
    )
  } catch {
    return new BasicEngine(
      video,
      canvas,
      settings,
      onStats,
    )
  }
}