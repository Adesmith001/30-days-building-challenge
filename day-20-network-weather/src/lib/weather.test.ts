import { describe, expect, it } from 'vitest'
import { classifyNetworkWeather } from './weather'

describe('classifyNetworkWeather', () => {
  it('maps stable metrics to clear', () => {
    expect(classifyNetworkWeather({ medianLatencyMs: 31, jitterMs: 4, failedProbes: 0, totalProbes: 12 })).toBe('clear')
  })

  it('maps elevated latency to cloudy', () => {
    expect(classifyNetworkWeather({ medianLatencyMs: 85, jitterMs: 8, failedProbes: 0, totalProbes: 12 })).toBe('cloudy')
  })

  it('maps failures and severe jitter to rain and storm', () => {
    expect(classifyNetworkWeather({ medianLatencyMs: 42, jitterMs: 8, failedProbes: 1, totalProbes: 12 })).toBe('rain')
    expect(classifyNetworkWeather({ medianLatencyMs: 45, jitterMs: 70, failedProbes: 0, totalProbes: 12 })).toBe('storm')
  })

  it('maps total probe failure to offline', () => {
    expect(classifyNetworkWeather({ medianLatencyMs: 0, jitterMs: 0, failedProbes: 12, totalProbes: 12 })).toBe('offline')
  })
})
