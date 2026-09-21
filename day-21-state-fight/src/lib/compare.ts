import { METRICS, getMetricValue } from "../data/metrics";
import { STATES_BY_ID } from "../data/states";
import type { Battle, BattleResult } from "../types/game";

export function getWinner(battle: Battle) {
  const metric = METRICS[battle.metricId];
  const a = getMetricValue(STATES_BY_ID[battle.stateAId], battle.metricId);
  const b = getMetricValue(STATES_BY_ID[battle.stateBId], battle.metricId);
  return (metric.higherWins ? a >= b : a <= b) ? battle.stateAId : battle.stateBId;
}

export function resolveBattle(battle: Battle, playerPick: string, streak: number): BattleResult {
  const stateA = STATES_BY_ID[battle.stateAId];
  const stateB = STATES_BY_ID[battle.stateBId];
  const valueA = getMetricValue(stateA, battle.metricId);
  const valueB = getMetricValue(stateB, battle.metricId);
  const winnerId = getWinner(battle);
  const correct = playerPick === winnerId;
  const base = battle.difficulty === "hard" ? 750 : battle.difficulty === "medium" ? 500 : 300;
  const streakBonus = correct ? Math.min(streak * 50, 500) : 0;
  const score = correct ? base + streakBonus : 0;
  const marginPercent = Math.round((Math.abs(valueA - valueB) / Math.max(valueA, valueB)) * 100);

  return {
    battleId: battle.id, stateAId: battle.stateAId, stateBId: battle.stateBId, metricId: battle.metricId,
    playerPick, winnerId, correct, difficulty: battle.difficulty, score, trophies: correct ? 1 : 0,
    streakBonus, marginPercent, valueA, valueB,
  };
}
