import { useEffect, useState } from "react";
import { generateDeck } from "../lib/deck";
import { resolveBattle } from "../lib/compare";
import { defaultProgress, loadProgress, saveProgress } from "../lib/storage";
import type { ActiveRun, ProgressData, RunMode, RunResults } from "../types/game";

const runId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useGame() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);
  const [run, setRun] = useState<ActiveRun | null>(null);
  const [results, setResults] = useState<RunResults | null>(null);
  useEffect(() => saveProgress(progress), [progress]);
  const startRun = (mode: RunMode) => { const seed = mode === "daily" ? new Date().toISOString().slice(0, 10) : runId(); const count = mode === "daily" ? 5 : 10; setResults(null); setRun({ mode, deck: generateDeck(seed, mode, count), index: 0, score: 0, trophiesEarned: 0, wins: 0, streak: 0, bestStreak: 0, hardestWin: null, newDiscovered: [], results: [] }); };
  const finish = (finished = run) => { if (!finished) return; const summary = { id: runId(), date: new Date().toISOString(), mode: finished.mode, score: finished.score, wins: finished.wins, totalBattles: finished.results.length, trophies: finished.trophiesEarned, bestStreak: finished.bestStreak, hardestWin: null, newStates: finished.newDiscovered.length }; const next = { ...progress, trophies: progress.trophies + finished.trophiesEarned, discovered: [...new Set([...progress.discovered, ...finished.newDiscovered])], bestScore: Math.max(progress.bestScore, finished.score), bestStreak: Math.max(progress.bestStreak, finished.bestStreak), runsCompleted: progress.runsCompleted + 1, history: [summary, ...progress.history].slice(0, 20) }; setProgress(next); setResults({ summary, trophiesBefore: progress.trophies, trophiesAfter: next.trophies }); setRun(null); };
  const choose = (stateId: string) => { if (!run) return; const battle = run.deck[run.index]; const result = resolveBattle(battle, stateId, run.streak); const next = { ...run, index: run.index + 1, score: run.score + result.score, trophiesEarned: run.trophiesEarned + result.trophies, wins: run.wins + Number(result.correct), streak: result.correct ? run.streak + 1 : 0, bestStreak: Math.max(run.bestStreak, result.correct ? run.streak + 1 : 0), newDiscovered: result.correct && !progress.discovered.includes(result.winnerId) ? [...run.newDiscovered, result.winnerId] : run.newDiscovered, results: [...run.results, result] }; if (run.mode === "sudden" && !result.correct) finish(next); else setRun(next); };
  return { progress, run, results, startRun, choose, finish, setResults, updateSettings: (settings: ProgressData["settings"]) => setProgress({ ...progress, settings }), reset: () => setProgress(defaultProgress) };
}
