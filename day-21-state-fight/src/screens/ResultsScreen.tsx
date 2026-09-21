import type { RunResults } from "../types/game";
import { ShareCard } from "../components/ShareCard";

export function ResultsScreen({ results, onHome, onRetry }: { results: RunResults; onHome: () => void; onRetry: () => void }) {
  const { summary } = results;
  return <section className="screen results-screen centre"><p className="eyebrow">OPERATION COMPLETE</p><h1>{summary.score.toLocaleString()} <em>POINTS</em></h1><p>{summary.wins}/{summary.totalBattles} battles won · {summary.bestStreak} best streak</p><div className="result-stats"><span>+{summary.trophies} TROPHIES</span><span>{summary.newStates} NEW STRONGHOLDS</span></div><div className="home-actions"><button className="primary-button" onClick={onRetry}>FIGHT AGAIN</button><ShareCard summary={summary} /><button className="secondary-button" onClick={onHome}>RETURN TO BASE</button></div></section>;
}
