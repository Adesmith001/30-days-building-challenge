import { useState, type FormEvent } from 'react'
import { encryptSecret } from '../domain/crypto'
import { resolveExpiry } from '../domain/expiry'
import type { ExpiryChoice } from '../domain/types'
import { validateCreateInput, type CreateErrors } from '../domain/validation'
import type { SecretRepository } from '../data/repository'
import { rememberLink } from '../data/linkVault'
import { config } from '../lib/config'

export type ReadyInfo = { title: string; url: string; afterOpening: boolean }

export function CreateScreen({ repository, initialTitle = '', onReady }: { repository: SecretRepository; initialTitle?: string; onReady(info: ReadyInfo): void }) {
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState(initialTitle)
  const [expiry, setExpiry] = useState<ExpiryChoice>({ kind: 'after_opening' })
  const [customAt, setCustomAt] = useState('')
  const [errors, setErrors] = useState<CreateErrors>({})
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    const choice: ExpiryChoice = expiry.kind === 'custom' ? { kind: 'custom', at: customAt } : expiry
    const nextErrors = validateCreateInput({ title, message, expiry: choice })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setBusy(true)
    try {
      const encrypted = await encryptSecret(message)
      const resolved = resolveExpiry(choice)
      const created = await repository.create({ title: title.trim(), ciphertext: encrypted.ciphertext, iv: encrypted.iv, ...resolved })
      const url = `${config.appUrl}/s/${created.secretId}#${encrypted.key}`
      rememberLink(created.secretId, url)
      onReady({ title: title.trim(), url, afterOpening: resolved.expiryType === 'after_opening' })
    } catch (reason) { setErrors({ message: reason instanceof Error ? reason.message : 'Could not create this link.' }) } finally { setBusy(false) }
  }
  return <main className="workspace create-workspace">
    <div className="intro"><p className="eyebrow">NEW PRIVATE LINK</p><h1>Share something<br />that shouldn&apos;t live forever.</h1><p>Create a private message that disappears when you&apos;re done.</p></div>
    <form className="composer" onSubmit={submit}>
      <label className="sr-only" htmlFor="message">Private message</label>
      <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={10_000} placeholder="Write something private…" aria-describedby="message-meta" />
      <div id="message-meta" className="field-meta"><span className="error">{errors.message}</span><span>{message.length.toLocaleString()} / 10,000</span></div>
      <div className="field-grid">
        <label>Give it a name<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Apartment Wi-Fi" />{errors.title && <span className="error">{errors.title}</span>}</label>
        <label>Expires<select value={expiry.kind === 'duration' ? String(expiry.minutes) : expiry.kind} onChange={(event) => {
          const value = event.target.value
          setExpiry(value === 'after_opening' ? { kind: 'after_opening' } : value === 'custom' ? { kind: 'custom', at: customAt } : { kind: 'duration', minutes: Number(value) as 10 | 60 | 360 | 1440 | 4320 | 10080 })
        }}><option value="after_opening">After opening</option><option value="10">10 minutes</option><option value="60">1 hour</option><option value="360">6 hours</option><option value="1440">24 hours</option><option value="4320">3 days</option><option value="10080">7 days</option><option value="custom">Custom</option></select></label>
      </div>
      {expiry.kind === 'custom' && <label className="custom-date">Custom date and time<input type="datetime-local" value={customAt} onChange={(event) => setCustomAt(event.target.value)} />{errors.expiry && <span className="error">{errors.expiry}</span>}</label>}
      <button className="primary create-button" disabled={busy}>{busy ? 'Encrypting…' : 'Create private link'} <span>→</span></button>
      <p className="encryption-note"><span aria-hidden="true">◇</span> Encrypted in your browser. We never see your message.</p>
    </form>
  </main>
}
