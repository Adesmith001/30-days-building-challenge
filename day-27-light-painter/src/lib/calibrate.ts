const WIDTH = 160
const HEIGHT = 90

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(max, Math.max(min, value))
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export interface CalibrationResult {
  brightnessThreshold: number
  motionThreshold: number
}

export async function calibrateVideo(
  video: HTMLVideoElement,
): Promise<CalibrationResult> {
  const canvas = document.createElement('canvas')

  canvas.width = WIDTH
  canvas.height = HEIGHT

  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
  })

  if (!ctx) {
    return {
      brightnessThreshold: 0.52,
      motionThreshold: 0.075,
    }
  }

  let previous: Uint8ClampedArray | null = null

  const luminances: number[] = []
  const motionValues: number[] = []

  for (let sample = 0; sample < 10; sample += 1) {
    ctx.drawImage(
      video,
      0,
      0,
      WIDTH,
      HEIGHT,
    )

    const image = ctx.getImageData(
      0,
      0,
      WIDTH,
      HEIGHT,
    )

    let lumSum = 0
    let motionSum = 0

    for (
      let index = 0;
      index < image.data.length;
      index += 4
    ) {
      const r = image.data[index] / 255
      const g = image.data[index + 1] / 255
      const b = image.data[index + 2] / 255

      const lum =
        r * 0.2126 +
        g * 0.7152 +
        b * 0.0722

      lumSum += lum

      if (previous) {
        motionSum +=
          Math.abs(
            image.data[index] -
              previous[index],
          ) /
          255
      }
    }

    const pixelCount = WIDTH * HEIGHT

    luminances.push(lumSum / pixelCount)

    if (previous) {
      motionValues.push(
        motionSum / pixelCount,
      )
    }

    previous = new Uint8ClampedArray(
      image.data,
    )

    await wait(90)
  }

  const meanLum =
    luminances.reduce(
      (sum, value) => sum + value,
      0,
    ) / luminances.length

  const variance =
    luminances.reduce(
      (sum, value) =>
        sum +
        Math.pow(value - meanLum, 2),
      0,
    ) / luminances.length

  const deviation = Math.sqrt(variance)

  const meanMotion =
    motionValues.length > 0
      ? motionValues.reduce(
          (sum, value) => sum + value,
          0,
        ) / motionValues.length
      : 0.02

  return {
    brightnessThreshold: clamp(
      meanLum +
        Math.max(
          0.18,
          deviation * 3.4,
        ),
      0.27,
      0.76,
    ),
    motionThreshold: clamp(
      meanMotion * 2.6 + 0.035,
      0.04,
      0.18,
    ),
  }
}