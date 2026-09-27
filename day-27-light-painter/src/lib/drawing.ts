export function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect()

  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  }
}

export function getBrushStyle(color: string) {
  return {
    strokeStyle: color,
    shadowColor: color,
  }
}

export type BrushPreset = 'fine' | 'bold' | 'soft'

export function getBrushSettings(preset: BrushPreset) {
  if (preset === 'bold') {
    return { widthScale: 1 / 70, shadowBlur: 28 }
  }

  if (preset === 'soft') {
    return { widthScale: 1 / 120, shadowBlur: 38 }
  }

  return { widthScale: 1 / 180, shadowBlur: 18 }
}


