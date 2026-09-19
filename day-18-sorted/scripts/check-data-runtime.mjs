import { createServer } from "vite";
import { access } from "node:fs/promises";
import { join } from "node:path";

const server = await createServer({ server: { middlewareMode: true } });
try {
  const { puzzles } = await server.ssrLoadModule("/src/data/puzzles.ts");
  const cards = puzzles.flatMap((puzzle) =>
    puzzle.items.map((item) => ({ puzzle: puzzle.id, ...item })),
  );
  const paths = cards.map(({ image }) => image);

  if (cards.length !== 128) {
    throw new Error(`Expected 128 cards, found ${cards.length}`);
  }

  for (const card of cards) {
    if (!/^\/puzzles\/cards\/.+\.(?:jpe?g|png)$/i.test(card.image ?? "")) {
      throw new Error(`${card.puzzle}/${card.id} has an invalid image: ${card.image}`);
    }

    await access(join(process.cwd(), "public", card.image.slice(1)));
  }

  if (new Set(paths).size !== cards.length) {
    throw new Error(
      `Expected ${cards.length} unique card images, found ${new Set(paths).size}`,
    );
  }

  console.log({ puzzles: puzzles.length, cards: cards.length, uniqueImages: new Set(paths).size });
} finally {
  await server.close();
}
