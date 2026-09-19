const pngCards = new Set([
  "science-body-size/moon",
  "science-body-size/mercury",
  "science-body-size/mars",
  "science-body-size/earth",
  "ng-afrobeats-albums/rave",
  "ng-afrobeats-songs/calm",
]);

export function cardImage(
  puzzleId: string,
  itemId: string,
): string {
  const key = `${puzzleId}/${itemId}`;
  const extension = pngCards.has(key)
    ? "png"
    : "jpg";

  return `/puzzles/cards/${puzzleId}-${itemId}.${extension}`;
}
