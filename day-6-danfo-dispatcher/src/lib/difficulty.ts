import type { GameState, StopId } from "../types/game";

export const DIFFICULTIES = {
  standard: { label: "Standard", description: "The full Lagos rush, with a gentle start to each shift.", demand: 1, patience: 1, incidents: 1, overflowGrace: 4_000 },
  relaxed: { label: "Relaxed", description: "Slower queues, 50% more patience and fewer incidents.", demand: 1.5, patience: 1.5, incidents: 1.6, overflowGrace: 8_000 },
};

export function passengerPatience(state: GameState) {
  return Math.max(30_000, 52_000 - state.shift * 2_000) * DIFFICULTIES[state.difficulty].patience;
}

export function overflowSeconds(state: GameState, id: StopId) {
  const stop = state.stops[id];
  if (stop.fullSince === null) return null;
  const deadline = Math.max(stop.fullSince + DIFFICULTIES[state.difficulty].overflowGrace, stop.lastOverflowAt + 12_000);
  return Math.max(0, Math.ceil((deadline - state.now) / (1_000 * state.gameSpeed)));
}
