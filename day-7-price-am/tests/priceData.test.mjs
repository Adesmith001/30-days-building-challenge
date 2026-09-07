import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/data/prices.ts", import.meta.url), "utf8");

const expectedTerms = {
  eggs: ["egg"],
  tomatoes: ["tomato"],
  bread: ["bread"],
  rice: ["rice"],
  shawarma: ["shawarma"],
  jollof: ["jollof", "chicken"],
  suya: ["suya"],
  "power-bank": ["power-bank"],
  earbuds: ["earbuds"],
  phone: ["iphone"],
  sneakers: ["sneakers"],
  fan: ["standing-fan"],
  "cooking-gas": ["cooking-gas"],
  generator: ["generator"],
  "haircut": ["barber"],
  rent: ["apartment"],
};

for (const [id, terms] of Object.entries(expectedTerms)) {
  const itemMatch = source.match(new RegExp(`id: "${id}",[\\s\\S]*?image:\\s*"([^"]+)"`));

  assert.ok(itemMatch, `missing ${id}`);

  const image = decodeURIComponent(itemMatch[1]).toLowerCase();

  for (const term of terms) {
    assert.ok(
      image.includes(term),
      `${id} image should include "${term}" so the picture matches the card`,
    );
  }
}

assert.equal(new Set([...source.matchAll(/id: "([^"]+)"/g)].map((match) => match[1])).size, 16);
