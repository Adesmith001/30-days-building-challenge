import { describe, expect, it } from 'vitest'
import { hashIdentifier, normalizeIp } from '../api/_lib/rateLimit'
import { validateEncryptedInput } from '../api/_lib/validation'

describe('server trust boundaries', () => {
  it('normalizes and irreversibly hashes the first forwarded IP', () => {
    expect(normalizeIp(' 203.0.113.7, 10.0.0.1 ')).toBe('203.0.113.7')
    const hash = hashIdentifier('203.0.113.7', 'a-long-random-secret')
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    expect(hash).not.toContain('203.0.113.7')
  })

  it('accepts encrypted fields and rejects plaintext or key fields', () => {
    const valid = { title: 'Wi-Fi', ciphertext: 'abc_DEF-123', iv: 'abc_DEF-123', expiryType: 'after_opening', expiresAt: null, maxViews: 1 }
    expect(validateEncryptedInput(valid)).toMatchObject(valid)
    expect(() => validateEncryptedInput({ ...valid, plaintext: 'secret' })).toThrow('Unexpected field')
    expect(() => validateEncryptedInput({ ...valid, key: 'browser-key' })).toThrow('Unexpected field')
  })
})
