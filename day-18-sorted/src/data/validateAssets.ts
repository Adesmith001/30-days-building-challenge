import type { SortPuzzle } from "../types/game";

export function validatePuzzleAssets(
  puzzles: SortPuzzle[],
): string[] {
  const errors: string[] = [];
  const paths = new Map<string, string>();

  for (const puzzle of puzzles) {
    for (const item of puzzle.items) {
      const image = item.image;
      const key = `${puzzle.id}/${item.id}`;

      if (!image) {
        errors.push(`${key} has no image`);
        continue;
      }

      if (!/^\/puzzles\/cards\/.+\.(?:jpe?g|png)$/i.test(image)) {
        errors.push(`${key} is not a local card JPG/PNG: ${image}`);
      }

      const previous = paths.get(image);
      if (previous) {
        errors.push(
          `${image} is reused by ${previous} and ${key}`,
        );
      } else {
        paths.set(image, key);
      }
    }
  }

  return errors;
}
