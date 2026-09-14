import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../src/auth/AuthProvider', () => ({
  useAuth: () => ({
    user: {
      email: 'creator@example.com',
      user_metadata: { full_name: 'Sam Taylor', avatar_url: 'https://example.com/avatar.jpg' },
    },
    signOut: vi.fn(),
  }),
}))

import { AppHeader } from '../src/components/AppHeader'

describe('AppHeader', () => {
  it('shows the signed-in user image in the account control', () => {
    render(<AppHeader page="create" />)
    expect(screen.getByRole('img', { name: 'Sam Taylor' })).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })
})
