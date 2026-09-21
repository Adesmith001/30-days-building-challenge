import { METRIC_IDS } from "../data/metrics";
import { STATES } from "../data/states";
import type { Battle, Difficulty, RunMode } from "../types/game";
import { seededRandom, shuffleSeeded } from "./seed";

export function generateDeck(seed: string, mode: RunMode, count = mode === "daily" ? 5 : 10): Battle[] {
  const random = seededRandom(`${seed}:${mode}`);
  const pairs = new Set<string>();
  const battles: Battle[] = [];
  while (battles.length < count) {
    const [stateA, stateB] = shuffleSeeded(STATES, random).slice(0, 2);
    const key = [stateA.id, stateB.id].sort().join(":");
    if (pairs.has(key)) continue;
    pairs.add(key);
    const final = mode === "campaign" && battles.length === count - 1;
    const difficulty: Difficulty = final ? "hard" : battles.length % 3 === 2 ? "medium" : "easy";
    battles.push({
      id: `${seed}-${battles.length + 1}`, stateAId: stateA.id, stateBId: stateB.id,
      metricId: METRIC_IDS[Math.floor(random() * METRIC_IDS.length)], difficulty, final,
    });
  }
  return battles;
}
