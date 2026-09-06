import { getRank } from "./ranks";
import { efficiency } from "./scoring";
import type {
  GameState,
  RunRecord,
} from "../types/game";

const KEY = "danfo-dispatcher-records-v1";

export function loadRecords(): RunRecord[] {
  try {
    const raw = localStorage.getItem(KEY);

    if (!raw) return [];

    return JSON.parse(raw) as RunRecord[];
  } catch {
    return [];
  }
}

export function saveRun(
  state: GameState,
): RunRecord[] {
  const existing = loadRecords();

  if (
    existing.some(
      (record) => record.runId === state.runId,
    )
  ) {
    return existing;
  }

  const record: RunRecord = {
    runId: state.runId,
    difficulty: state.difficulty,
    date: new Date().toISOString(),
    score: state.score,
    delivered: state.stats.delivered,
    lost: state.stats.lost,
    bestFlow: state.stats.bestFlow,
    shift: state.shift,
    efficiency: efficiency(
      state.stats.delivered,
      state.stats.spawned,
    ),
    rank: getRank(state.score).name,
  };

  const ranked = [...existing, record].sort((a, b) => b.score - a.score);
  const records = (["standard", "relaxed"] as const).flatMap((mode) =>
    ranked.filter((item) => (item.difficulty ?? "standard") === mode).slice(0, 20),
  ).sort((a, b) => b.score - a.score);

  try { localStorage.setItem(KEY, JSON.stringify(records)); } catch { /* Keep the current run available when browser storage is full or disabled. */ }

  return records;
}

export function personalBest(
  records: RunRecord[],
) {
  return records[0] ?? null;
}
