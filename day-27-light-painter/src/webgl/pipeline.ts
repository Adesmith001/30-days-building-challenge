import type {
  DebugView,
  PainterSettings,
  Quality,
  Snapshot,
} from '../types/painter'

import {
  clearTarget,
  createProgram,
  createTarget,
  createTexture,
  deleteTarget,
  type RenderTarget,
} from './gl'

import { vertexShader } from './shaders/vertex'
import { cameraCopyShader } from './shaders/camera-copy'
import { textureCopyShader } from './shaders/texture-copy'
import { accumulateShader } from './shaders/accumulate'
import { displayShader } from './shaders/display'

const QUALITY_EDGE: Record<
  Quality,
  number
> = {
  high: 1280,
  balanced: 960,
  low: 640,
}

function hexToRgb(hex: string) {
  const value =
    parseInt(
      hex.replace('#', ''),
      16,
    )

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ]
}

export class Pipeline {
  readonly gl: WebGL2RenderingContext

  private readonly canvas:
    HTMLCanvasElement

  private settings: PainterSettings

  private debug: DebugView = 'final'

  private videoTexture: WebGLTexture

  private accumulationA:
    RenderTarget

  private accumulationB:
    RenderTarget

  private previous: RenderTarget
  private frozen: RenderTarget

  private read: RenderTarget
  private write: RenderTarget

  private hasPrevious = false
  private frozenReady = false

  private checkpoint:
    Snapshot | null = null

  private clearUndo:
    Snapshot | null = null

  private vao: WebGLVertexArrayObject

  private programs: {
    accumulate: WebGLProgram
    display: WebGLProgram
    cameraCopy: WebGLProgram
    textureCopy: WebGLProgram
  }

  constructor(
    canvas: HTMLCanvasElement,
    settings: PainterSettings,
  ) {
    const gl = canvas.getContext(
      'webgl2',
      {
        antialias: false,
        alpha: false,
        preserveDrawingBuffer: true,
      },
    )

    if (!gl) {
      throw new Error(
        'WebGL2 unavailable.',
      )
    }

    this.gl = gl
    this.canvas = canvas
    this.settings = settings

    this.vao =
      gl.createVertexArray()!

    gl.bindVertexArray(this.vao)

    this.programs = {
      accumulate: createProgram(
        gl,
        vertexShader,
        accumulateShader,
      ),
      display: createProgram(
        gl,
        vertexShader,
        displayShader,
      ),
      cameraCopy: createProgram(
        gl,
        vertexShader,
        cameraCopyShader,
      ),
      textureCopy: createProgram(
        gl,
        vertexShader,
        textureCopyShader,
      ),
    }

    this.videoTexture =
      createTexture(gl)

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([
        0,
        0,
        0,
        255,
      ]),
    )

    const size = this.getSize()

    this.canvas.width = size.width
    this.canvas.height = size.height

    this.accumulationA =
      createTarget(
        gl,
        size.width,
        size.height,
      )

    this.accumulationB =
      createTarget(
        gl,
        size.width,
        size.height,
      )

    this.previous =
      createTarget(
        gl,
        size.width,
        size.height,
      )

    this.frozen =
      createTarget(
        gl,
        size.width,
        size.height,
      )

    this.read = this.accumulationA
    this.write = this.accumulationB

