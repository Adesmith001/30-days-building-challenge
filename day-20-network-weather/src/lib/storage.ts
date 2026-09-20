import type { NetworkSnapshot } from "../types/network";

const STORAGE_KEY = "network-weather-history";
const MAX_SNAPSHOTS = 30;

export function loadSnapshots(): NetworkSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NetworkSnapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveSnapshot(snapshot: NetworkSnapshot) {
  const snapshots = [
    snapshot,
    ...loadSnapshots().filter((item) => item.id !== snapshot.id),
  ].slice(0, MAX_SNAPSHOTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  return snapshots;
}

export function clearSnapshots() {
  localStorage.removeItem(STORAGE_KEY);
}
