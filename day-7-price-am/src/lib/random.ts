import type { PriceItem } from "../types/game";

export function shuffleItems(items: PriceItem[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    );

    [copy[index], copy[randomIndex]] = [
      copy[randomIndex],
      copy[index],
    ];
  }

  return copy;
}

export function makeRunDeck(
  items: PriceItem[],
  size = 10,
) {
  return shuffleItems(items).slice(0, size);
}