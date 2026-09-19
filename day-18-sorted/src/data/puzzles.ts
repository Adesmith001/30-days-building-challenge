import type {
  PuzzleCategory,
  SortPuzzle,
} from "../types/game";

import {
  entertainmentPuzzles,
} from "./entertainment";

import {
  miscPuzzles,
} from "./misc";

import {
  nigeriaPuzzles,
} from "./nigeria";

import {
  sciencePuzzles,
} from "./science";

import {
  techPuzzles,
} from "./tech";

import {
  worldPuzzles,
} from "./world";

import {
  cardImage,
} from "./itemImages";

import {
  validatePuzzleAssets,
} from "./validateAssets";

export const puzzles:
  SortPuzzle[] = [
  ...techPuzzles,
  ...sciencePuzzles,
  ...worldPuzzles,
  ...entertainmentPuzzles,
  ...nigeriaPuzzles,
  ...miscPuzzles,
];

for (const puzzle of puzzles) {
  puzzle.items = puzzle.items.map(
    (item) => ({
      ...item,
      image: cardImage(puzzle.id, item.id),
    }),
  );
}

const assetErrors = validatePuzzleAssets(
  puzzles,
);

if (assetErrors.length > 0) {
  throw new Error(
    `Invalid puzzle assets:\n${assetErrors.join("\n")}`,
  );
}

export const puzzleMap =
  new Map(
    puzzles.map(
      (puzzle) => [
        puzzle.id,
        puzzle,
      ],
    ),
  );

export const categories =
  Array.from(
    new Set(
      puzzles.map(
        (puzzle) =>
          puzzle.category,
      ),
    ),
  ) as PuzzleCategory[];
