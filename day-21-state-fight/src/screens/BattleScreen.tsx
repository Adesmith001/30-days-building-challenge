import { BattleHUD } from "../components/BattleHUD";
import { Stronghold } from "../components/Stronghold";
import { StatCharge } from "../components/StatCharge";
import { METRICS, getMetricValue } from "../data/metrics";
import { STATES_BY_ID } from "../data/states";
import { formatMetric } from "../lib/format";
import type { ActiveRun } from "../types/game";

export function BattleScreen({ run, onPick, onFinish }: { run: ActiveRun; onPick: (id: string) => void; onFinish: () => void }) {
  if (run.index >= run.deck.length) return <section className="screen centre"><h1>CAMPAIGN SECURED</h1><button className="primary-button" onClick={onFinish}>VIEW RESULTS</button></section>;
  const battle = run.deck[run.index]; const a = STATES_BY_ID[battle.stateAId]; const b = STATES_BY_ID[battle.stateBId]; const metric = METRICS[battle.metricId];
  return <section className="battle-screen tactical-grid"><BattleHUD round={run.index + 1} total={run.deck.length} score={run.score} streak={run.streak} /><p className="eyebrow">{metric.battleName}{battle.final ? " // FINAL SIEGE" : ""}</p><h1>{metric.question}</h1><p className="metric-label">{metric.label} · {metric.reference}</p><div className="stronghold-pair"><Stronghold state={a} onPick={() => onPick(a.id)} /><span className="versus">VS</span><Stronghold state={b} onPick={() => onPick(b.id)} /></div><StatCharge left={getMetricValue(a, battle.metricId)} right={getMetricValue(b, battle.metricId)} metricId={battle.metricId} /><p className="source-line">Values reveal after each choice · <a href={metric.sourceUrl} target="_blank">source: {metric.sourceName}</a></p><p className="sr-only">{formatMetric(getMetricValue(a, battle.metricId), battle.metricId)} compared with {formatMetric(getMetricValue(b, battle.metricId), battle.metricId)}</p></section>;
}
