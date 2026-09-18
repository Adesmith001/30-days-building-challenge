import type {
  SortItem,
  SortPuzzle,
} from "../types/game";

import {
  seededShuffle,
} from "./seed";

export function getCorrectItems(
  puzzle: SortPuzzle,
) {
  const ordered = [
    ...puzzle.items,
  ].sort(
    (a, b) =>
      a.value - b.value,
  );

  return puzzle.direction === "asc"
    ? ordered
    : ordered.reverse();
}

export function getCorrectIds(
  puzzle: SortPuzzle,
) {
  return getCorrectItems(
    puzzle,
  ).map(
    (item) => item.id,
  );
}

export function getPresentedItems(
  puzzle: SortPuzzle,
  seed: string,
): SortItem[] {
  const shuffled =
    seededShuffle(
      puzzle.items,
      `${seed}:${puzzle.id}:presentation`,
    );

  const correct =
    getCorrectIds(
      puzzle,
    ).join("|");

  const shuffledKey =
    shuffled
      .map(
        (item) => item.id,
      )
      .join("|");

  if (
    shuffledKey === correct
  ) {
    return [
      ...shuffled.slice(1),
      shuffled[0],
    ];
  }

  return shuffled;
}

export function isOneAdjacentSwapAway(
  player: string[],
  correct: string[],
) {
  if (
    player.length !==
    correct.length
  ) {
    return false;
  }

  for (
    let i = 0;
    i < player.length - 1;
    i += 1
  ) {
    const copy = [
      ...player,
    ];

    [
      copy[i],
      copy[i + 1],
    ] = [
      copy[i + 1],
      copy[i],
    ];

    if (
      copy.every(
        (id, index) =>
          id === correct[index],
      )
    ) {
      return true;
    }
  }

  return false;
}