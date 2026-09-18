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

export const puzzles:
  SortPuzzle[] = [
  ...techPuzzles,
  ...sciencePuzzles,
  ...worldPuzzles,
  ...entertainmentPuzzles,
  ...nigeriaPuzzles,
  ...miscPuzzles,
];

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