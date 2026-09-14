import { describe, expect, it } from 'vitest'
import { createDemoRepository } from '../src/data/demoRepository'
import type { EncryptedSecretInput } from '../src/domain/types'

function memoryStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() { return values.size },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key) },
    setItem: (key, value) => { values.set(key, value) },
  }
}

const base: EncryptedSecretInput = {
  title: 'Apartment Wi-Fi', ciphertext: 'cipher', iv: 'iv', expiryType: 'after_opening', expiresAt: null, maxViews: 1,
}

describe('demo repository', () => {
  it('reveals an after-opening secret only once while retaining history', async () => {
    const repo = createDemoRepository(memoryStorage(), () => new Date('2026-09-14T12:00:00Z'))
    const created = await repo.create(base)
    await expect(repo.reveal(created.secretId)).resolves.toMatchObject({ ciphertext: 'cipher' })
    await expect(repo.reveal(created.secretId)).rejects.toThrow('This message is unavailable')
    await expect(repo.getHistory(created.historyId)).resolves.toMatchObject({ status: 'consumed', viewCount: 1 })
  })

  it('leaves a time-based secret active before its deadline', async () => {
    const repo = createDemoRepository(memoryStorage(), () => new Date('2026-09-14T12:00:00Z'))
    const created = await repo.create({ ...base, expiryType: 'time', maxViews: null, expiresAt: '2026-09-14T13:00:00Z' })
    await repo.reveal(created.secretId)
    await expect(repo.getHistory(created.historyId)).resolves.toMatchObject({ status: 'active', viewCount: 1 })
  })

  it('expires, destroys, and deletes without restoring content', async () => {
    const storage = memoryStorage()
    let now = new Date('2026-09-14T12:00:00Z')
    const repo = createDemoRepository(storage, () => now)
    const elapsed = await repo.create({ ...base, expiryType: 'time', maxViews: null, expiresAt: '2026-09-14T12:01:00Z' })
    now = new Date('2026-09-14T12:02:00Z')
    await expect(repo.reveal(elapsed.secretId)).rejects.toThrow('This message is unavailable')
    await expect(repo.getHistory(elapsed.historyId)).resolves.toMatchObject({ status: 'expired', title: base.title })
    const active = await repo.create(base)
    await repo.destroy(active.historyId)
    await expect(repo.getHistory(active.historyId)).resolves.toMatchObject({ status: 'destroyed' })
    await repo.deleteHistory(active.historyId)
    await expect(repo.getHistory(active.historyId)).resolves.toBeNull()
  })
})
