import type {
  DebugView,
  PainterEngine,
  PainterSettings,
  PainterStats,
} from '../types/painter'

export class BasicEngine
  implements PainterEngine
{
  readonly kind = 'basic' as const

  private video: HTMLVideoElement
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  private work =
    document.createElement('canvas')

  private workCtx:
    CanvasRenderingContext2D

  private trail =
    new Float32Array(320 * 180 * 3)

  private previous:
    Uint8ClampedArray | null = null

  private checkpoint:
    Float32Array | null = null

  private undo:
    Float32Array | null = null

  private frozen:
    ImageData | null = null

  private settings: PainterSettings
  private debug: DebugView = 'final'
  private painting = false
  private running = false

  private raf = 0
  private frames = 0
  private lastStats = performance.now()

  private onStats:
    (stats: PainterStats) => void

  constructor(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    settings: PainterSettings,
    onStats: (
      stats: PainterStats,
    ) => void,
  ) {
    const ctx =
      canvas.getContext('2d', {
        alpha: false,
      })

    if (!ctx) {
      throw new Error(
        'Canvas 2D unavailable.',
      )
    }

    this.video = video
    this.canvas = canvas
    this.ctx = ctx

    this.work.width = 320
    this.work.height = 180

    this.workCtx =
      this.work.getContext(
        '2d',
        {
          willReadFrequently: true,
        },
      )!

    this.settings = settings
    this.onStats = onStats
  }

  start() {
    this.running = true
    this.resize()
    this.loop()
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  setPainting(value: boolean) {
    this.painting = value
  }

  updateSettings(
    settings: PainterSettings,
  ) {
    this.settings = settings
  }

  setDebugView(view: DebugView) {
    this.debug = view
  }

  resetSource() {
    this.previous = null
  }

  resize() {
    const rect =
      this.canvas.getBoundingClientRect()

    this.canvas.width =
      Math.max(
        2,
        Math.round(
          rect.width ||
            window.innerWidth,
        ),
      )

    this.canvas.height =
      Math.max(
        2,
        Math.round(
          rect.height ||
            window.innerHeight,
        ),
      )
  }

  clear() {
    this.undo =
      new Float32Array(
        this.trail,
      )

    this.trail.fill(0)
  }

  undoClear() {
    if (!this.undo) return false

    this.trail.set(this.undo)
    return true
  }

  saveCheckpoint() {
    this.checkpoint =
      new Float32Array(
        this.trail,
      )
  }

  restoreCheckpoint() {
    if (!this.checkpoint) {
      return false
    }

    this.trail.set(
      this.checkpoint,
    )

    return true
  }

  freezeBackground() {
    this.drawVideo()

    this.frozen =
      this.workCtx.getImageData(
        0,
        0,
        320,
        180,
      )
  }

  hasFrozenBackground() {
    return Boolean(this.frozen)
  }

  private loop = () => {
    if (!this.running) return

    this.frame()
    this.raf =
      requestAnimationFrame(
        this.loop,
      )
  }

  private frame() {
    if (
      this.video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return
    }

    this.drawVideo()

    const image =
      this.workCtx.getImageData(
        0,
        0,
        320,
        180,
      )

    if (
      this.painting &&
      this.previous
    ) {
      this.process(image.data)
    }

    this.render(image)

    this.previous =
      new Uint8ClampedArray(
        image.data,
      )

    this.frames += 1

    const now = performance.now()

    if (
      now - this.lastStats >
      1000
    ) {
      this.onStats({
        fps:
          (this.frames * 1000) /
          (now -
            this.lastStats),
        width: 320,
        height: 180,
        engine: 'BASIC',
      })

      this.frames = 0
      this.lastStats = now
    }
  }

  private drawVideo() {
    const ctx = this.workCtx

    ctx.save()
    ctx.clearRect(
      0,
      0,
      320,
      180,
    )

    if (this.settings.mirror) {
      ctx.translate(320, 0)
      ctx.scale(-1, 1)
    }

    const sourceAspect =
      this.video.videoWidth /
      Math.max(
        1,
        this.video.videoHeight,
      )

    const targetAspect =
      320 / 180

    let width = 320
    let height = 180
    let x = 0
    let y = 0

    if (
      sourceAspect >
      targetAspect
    ) {
      width =
        height * sourceAspect

      x =
        (320 - width) / 2
    } else {
      height =
        width / sourceAspect

      y =
        (180 - height) / 2
    }

    ctx.drawImage(
      this.video,
      x,
      y,
      width,
      height,
    )

    ctx.restore()
  }

  private process(
    current: Uint8ClampedArray,
  ) {
    const previous =
      this.previous!

    const settings =
      this.settings

    for (
      let pixel = 0;
      pixel < 320 * 180;
      pixel += 1
    ) {
      const source = pixel * 4
      const trail = pixel * 3

      const r =
        current[source] / 255

      const g =
        current[source + 1] /
        255

      const b =
        current[source + 2] /
        255

      const lum =
        r * 0.2126 +
        g * 0.7152 +
        b * 0.0722

      const diff =
        (
          Math.abs(
            current[source] -
              previous[source],
          ) +
          Math.abs(
            current[source + 1] -
              previous[source + 1],
          ) +
          Math.abs(
            current[source + 2] -
              previous[source + 2],
          )
        ) /
        (255 * 3)

      const bright =
        Math.max(
          0,
          Math.min(
            1,
            (
              lum -
              settings.brightnessThreshold
            ) /
              settings.softness,
          ),
        )

      const motion =
        Math.max(
          0,
          Math.min(
            1,
            (
              diff -
              settings.motionThreshold
            ) /
              0.08,
          ),
        )

      const mask =
        settings.mode === 'ghost'
          ? motion
          : bright *
            (
              1 -
                settings.motionInfluence +
              motion *
                settings.motionInfluence
            )

      this.trail[trail] *=
        settings.trailDecay

      this.trail[
        trail + 1
      ] *= settings.trailDecay

      this.trail[
        trail + 2
      ] *= settings.trailDecay

      if (mask <= 0) {
        continue
      }

      let color = [
        r,
        g,
        b,
      ]

      if (
        settings.mode === 'light'
      ) {
        color = [
          lum,
          lum,
          lum,
        ]
      }

      if (
        settings.mode === 'neon'
      ) {
        color =
          this.hexToRgb(
            settings.neonColor,
          )
      }

      for (
        let channel = 0;
        channel < 3;
        channel += 1
      ) {
        const incoming =
          color[channel] *
          mask *
          settings.strength

        this.trail[
          trail + channel
        ] = Math.min(
          1,
          this.trail[
            trail + channel
          ] + incoming,
        )
      }
    }
  }

  private render(
    current: ImageData,
  ) {
    const output =
      new ImageData(
        320,
        180,
      )

    for (
      let pixel = 0;
      pixel < 320 * 180;
      pixel += 1
    ) {
      const source = pixel * 4
      const trail = pixel * 3

      for (
        let channel = 0;
        channel < 3;
        channel += 1
      ) {
        let background =
          current.data[
            source + channel
          ] / 255

        if (
          this.settings
            .background ===
          'black'
        ) {
          background = 0
        }

        if (
          this.settings
            .background ===
            'frozen' &&
          this.frozen
        ) {
          background =
            this.frozen.data[
              source + channel
            ] / 255
        }

        if (
          this.debug ===
          'accumulation'
        ) {
          background = 0
        }

        const trailValue =
          this.trail[
            trail + channel
          ]

        const value =
          1 -
          (
            1 -
            background *
              this.settings
                .backgroundOpacity
          ) *
            (1 - trailValue)

        output.data[
          source + channel
        ] = value * 255
      }

      output.data[
        source + 3
      ] = 255
    }

    this.workCtx.putImageData(
      output,
      0,
      0,
    )

    this.ctx.imageSmoothingEnabled =
      true

    this.ctx.drawImage(
      this.work,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    )
  }

  private hexToRgb(hex: string) {
    const value = parseInt(
      hex.replace('#', ''),
      16,
    )

    return [
      ((value >> 16) & 255) /
        255,
      ((value >> 8) & 255) /
        255,
      (value & 255) / 255,
    ]
  }
}