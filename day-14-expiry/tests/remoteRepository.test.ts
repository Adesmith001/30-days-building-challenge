import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRemoteRepository } from '../src/data/remoteRepository'

describe('remote repository', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('rejects a successful response that is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<!doctype html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })))
    const repository = createRemoteRepository(async () => 'token')
    await expect(repository.listHistory()).rejects.toThrow('Unexpected response from the server.')
  })
})
