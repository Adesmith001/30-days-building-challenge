import { describe, expect, it } from 'vitest'
import { networkTestErrorMessage, resolveNetworkApiBase } from './networkApi'

describe('resolveNetworkApiBase', () => {
  it('rejects same-machine measurements during local development', () => {
    expect(() => resolveNetworkApiBase(undefined, 'http://localhost:5173')).toThrow(
      'Configure VITE_NETWORK_TEST_API_BASE_URL',
    )
  })

  it('rejects private-network development origins', () => {
    expect(() => resolveNetworkApiBase(undefined, 'http://192.168.1.20:5173')).toThrow(
      'Configure VITE_NETWORK_TEST_API_BASE_URL',
    )
  })

  it('uses a configured remote measurement origin without a trailing slash', () => {
    expect(resolveNetworkApiBase('https://network-test.example/', 'http://localhost:5173')).toBe(
      'https://network-test.example',
    )
  })

  it('uses the current origin when the app is already deployed remotely', () => {
    expect(resolveNetworkApiBase(undefined, 'https://network-weather.example')).toBe(
      'https://network-weather.example',
    )
  })
})

describe('networkTestErrorMessage', () => {
  it('keeps actionable measurement errors', () => {
    expect(networkTestErrorMessage(new Error('Remote measurement API is unavailable.'))).toBe(
      'Remote measurement API is unavailable.',
    )
  })

  it('uses a safe fallback for unknown failures', () => {
    expect(networkTestErrorMessage(null)).toBe('The network scan could not complete. Try again shortly.')
  })
})
