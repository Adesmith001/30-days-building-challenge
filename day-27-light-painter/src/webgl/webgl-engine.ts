import type {
  DebugView,
  PainterEngine,
  PainterSettings,
  PainterStats,
} from '../types/painter'

import { Pipeline } from './pipeline'

type VideoWithFrameCallback =
  HTMLVideoElement & {
    requestVideoFrameCallback?: (
      callback: () => void,
    ) => number
    cancelVideoFrameCallback?: (
      id: number,
    ) => void
  }

export class WebGLEngine
  implements PainterEngine
{
  readonly kind = 'webgl2' as const

  private readonly video:
    VideoWithFrameCallback

  private readonly pipeline: Pipeline

  private readonly onStats:
    (stats: PainterStats) => void

  private running = false
  private painting = false

  private callbackId = 0
  private usingVideoCallback = false

  private frameCount = 0
  private statsStartedAt =
    performance.now()

  constructor(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    settings: PainterSettings,
    onStats: (
      stats: PainterStats,
    ) => void,
  ) {
    this.video =
      video as VideoWithFrameCallback

    this.pipeline =
      new Pipeline(
        canvas,
        settings,
      )

    this.onStats = onStats
  }

  start() {
    if (this.running) return

    this.running = true
    this.schedule()
  }

  stop() {
    this.running = false

    if (
      this.usingVideoCallback &&
      this.video
        .cancelVideoFrameCallback
    ) {
      this.video.cancelVideoFrameCallback(
        this.callbackId,
      )
    } else {
      cancelAnimationFrame(
        this.callbackId,
      )
    }

    this.pipeline.destroy()
  }

  setPainting(value: boolean) {
    this.painting = value
  }

  updateSettings(
    settings: PainterSettings,
  ) {
    this.pipeline.updateSettings(
      settings,
    )
  }

  setDebugView(view: DebugView) {
    this.pipeline.setDebug(view)
  }

  resize() {
    this.pipeline.resize()
  }

  resetSource() {
    this.pipeline.resetSource()
  }

  clear() {
    this.pipeline.clear()
  }

  undoClear() {
    return this.pipeline.undoClear()
  }

  saveCheckpoint() {
    this.pipeline.saveCheckpoint()
  }

  restoreCheckpoint() {
    return this.pipeline.restoreCheckpoint()
  }

  freezeBackground() {
    this.pipeline.freeze(
      this.video,
    )
  }

  hasFrozenBackground() {
    return this.pipeline.hasFrozen()
  }

  private schedule() {
    if (!this.running) return

    if (
      this.video
        .requestVideoFrameCallback
    ) {
      this.usingVideoCallback = true

      this.callbackId =
        this.video.requestVideoFrameCallback(
          this.tick,
        )
    } else {
      this.usingVideoCallback = false

      this.callbackId =
        requestAnimationFrame(
          this.tick,
        )
    }
  }

  private tick = () => {
    if (!this.running) return

    this.pipeline.step(
      this.video,
      this.painting,
    )

    this.frameCount += 1

    const now = performance.now()
    const elapsed =
      now - this.statsStartedAt

    if (elapsed >= 1000) {
      const size =
        this.pipeline.getSizeInfo()

      this.onStats({
        fps:
          (this.frameCount * 1000) /
          elapsed,
        width: size.width,
        height: size.height,
        engine: 'WEBGL2',
      })

      this.frameCount = 0
      this.statsStartedAt = now
    }

    this.schedule()
  }
}