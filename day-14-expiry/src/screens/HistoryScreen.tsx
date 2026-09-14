import { useEffect, useState } from 'react'
import type { SecretRepository } from '../data/repository'
import type { HistoryRecord, SecretStatus } from '../domain/types'
import { effectiveStatus, expiryLabel } from '../domain/expiry'
import { navigate } from '../domain/routes'

export function HistoryScreen({ repository }: { repository: SecretRepository }) {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    void repository.listHistory()
      .then((nextRecords) => { if (active) setRecords(nextRecords) })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'History could not be loaded.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [repository, attempt])
  const visible = records.filter((record) => filter === 'all' || (filter === 'active' ? effectiveStatus(record) === 'active' : effectiveStatus(record) !== 'active'))
  return <main className="workspace history-page"><div className="page-heading"><p className="eyebrow">YOUR PRIVATE ARCHIVE</p><h1>History</h1><p>Links you&apos;ve created. The records stay; the secrets don&apos;t.</p></div>
    {!loading && !error && records.length > 0 ? <div className="filters" role="group" aria-label="Filter history">{(['all', 'active', 'expired'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div> : null}
    <div className="history-list">{loading ? <div className="empty-state"><p>Loading history…</p></div> : error ? <div className="empty-state"><span className="empty-state-mark" aria-hidden="true">!</span><h2>History is unavailable.</h2><p>{error}</p><button onClick={() => setAttempt((value) => value + 1)}>Try again</button></div> : visible.length ? visible.map((record) => <article key={record.id}>
      <button className="history-main" onClick={() => navigate(`/history/${record.id}`)}><strong>{record.title}</strong><span>Created {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {expiryLabel(record)}</span></button>
      <Status status={effectiveStatus(record)} /><button className="row-action" onClick={() => navigate(`/history/${record.id}`)}>{effectiveStatus(record) === 'active' ? 'Share' : 'Create new'} →</button>
    </article>) : filter === 'all' ? <div className="empty-state"><span className="empty-state-mark" aria-hidden="true">0</span><h2>Nothing here yet.</h2><p>Create your first private link and its lifecycle will appear here.</p><button onClick={() => navigate('/')}>Create a private link</button></div> : <div className="empty-state"><h2>No {filter} links.</h2><p>Try another filter or create a new private link.</p><button onClick={() => setFilter('all')}>View all links</button></div>}</div>
  </main>
}

export function Status({ status }: { status: SecretStatus }) { return <span className={`status ${status}`}><i />{status === 'active' ? 'Active' : 'Expired'}</span> }
