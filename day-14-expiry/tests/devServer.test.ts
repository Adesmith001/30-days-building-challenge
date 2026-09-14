import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('local development server', () => {
  it('runs the frontend and API functions together', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }
    expect(packageJson.scripts.dev).toBe('vercel dev --listen 5173')
  })
})
