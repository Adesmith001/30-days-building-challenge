import type { CreateFormInput } from './types'

export type CreateErrors = Partial<Record<'title' | 'message' | 'expiry', string>>

export function validateCreateInput(input: CreateFormInput, now = new Date()): CreateErrors {
  const errors: CreateErrors = {}
  const title = input.title.trim()
  const message = input.message.trim()
  if (!title) errors.title = 'Give this message a name.'
  else if (title.length > 120) errors.title = 'Use 120 characters or fewer.'
  if (!message) errors.message = 'Write something private first.'
  else if (input.message.length > 10_000) errors.message = 'Use 10,000 characters or fewer.'
  if (input.expiry.kind === 'custom') {
    const at = new Date(input.expiry.at)
    if (!input.expiry.at || Number.isNaN(at.valueOf()) || at <= now) errors.expiry = 'Choose a future date and time.'
  }
  return errors
}

export function validateEmail(email: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? null : 'Enter a valid email address.'
}

export function validatePassword(password: string): string | null {
  return password.length >= 8 ? null : 'Use at least 8 characters.'
}
