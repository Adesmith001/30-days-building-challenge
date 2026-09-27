export type ExportRatio =
  | 'original'
  | '1:1'
  | '9:16'
  | '16:9'

function canvasBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 0.95,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(
          new Error(
            'Could not create image.',
          ),
        )
      },
      type,
      quality,
    )
  })
}

export function getCropRect(
  width: number,
  height: number,
  ratio: ExportRatio,
) {
  if (ratio === 'original') {
    return {
      x: 0,
      y: 0,
      width,
      height,
    }
  }

  const target =
    ratio === '1:1'
      ? 1
      : ratio === '9:16'
        ? 9 / 16
        : 16 / 9

  const source = width / height

  if (source > target) {
    const nextWidth = height * target

    return {
      x: (width - nextWidth) / 2,
      y: 0,
      width: nextWidth,
      height,
    }
  }

  const nextHeight = width / target

  return {
    x: 0,
    y: (height - nextHeight) / 2,
    width,
    height: nextHeight,
  }
}

export async function exportCanvas(
  source: HTMLCanvasElement,
  ratio: ExportRatio = 'original',
  overlay?: HTMLCanvasElement,
) {
  if (ratio === 'original' && !overlay) {
    return canvasBlob(source)
  }

  const crop = getCropRect(
    source.width,
    source.height,
    ratio,
  )

  const output =
    document.createElement('canvas')

  if (ratio === 'original') {
    output.width = source.width
    output.height = source.height
  } else {
    const targetRatio =
      ratio === '1:1'
        ? 1
        : ratio === '9:16'
          ? 9 / 16
          : 16 / 9

    const longest = 1600

    if (targetRatio >= 1) {
      output.width = longest
      output.height = Math.round(
        longest / targetRatio,
      )
    } else {
      output.height = longest
      output.width = Math.round(
        longest * targetRatio,
      )
    }
  }

  const ctx = output.getContext('2d')

  if (!ctx) {
    throw new Error(
      'Canvas export is unavailable.',
    )
  }

  ctx.drawImage(
    source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    output.width,
    output.height,
  )

  if (overlay) {
    ctx.drawImage(
      overlay,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      output.width,
      output.height,
    )
  }

  return canvasBlob(output)
}

export function downloadBlob(
  blob: Blob,
  filename: string,
) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1500)
}

export async function shareBlob(
  blob: Blob,
  filename: string,
) {
  const file = new File(
    [blob],
    filename,
    {
      type: blob.type,
    },
  )

  const payload = {
    files: [file],
    title: 'Light Painter',
  }

  if (
    navigator.share &&
    navigator.canShare?.(payload)
  ) {
    await navigator.share(payload)
    return true
  }

  return false
}

export function imageFilename() {
  return `light-painter-${Date.now()}.png`
}

export function videoFilename() {
  return `light-painter-${Date.now()}.webm`
}
