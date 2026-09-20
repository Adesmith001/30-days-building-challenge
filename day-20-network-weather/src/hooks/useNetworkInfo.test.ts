import { describe, expect, it } from 'vitest'
import { formatNetworkSpeed } from './useNetworkInfo'

describe('formatNetworkSpeed', () => {
  it('formats a browser downlink estimate in Mbps', () => {
    expect(formatNetworkSpeed(12.34)).toBe('12.3 Mbps')
  })

  it('returns a fallback when the browser does not expose a speed', () => {
    expect(formatNetworkSpeed()).toBe('Unavailable')
  })
})
