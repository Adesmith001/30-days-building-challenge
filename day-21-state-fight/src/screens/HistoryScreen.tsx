import { formatDate } from "../lib/format";
import type { ProgressData } from "../types/game";

export function HistoryScreen({ progress, onBack }: { progress: ProgressData; onBack: () => void }) {
  return <section className="screen"><button className="back-button" onClick={onBack}>← BASE</button><p className="eyebrow">ARCHIVE</p><h1>BATTLE HISTORY</h1>{progress.history.length ? <div className="history-list">{progress.history.map((run) => <article key={run.id}><strong>{run.mode.toUpperCase()}</strong><span>{run.score.toLocaleString()} pts · {run.wins}/{run.totalBattles}</span><small>{formatDate(new Date(run.date))}</small></article>)}</div> : <p className="empty-copy">No battle records yet. Your first campaign starts the archive.</p>}</section>;
}
