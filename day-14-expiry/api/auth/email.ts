import type { VercelRequest, VercelResponse } from '@vercel/node'
import { adminClient } from '../_lib/supabase.js'
import { body, fail, only, prepare } from '../_lib/http.js'
import { consumeLimit, ipBucket } from '../_lib/rateLimit.js'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  prepare(response); if (!only(request, response, 'POST')) return
  try {
    const client = adminClient()
    if (!await consumeLimit(client, response, ipBucket(request, 'auth'), 10, 900)) return
    const input = body(request) as { action?: string; email?: string; password?: string; redirectTo?: string }
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(input.email)) throw new Error('Enter a valid email address.')
    if (input.action === 'reset') {
      const { error } = await client.auth.resetPasswordForEmail(input.email, { redirectTo: input.redirectTo })
      if (error) throw error
      return response.status(200).json({ message: 'If that account exists, a reset link is on its way.' })
    }
    if (!input.password || input.password.length < 8) throw new Error('Use at least 8 characters.')
    const result = input.action === 'sign_up' ? await client.auth.signUp({ email: input.email, password: input.password, options: { emailRedirectTo: input.redirectTo?.replace('/reset-password', '') } }) : input.action === 'sign_in' ? await client.auth.signInWithPassword({ email: input.email, password: input.password }) : null
    if (!result) throw new Error('Invalid authentication action.')
    if (result.error) throw result.error
    response.status(200).json(result.data.session ? { accessToken: result.data.session.access_token, refreshToken: result.data.session.refresh_token } : { message: 'Check your email to confirm your account.' })
  } catch (reason) { fail(response, reason) }
}
