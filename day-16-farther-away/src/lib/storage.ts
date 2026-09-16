import type {
  SavedComparison,
} from "../types/comparison";

const HISTORY_KEY =
  "farther-away-history-v1";

export function readHistory():
  SavedComparison[] {
  try {
    const raw =
      localStorage.getItem(
        HISTORY_KEY,
      );

    return raw
      ? JSON.parse(raw)
      : [];
  } catch {
    return [];
  }
}

export function writeHistory(
  items: SavedComparison[],
) {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(items),
  );
}