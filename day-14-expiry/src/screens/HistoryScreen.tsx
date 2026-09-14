import { useEffect, useState } from 'react'
import type { SecretRepository } from '../data/repository'
import type { HistoryRecord, SecretStatus } from '../domain/types'
import { effectiveStatus, expiryLabel } from '../domain/expiry'
import { navigate } from '../domain/routes'

export function HistoryScreen({ repository }: { repository: SecretRepository }) {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')
  useEffect(() => { void repository.listHistory().then(setRecords) }, [repository])
  const visible = records.filter((record) => filter === 'all' || (filter === 'active' ? effectiveStatus(record) === 'active' : effectiveStatus(record) !== 'active'))
  return <main className="workspace history-page"><div className="page-heading"><p className="eyebrow">YOUR PRIVATE ARCHIVE</p><h1>History</h1><p>Links you&apos;ve created. The records stay; the secrets don&apos;t.</p></div>
    <div className="filters" role="group" aria-label="Filter history">{(['all', 'active', 'expired'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
    <div className="history-list">{visible.length ? visible.map((record) => <article key={record.id}>
      <button className="history-main" onClick={() => navigate(`/history/${record.id}`)}><strong>{record.title}</strong><span>Created {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {expiryLabel(record)}</span></button>
      <Status status={effectiveStatus(record)} /><button className="row-action" onClick={() => navigate(`/history/${record.id}`)}>{effectiveStatus(record) === 'active' ? 'Share' : 'Create new'} →</button>
    </article>) : <div className="empty-state"><p>No {filter === 'all' ? '' : filter} links yet.</p><button onClick={() => navigate('/')}>Create a private link</button></div>}</div>
  </main>
}

export function Status({ status }: { status: SecretStatus }) { return <span className={`status ${status}`}><i />{status === 'active' ? 'Active' : 'Expired'}</span> }
