import { describe, expect, it } from 'vitest'
import { decryptSecret, encryptSecret } from '../src/domain/crypto'

describe('browser encryption', () => {
  it('round trips unicode text with URL-safe values', async () => {
    const encrypted = await encryptSecret('coffee-before-code ☕')
    expect(encrypted.key).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(encrypted.iv).toMatch(/^[A-Za-z0-9_-]+$/)
    await expect(decryptSecret(encrypted, encrypted.key)).resolves.toBe('coffee-before-code ☕')
  })

  it('rejects a different key without leaking crypto errors', async () => {
    const first = await encryptSecret('private')
    const second = await encryptSecret('other')
    await expect(decryptSecret(first, second.key)).rejects.toThrow('Unable to decrypt this message')
  })
})
