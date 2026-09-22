export function createSeededRandom(seed: string) {
  let state = 2166136261;

  for (const character of seed) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }

  return function random() {
    state += state << 13;
    state ^= state >>> 7;
    state += state << 3;
    state ^= state >>> 17;
    state += state << 5;
    return (state >>> 0) / 4294967296;
  };
}
