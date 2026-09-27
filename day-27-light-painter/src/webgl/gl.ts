export interface RenderTarget {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
  width: number
  height: number
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)

  if (!shader) {
    throw new Error(
      'Could not create shader.',
    )
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (
    !gl.getShaderParameter(
      shader,
      gl.COMPILE_STATUS,
    )
  ) {
    const log =
      gl.getShaderInfoLog(shader)

    gl.deleteShader(shader)

    throw new Error(
      log || 'Shader compilation failed.',
    )
  }

  return shader
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertex: string,
  fragment: string,
) {
  const program =
    gl.createProgram()

  if (!program) {
    throw new Error(
      'Could not create WebGL program.',
    )
  }

  const vertexShader =
    compileShader(
      gl,
      gl.VERTEX_SHADER,
      vertex,
    )

  const fragmentShader =
    compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragment,
    )

  gl.attachShader(
    program,
    vertexShader,
  )

  gl.attachShader(
    program,
    fragmentShader,
  )

  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (
    !gl.getProgramParameter(
      program,
      gl.LINK_STATUS,
    )
  ) {
    throw new Error(
      gl.getProgramInfoLog(program) ||
        'Program link failed.',
    )
  }

  return program
}

export function createTexture(
  gl: WebGL2RenderingContext,
) {
  const texture = gl.createTexture()

  if (!texture) {
    throw new Error(
      'Could not create texture.',
    )
  }

  gl.bindTexture(
    gl.TEXTURE_2D,
    texture,
  )

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR,
  )

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.LINEAR,
  )

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    gl.CLAMP_TO_EDGE,
  )

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_T,
    gl.CLAMP_TO_EDGE,
  )

  return texture
}

export function createTarget(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
): RenderTarget {
  const texture =
    createTexture(gl)

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  )

  const framebuffer =
    gl.createFramebuffer()

  if (!framebuffer) {
    throw new Error(
      'Could not create framebuffer.',
    )
  }

  gl.bindFramebuffer(
    gl.FRAMEBUFFER,
    framebuffer,
  )

  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )

  gl.bindFramebuffer(
    gl.FRAMEBUFFER,
    null,
  )

  return {
    texture,
    framebuffer,
    width,
    height,
  }
}

export function deleteTarget(
  gl: WebGL2RenderingContext,
  target?: RenderTarget,
) {
  if (!target) return

  gl.deleteTexture(target.texture)
  gl.deleteFramebuffer(
    target.framebuffer,
  )
}

export function clearTarget(
  gl: WebGL2RenderingContext,
  target: RenderTarget,
) {
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

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
}