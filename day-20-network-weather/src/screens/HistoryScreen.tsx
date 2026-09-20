import type { NetworkSnapshot } from '../types/network'
import { WeatherScene } from '../components/WeatherScene'

export function HistoryScreen({ snapshots, onClear }: { snapshots: NetworkSnapshot[]; onClear: () => void }) {
  return <main className="history-screen page-shell"><div className="section-heading"><span className="eyebrow">LOCAL HISTORY</span><h1>What changed<br /><em>over time?</em></h1><p>Saved only in this browser. Nothing leaves your device.</p></div>{snapshots.length ? <div className="history-list">{snapshots.map((snapshot) => <article className="history-item" key={snapshot.id}><WeatherScene weather={snapshot.weather} compact /><div><strong>{new Date(snapshot.measuredAt).toLocaleString()}</strong><span>{snapshot.kind.toUpperCase()} · {snapshot.metrics.medianLatencyMs}ms median · {snapshot.metrics.failedProbes} failed</span></div></article>)}</div> : <div className="empty-state">No saved checks yet.<br />Run a scan and save the result here.</div>}<button className="text-cta" onClick={onClear} disabled={!snapshots.length}>Clear history</button></main>
}
