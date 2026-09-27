import { describe, expect, it } from 'vitest'

import {
  getBrushStyle,
  getBrushSettings,
  getCanvasPoint,
} from './drawing'

describe('getCanvasPoint', () => {
  it('maps a pointer event into canvas pixels', () => {
    const canvas = {
      width: 800,
      height: 450,
      getBoundingClientRect: () => ({
        left: 100,
        top: 50,
        width: 400,
        height: 225,
      }),
    } as HTMLCanvasElement

    expect(
      getCanvasPoint(canvas, 300, 162.5),
    ).toEqual({ x: 400, y: 225 })
  })

  it('uses the selected color for the stroke and glow', () => {
    expect(getBrushStyle('#65e8ff')).toEqual({
      strokeStyle: '#65e8ff',
      shadowColor: '#65e8ff',
    })
  })

  it('returns the selected brush stroke settings', () => {
    expect(getBrushSettings('bold')).toEqual({
      widthScale: 1 / 70,
      shadowBlur: 28,
    })
  })
})
