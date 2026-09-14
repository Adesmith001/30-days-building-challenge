import { useEffect, useRef, useState } from 'react'
import type { SecretRepository } from '../data/repository'
import { decryptSecret } from '../domain/crypto'
import { navigate } from '../domain/routes'

export function RevealScreen({ id, repository }: { id: string; repository: SecretRepository }) {
  const [state, setState] = useState<'ready' | 'loading' | 'revealed' | 'gone'>('ready')
  const [message, setMessage] = useState('')
  const protectedRef = useRef<HTMLPreElement>(null)
  useEffect(() => () => setMessage(''), [])
  async function reveal() {
    setState('loading')
    try {
      const key = window.location.hash.slice(1)
      if (!key) throw new Error('missing')
      const payload = await repository.reveal(id)
      setMessage(await decryptSecret(payload, key)); setState('revealed')
    } catch { setState('gone') }
  }
  const block = (event: React.SyntheticEvent) => event.preventDefault()
  if (state === 'gone') return <main className="recipient-page"><div className="recipient-brand">Expiry<span className="mark">.</span></div><section className="gone"><p className="gone-icon">⌁</p><p className="eyebrow">NOTHING REMAINS</p><h1>This message is gone.</h1><p>It expired, was already opened, or never existed.</p><button className="secondary" onClick={() => navigate('/')}>Create your own</button></section></main>
  return <main className="recipient-page"><div className="recipient-brand">Expiry<span className="mark">.</span></div><section className={`reveal-card ${state}`}><p className="lock-icon">◇</p><p className="eyebrow">PRIVATE MESSAGE</p>
    {state === 'revealed' ? <><h1>For your eyes, right now.</h1><pre ref={protectedRef} tabIndex={0} onCopy={block} onCut={block} onContextMenu={block} onDragStart={block} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') event.preventDefault() }}>{message}</pre><div className="expired-rule" /><h2>This message has now expired.</h2><p>You won&apos;t be able to open this link again. Copy protection is a deterrent, not a guarantee.</p></> : <><h1>Someone sent you something that won&apos;t stay here.</h1><p>This message disappears after you reveal it.</p><button className="primary" disabled={state === 'loading'} onClick={() => void reveal()}>{state === 'loading' ? 'Revealing…' : 'Reveal message'} <span>→</span></button><small>You won&apos;t be able to reveal this one-view message again.</small></>}
  </section></main>
}
