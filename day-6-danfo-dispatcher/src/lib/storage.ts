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

  const records = [...existing, record]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  localStorage.setItem(
    KEY,
    JSON.stringify(records),
  );

  return records;
}

export function personalBest(
  records: RunRecord[],
) {
  return records[0] ?? null;
}