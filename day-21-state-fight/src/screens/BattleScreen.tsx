/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { BattleHUD } from "../components/BattleHUD";
import { BattleReward } from "../components/BattleReward";
import { PowerClash } from "../components/PowerClash";
import { SourceDrawer } from "../components/SourceDrawer";
import { Stronghold } from "../components/Stronghold";
import { StatCharge } from "../components/StatCharge";
import { METRICS, getMetricValue } from "../data/metrics";
import { STATES_BY_ID } from "../data/states";
import { formatMetric } from "../lib/format";
import { resolveBattle } from "../lib/compare";
import type { ActiveRun } from "../types/game";
import { CampaignScreen } from "./CampaignScreen";

export function BattleScreen({ run, onPick, onFinish }: { run: ActiveRun; onPick: (id: string) => void; onFinish: () => void }) {
  const [selection, setSelection] = useState<string | null>(null);
  useEffect(() => setSelection(null), [run.index]);
  if (run.index >= run.deck.length) return <CampaignScreen onViewResults={onFinish} />;
  const battle = run.deck[run.index]; const a = STATES_BY_ID[battle.stateAId]; const b = STATES_BY_ID[battle.stateBId]; const metric = METRICS[battle.metricId];
  const result = selection ? resolveBattle(battle, selection, run.streak) : null;
  return <section className={`battle-screen tactical-grid ${result?.correct ? "battle-won" : result ? "battle-lost" : ""}`}><BattleHUD round={run.index + 1} total={run.deck.length} score={run.score} streak={run.streak} /><div className="battle-heading"><p className="eyebrow">{metric.battleName}{battle.final ? " // FINAL SIEGE" : ""}</p><h1>{metric.question}</h1><p className="metric-label">{metric.label} · {metric.reference}</p></div><div className="stronghold-pair"><Stronghold state={a} selected={selection === a.id} disabled={Boolean(selection)} onPick={() => setSelection(a.id)} /><span className="versus">VS</span><Stronghold state={b} selected={selection === b.id} disabled={Boolean(selection)} onPick={() => setSelection(b.id)} /></div>{result ? <div className={`battle-outcome ${result.correct ? "win" : "loss"}`}><StatCharge left={result.valueA} right={result.valueB} metricId={battle.metricId} /><PowerClash correct={result.correct} /><BattleReward correct={result.correct} score={result.score} winner={STATES_BY_ID[result.winnerId].name} onNext={() => onPick(selection!)} /></div> : <p className="source-line">Choose a stronghold to lock your answer.</p>}<SourceDrawer metric={metric} /><p className="sr-only">{formatMetric(getMetricValue(a, battle.metricId), battle.metricId)} compared with {formatMetric(getMetricValue(b, battle.metricId), battle.metricId)}</p></section>;
}
