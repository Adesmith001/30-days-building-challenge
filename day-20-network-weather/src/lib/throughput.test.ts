import { describe, expect, it } from 'vitest'
import { measureAdaptiveTransfer } from './throughput'

describe('measureAdaptiveTransfer', () => {
  it('aggregates transfers until the target duration is reached', async () => {
    const requestedSizes: number[] = []
    const result = await measureAdaptiveTransfer(
      async (size) => {
        requestedSizes.push(size)
        return { bytes: size, durationMs: 1_000 }
      },
      { initialBytes: 64_000, maxChunkBytes: 256_000, targetDurationMs: 3_000, maxBytes: 1_000_000 },
    )

    expect(requestedSizes).toEqual([64_000, 128_000, 256_000])
    expect(result.bytes).toBe(448_000)
    expect(result.mbps).toBe(1.2)
  })

  it('stops after one transfer when a slow connection exceeds the target duration', async () => {
    let requests = 0
    const result = await measureAdaptiveTransfer(
      async (size) => {
        requests += 1
        return { bytes: size, durationMs: 7_000 }
      },
      { initialBytes: 64_000, maxChunkBytes: 256_000, targetDurationMs: 4_000, maxBytes: 1_000_000 },
    )

    expect(requests).toBe(1)
    expect(result.mbps).toBe(0.1)
  })
})
