import { describe, expect, it } from 'vitest'
import { average, median, roundMetric } from './statistics'

describe('statistics helpers', () => {
  it('calculates average and median without mutating input', () => {
    const values = [9, 1, 5, 3]
    expect(average(values)).toBe(4.5)
    expect(median(values)).toBe(4)
    expect(values).toEqual([9, 1, 5, 3])
  })

  it('rounds metrics to requested precision', () => {
    expect(roundMetric(12.345, 2)).toBe(12.35)
  })
})
