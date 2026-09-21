import { describe, expect, it } from "vitest";
import { generateDeck } from "./deck";

describe("battle decks", () => {
  it("is deterministic for a seed", () => {
    expect(generateDeck("same", "campaign", 10)).toEqual(generateDeck("same", "campaign", 10));
  });

  it("uses a hard final battle in campaign", () => {
    const deck = generateDeck("final", "campaign", 10);
    expect(deck.at(-1)).toMatchObject({ difficulty: "hard", final: true });
  });

  it("does not repeat pairings", () => {
    const pairs = generateDeck("pairs", "campaign", 10).map(({ stateAId, stateBId }) => [stateAId, stateBId].sort().join(":"));
    expect(new Set(pairs).size).toBe(pairs.length);
  });
});
