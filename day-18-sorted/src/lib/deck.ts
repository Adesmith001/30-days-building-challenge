import {
  puzzles,
} from "../data/puzzles";

import type {
  GameMode,
  PuzzleCategory,
  SortPuzzle,
} from "../types/game";

import {
  seededShuffle,
} from "./seed";

function interleaveCategories(
  items: SortPuzzle[],
) {
  const result:
    SortPuzzle[] = [];

  const pool = [
    ...items,
  ];

  while (pool.length) {
    const previous =
      result.at(-1)
        ?.category;

    const index =
      pool.findIndex(
        (puzzle) =>
          puzzle.category !==
          previous,
      );

    result.push(
      pool.splice(
        index === -1
          ? 0
          : index,
        1,
      )[0],
    );
  }

  return result;
}

function progressionDeck(
  source: SortPuzzle[],
  seed: string,
  count: number,
) {
  const shuffled =
    seededShuffle(
      source,
      seed,
    );

  if (count !== 10) {
    return interleaveCategories(
      shuffled,
    ).slice(
      0,
      count,
    );
  }

  const bands = [
    {
      count: 3,
      allowed: ["easy"],
    },
    {
      count: 3,
      allowed: [
        "medium",
        "easy",
      ],
    },
    {
      count: 3,
      allowed: [
        "hard",
        "medium",
      ],
    },
    {
      count: 1,
      allowed: [
        "final",
        "hard",
      ],
    },
  ] as const;

  const picked:
    SortPuzzle[] = [];

  for (
    const band
    of bands
  ) {
    const candidates =
      shuffled.filter(
        (puzzle) =>
          (
            band.allowed
            as readonly string[]
          ).includes(
            puzzle.difficulty,
          ) &&
          !picked.some(
            (item) =>
              item.id ===
              puzzle.id,
          ),
      );

    picked.push(
      ...candidates.slice(
        0,
        band.count,
      ),
    );
  }

  for (
    const puzzle
    of shuffled
  ) {
    if (
      picked.length >= count
    ) {
      break;
    }

    if (
      !picked.some(
        (item) =>
          item.id ===
          puzzle.id,
      )
    ) {
      picked.push(
        puzzle,
      );
    }
  }

  return interleaveCategories(
    picked.slice(
      0,
      count,
    ),
  );
}

export function createDeck({
  seed,
  mode,
  count,
  category,
}: {
  seed: string;
  mode: GameMode;
  count: number;
  category?: PuzzleCategory;
}) {
  const source =
    category
      ? puzzles.filter(
          (puzzle) =>
            puzzle.category ===
            category,
        )
      : puzzles;

  const deck =
    progressionDeck(
      source,
      `${seed}:${mode}:${
        category ?? "mixed"
      }`,
      count,
    );

  return deck.map(
    (puzzle) => puzzle.id,
  );
}

export function dailySeed(
  date = new Date(),
) {
  const yyyy =
    date.getFullYear();

  const mm =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const dd =
    String(
      date.getDate(),
    ).padStart(
      2,
      "0",
    );

  return (
    `sorted-${yyyy}-${mm}-${dd}`
  );
}