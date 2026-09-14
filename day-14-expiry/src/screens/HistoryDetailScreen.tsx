import { useEffect, useState } from 'react'
import type { SecretRepository } from '../data/repository'
import type { HistoryRecord } from '../domain/types'
import { effectiveStatus, expiryLabel } from '../domain/expiry'
import { navigate } from '../domain/routes'
import { Status } from './HistoryScreen'
import { forgetLink, loadLink } from '../data/linkVault'

export function HistoryDetailScreen({ id, repository, onRecreate }: { id: string; repository: SecretRepository; onRecreate(title: string): void }) {
  const [record, setRecord] = useState<HistoryRecord | null | undefined>()
  const [notice, setNotice] = useState('')
  useEffect(() => { void repository.getHistory(id).then(setRecord) }, [id, repository])
  if (record === undefined) return <main className="workspace"><p>Loading…</p></main>
  if (!record) return <main className="workspace gone"><h1>History not found.</h1><button onClick={() => navigate('/history')}>Back to history</button></main>
  const status = effectiveStatus(record)
  const active = status === 'active'
  const savedLink = active ? loadLink(record.secretId) : null
  async function share() {
    if (!savedLink) return
    if (navigator.share) await navigator.share({ title: record!.title, text: 'A private message was shared with you.', url: savedLink })
    else { await navigator.clipboard.writeText(savedLink); setNotice('Link copied for sharing.') }
  }
  async function destroy() { await repository.destroy(record!.id); forgetLink(record!.secretId); setRecord({ ...record!, status: 'destroyed' }) }
  async function remove() { await repository.deleteHistory(record!.id); forgetLink(record!.secretId); navigate('/history') }
  return <main className="workspace detail-page"><button className="back" onClick={() => navigate('/history')}>← History</button><div className="detail-title"><div><p className="eyebrow">PRIVATE LINK</p><h1>{record.title}</h1></div><Status status={status} /></div>
    <dl><div><dt>Created</dt><dd>{new Date(record.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</dd></div><div><dt>Expires</dt><dd>{expiryLabel(record)}</dd></div><div><dt>Views</dt><dd>{record.viewCount}{record.maxViews ? ` / ${record.maxViews}` : ''}</dd></div></dl>
    {active ? <><div className="detail-callout"><span>Encrypted link</span><code>/s/{record.secretId}#••••••••</code>{savedLink ? <><button className="primary" onClick={() => void share()}>Share link <span>↗</span></button>{notice && <p role="status">{notice}</p>}</> : <p>The encryption key is not stored in history. Share the original link from the device that created it.</p>}</div><section className="danger-zone"><h2>Danger zone</h2><p>Destroy the secret immediately. Its history will remain.</p><button className="danger" onClick={() => void destroy()}>Destroy now</button></section></> : <><div className="expired-note"><h2>This message no longer exists.</h2><p>Its history remains, but its contents cannot be recovered.</p></div><button className="primary" onClick={() => onRecreate(record.title)}>Create new link</button><button className="danger-link" onClick={() => void remove()}>Delete from history</button></>}
  </main>
}