    this.clearAll()
  }

  updateSettings(
    settings: PainterSettings,
  ) {
    const qualityChanged =
      settings.quality !==
      this.settings.quality

    this.settings = settings

    if (qualityChanged) {
      this.resize()
    }
  }

  setDebug(view: DebugView) {
    this.debug = view
  }

  resetSource() {
    clearTarget(
      this.gl,
      this.previous,
    )

    this.hasPrevious = false
  }

  resize() {
    const size = this.getSize()

    if (
      size.width ===
        this.canvas.width &&
      size.height ===
        this.canvas.height
    ) {
      return
    }

    const oldRead = this.read
    const oldPrevious = this.previous
    const oldFrozen = this.frozen

    const gl = this.gl

    this.canvas.width = size.width
    this.canvas.height = size.height

    const a = createTarget(
      gl,
      size.width,
      size.height,
    )

    const b = createTarget(
      gl,
      size.width,
      size.height,
    )

    const previous = createTarget(
      gl,
      size.width,
      size.height,
    )

    const frozen = createTarget(
      gl,
      size.width,
      size.height,
    )

    this.copyTexture(
      oldRead.texture,
      a,
    )

    this.copyTexture(
      oldRead.texture,
      b,
    )

    this.copyTexture(
      oldPrevious.texture,
      previous,
    )

    if (this.frozenReady) {
      this.copyTexture(
        oldFrozen.texture,
        frozen,
      )
    } else {
      clearTarget(gl, frozen)
    }

    deleteTarget(
      gl,
      this.accumulationA,
    )

    deleteTarget(
      gl,
      this.accumulationB,
    )

    deleteTarget(gl, oldPrevious)
    deleteTarget(gl, oldFrozen)

    this.accumulationA = a
    this.accumulationB = b
    this.previous = previous
    this.frozen = frozen

    this.read = a
    this.write = b
  }

  step(
    video: HTMLVideoElement,
    painting: boolean,
  ) {
    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return
    }

    this.uploadVideo(video)

    if (!this.hasPrevious) {
      this.copyCamera(
        video,
        this.previous,
      )

      this.hasPrevious = true
    } else if (painting) {
      this.accumulate(video)

      const temp = this.read
      this.read = this.write
      this.write = temp
    }

    this.display(video)

    this.copyCamera(
      video,
      this.previous,
    )
  }

  freeze(
    video: HTMLVideoElement,
  ) {
    this.uploadVideo(video)

    this.copyCamera(
      video,
      this.frozen,
    )

    this.frozenReady = true
  }

  hasFrozen() {
    return this.frozenReady
  }

  clear() {
    this.clearUndo =
      this.snapshot()

    clearTarget(
      this.gl,
      this.accumulationA,
    )

    clearTarget(
      this.gl,
      this.accumulationB,
    )
  }

  undoClear() {
    if (!this.clearUndo) {
      return false
    }

    this.restore(
      this.clearUndo,
    )

    return true
  }

  saveCheckpoint() {
    this.checkpoint =
      this.snapshot()
  }

  restoreCheckpoint() {
    if (!this.checkpoint) {
      return false
    }

    this.restore(
      this.checkpoint,
    )

    return true
  }

  getSizeInfo() {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    }
  }

  destroy() {
    const gl = this.gl

    deleteTarget(
      gl,
      this.accumulationA,
    )

    deleteTarget(
      gl,
      this.accumulationB,
    )

    deleteTarget(
      gl,
      this.previous,
    )

    deleteTarget(
      gl,
      this.frozen,
    )

    gl.deleteTexture(
      this.videoTexture,
    )

    Object.values(
      this.programs,
    ).forEach((program) => {
      gl.deleteProgram(program)
    })

    gl.deleteVertexArray(this.vao)
  }

  private getSize() {
    const rect =
      this.canvas.getBoundingClientRect()

    const cssWidth =
      rect.width ||
      window.innerWidth

    const cssHeight =
      rect.height ||
      window.innerHeight

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2,
    )

    const rawWidth =
      cssWidth * dpr

    const rawHeight =
      cssHeight * dpr

    const maxEdge =
      QUALITY_EDGE[
        this.settings.quality
      ]

    const scale = Math.min(
      1,
      maxEdge /
        Math.max(
          rawWidth,
          rawHeight,
        ),
    )

    return {
      width: Math.max(
        2,
        Math.round(
          rawWidth * scale,
        ),
      ),
      height: Math.max(
        2,
        Math.round(
          rawHeight * scale,
        ),
      ),
    }
  }

  private uploadVideo(
    video: HTMLVideoElement,
  ) {
    const gl = this.gl

    gl.bindTexture(
      gl.TEXTURE_2D,
      this.videoTexture,
    )

    gl.pixelStorei(
      gl.UNPACK_FLIP_Y_WEBGL,
      true,
    )

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      video,
    )
  }

  private accumulate(
    video: HTMLVideoElement,
  ) {
    const gl = this.gl
    const program =
      this.programs.accumulate

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      this.write.framebuffer,
    )

    gl.viewport(
      0,
      0,
      this.write.width,
      this.write.height,
    )

    gl.useProgram(program)

    this.bind(
      program,
      'uVideo',
      this.videoTexture,
      0,
    )

    this.bind(
      program,
      'uPrevious',
      this.previous.texture,
      1,
    )

    this.bind(
      program,
      'uAccumulation',
      this.read.texture,
      2,
    )

    this.setCommonCamera(
      program,
      video,
    )

    const settings =
      this.settings

    this.f(
      program,
      'uBrightnessThreshold',
      settings.brightnessThreshold,
    )

    this.f(
      program,
      'uMotionThreshold',
      settings.motionThreshold,
    )

    this.f(
      program,
      'uMotionInfluence',
      settings.motionInfluence,
    )

    this.f(
      program,
      'uDecay',
      settings.trailDecay,
    )

    this.f(
      program,
      'uStrength',
      settings.strength,
    )

    this.f(
      program,
      'uSoftness',
      settings.softness,
    )

    this.f(
      program,
      'uTime',
      performance.now() / 1000,
    )

    const rgb =
      hexToRgb(
        settings.neonColor,
      )

    gl.uniform3f(
      this.loc(
        program,
        'uNeonColor',
      ),
      rgb[0],
      rgb[1],
      rgb[2],
    )

    this.i(
      program,
      'uMode',
      this.modeCode(),
    )

    this.i(
      program,
      'uBlend',
      this.blendCode(),
    )

    this.i(
      program,
      'uSymmetry',
      this.symmetryCode(),
    )

    this.i(
      program,
      'uTimeColor',
      settings.timeColor
        ? 1
        : 0,
    )

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      3,
    )
  }

  private display(
    video: HTMLVideoElement,
  ) {
    const gl = this.gl
    const program =
      this.programs.display

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      null,
    )

    gl.viewport(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    )

    gl.useProgram(program)

    this.bind(
      program,
      'uVideo',
      this.videoTexture,
      0,
    )

    this.bind(
      program,
      'uPrevious',
      this.previous.texture,
      1,
    )

    this.bind(
      program,
      'uAccumulation',
      this.read.texture,
      2,
    )

    this.bind(
      program,
      'uFrozen',
      this.frozen.texture,
      3,
    )

    this.setCommonCamera(
      program,
      video,
    )

    const settings =
      this.settings

    this.f(
      program,
      'uBackgroundOpacity',
      settings.backgroundOpacity,
    )

    this.f(
      program,
      'uGlow',
      settings.glow,
    )

    this.f(
      program,
      'uBrightnessThreshold',
      settings.brightnessThreshold,
    )

    this.f(
      program,
      'uMotionThreshold',
      settings.motionThreshold,
    )

    this.f(
      program,
      'uMotionInfluence',
      settings.motionInfluence,
    )

    this.f(
      program,
      'uSoftness',
      settings.softness,
    )

    gl.uniform2f(
      this.loc(
        program,
        'uTexel',
      ),
      1 / this.canvas.width,
      1 / this.canvas.height,
    )

    this.i(
      program,
      'uBackground',
      this.backgroundCode(),
    )

    this.i(
      program,
      'uDebug',
      this.debugCode(),
    )

    this.i(
      program,
      'uMode',
      this.modeCode(),
    )

    this.i(
      program,
      'uHasFrozen',
      this.frozenReady
        ? 1
        : 0,
    )

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      3,
    )
  }

  private copyCamera(
    video: HTMLVideoElement,
    target: RenderTarget,
  ) {
    const gl = this.gl
    const program =
      this.programs.cameraCopy

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      target.framebuffer,
    )

    gl.viewport(
      0,
      0,
      target.width,
      target.height,
    )

    gl.useProgram(program)

    this.bind(
      program,
      'uVideo',
      this.videoTexture,
      0,
    )

    this.setCommonCamera(
      program,
      video,
    )

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      3,
    )
  }

  private copyTexture(
    texture: WebGLTexture,
    target: RenderTarget,
  ) {
    const gl = this.gl
    const program =
      this.programs.textureCopy

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      target.framebuffer,
    )

    gl.viewport(
      0,
      0,
      target.width,
      target.height,
    )

    gl.useProgram(program)

    this.bind(
      program,
      'uTexture',
      texture,
      0,
    )

    gl.drawArrays(
      gl.TRIANGLES,
      0,
      3,
    )
  }

  private setCommonCamera(
    program: WebGLProgram,
    video: HTMLVideoElement,
  ) {
    this.f(
      program,
      'uSourceAspect',
      video.videoWidth /
        Math.max(
          1,
          video.videoHeight,
        ),
    )

    this.f(
      program,
      'uCanvasAspect',
      this.canvas.width /
        this.canvas.height,
    )

    this.i(
      program,
      'uMirror',
      this.settings.mirror
        ? 1
        : 0,
    )
  }

  private snapshot(): Snapshot {
    const gl = this.gl

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      this.read.framebuffer,
    )

    const data =
      new Uint8Array(
        this.read.width *
          this.read.height *
          4,
      )

    gl.readPixels(
      0,
      0,
      this.read.width,
      this.read.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data,
    )

    return {
      width: this.read.width,
      height: this.read.height,
      data,
    }
  }

  private restore(
    snapshot: Snapshot,
  ) {
    const gl = this.gl

    const temporary =
      createTexture(gl)

    gl.bindTexture(
      gl.TEXTURE_2D,
      temporary,
    )

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      snapshot.width,
      snapshot.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      snapshot.data,
    )

    this.copyTexture(
      temporary,
      this.accumulationA,
    )

    this.copyTexture(
      temporary,
      this.accumulationB,
    )

    gl.deleteTexture(temporary)
  }

  private clearAll() {
    clearTarget(
      this.gl,
      this.accumulationA,
    )

    clearTarget(
      this.gl,
      this.accumulationB,
    )

    clearTarget(
      this.gl,
      this.previous,
    )

    clearTarget(
      this.gl,
      this.frozen,
    )
  }

  private bind(
    program: WebGLProgram,
    name: string,
    texture: WebGLTexture,
    unit: number,
  ) {
    const gl = this.gl

    gl.activeTexture(
      gl.TEXTURE0 + unit,
    )

    gl.bindTexture(
      gl.TEXTURE_2D,
      texture,
    )

    gl.uniform1i(
      this.loc(program, name),
      unit,
    )
  }

  private f(
    program: WebGLProgram,
    name: string,
    value: number,
  ) {
    this.gl.uniform1f(
      this.loc(program, name),
      value,
    )
  }

  private i(
    program: WebGLProgram,
    name: string,
    value: number,
  ) {
    this.gl.uniform1i(
      this.loc(program, name),
      value,
    )
  }

  private loc(
    program: WebGLProgram,
    name: string,
  ) {
    return this.gl.getUniformLocation(
      program,
      name,
    )
  }

  private modeCode() {
    return {
      light: 0,
      ghost: 1,
      color: 2,
      neon: 3,
    }[this.settings.mode]
  }

  private blendCode() {
    return {
      add: 0,
      screen: 1,
      max: 2,
    }[this.settings.blend]
  }

  private symmetryCode() {
    return {
      none: 0,
      'mirror-x': 1,
      'mirror-y': 2,
      quad: 3,
    }[this.settings.symmetry]
  }

  private backgroundCode() {
    return {
      camera: 0,
      frozen: 1,
      black: 2,
    }[this.settings.background]
  }

  private debugCode() {
    return {
      final: 0,
      source: 1,
      luminance: 2,
      motion: 3,
      mask: 4,
      accumulation: 5,
    }[this.debug]
  }
}