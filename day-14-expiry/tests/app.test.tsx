import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../src/App'

describe('Expiry app', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('creates encrypted content and reveals it only after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Continue in demo mode/ }))
    await user.type(screen.getByLabelText('Private message'), 'coffee-before-code')
    await user.type(screen.getByLabelText('Give it a name'), 'Apartment Wi-Fi')
    await user.click(screen.getByRole('button', { name: /Create private link/ }))
    expect(await screen.findByRole('heading', { name: 'Your link is ready.' })).toBeVisible()
    expect(screen.queryByText('coffee-before-code')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show link' }))
    const link = screen.getByTestId('share-link').textContent ?? ''
    await act(async () => {
      window.history.replaceState({}, '', new URL(link).pathname + new URL(link).hash)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(await screen.findByRole('button', { name: /Reveal message/ })).toBeVisible()
    expect(screen.queryByText('coffee-before-code')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Reveal message/ }))
    expect(await screen.findByText('coffee-before-code')).toBeVisible()
  })

  it('shows an empty message when recreating from history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Continue in demo mode/ }))
    expect(screen.getByRole('heading', { name: /Share something/ })).toBeVisible()
  })
})
