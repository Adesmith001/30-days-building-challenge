import { useState } from 'react'
import type { ReadyInfo } from './CreateScreen'

export function ReadyScreen({ info, demo, onAnother }: { info: ReadyInfo; demo: boolean; onAnother(): void }) {
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)
  async function share() {
    if (navigator.share) return navigator.share({ title: info.title, text: 'A private message was shared with you.', url: info.url })
    setShown(true)
  }
  async function copy() { await navigator.clipboard.writeText(info.url); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
  return <main className="workspace ready-page">
    <p className="ready-seal" aria-hidden="true">✓</p><p className="eyebrow">LINK CREATED</p><h1>Your link is ready.</h1><p className="ready-title">{info.title}</p>
    <p>{info.afterOpening ? 'This message disappears after it is opened.' : 'This message disappears when its time runs out.'}</p>
    <div className="link-box"><span data-testid="share-link">{shown ? info.url : info.url.replace(/#.+$/u, '#••••••••••••')}</span><button onClick={() => setShown(!shown)}>{shown ? 'Hide' : 'Show link'}</button></div>
    <button className="primary" onClick={() => void share()}>Share link <span>↗</span></button>
    {shown && <button className="secondary" onClick={() => void copy()}>{copied ? 'Link copied' : 'Copy shown link'}</button>}
    <p className="warning"><span>!</span> Opening this link will consume the message.</p>
    {demo && <p className="demo-banner">This-browser demo link — it only works in this browser profile.</p>}
    <button className="text-button" onClick={onAnother}>Create another</button>
  </main>
}
