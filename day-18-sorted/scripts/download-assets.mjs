import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import { join } from "node:path";

const base =
  "https://images.unsplash.com/";

const suffix =
  "?auto=format&fit=crop&w=1000&q=82";

const assets = {
  social:
    "photo-1603145733146-ae562a55031e",
  phone:
    "photo-1511707171634-5f897ff02aa9",
  space:
    "photo-1446776811953-b23d57bd21aa",
  earth:
    "photo-1614732414444-096e5f1122d5",
  mountain:
    "photo-1464822759023-fed622ff2c3b",
  city:
    "photo-1477959858617-67f85cf4f1df",
  lagos:
    "photo-1618828665347-d870c38c95c7",
  football:
    "photo-1522778119026-d647f0596c20",
  cinema:
    "photo-1489599849927-2ee91cede3ba",
  gaming:
    "photo-1511512578047-dfb367046420",
  music:
    "photo-1493225457124-a3eb161ffa5f",
  car:
    "photo-1503376780353-7e6692767b70",
  bridge:
    "photo-1501594907352-04cda38ebc29",
  airplane:
    "photo-1436491865332-7a61a109cc05",
  book:
    "photo-1495446815901-a7297e633e8d",
  coffee:
    "photo-1495474472287-4d71bcdd2085",
  sports:
    "photo-1579952363873-27f3bade9f55",
  history:
    "photo-1461360370896-922624d12aa1",
  beach:
    "photo-1507525428034-b723cf961d3e",
  forest:
    "photo-1441974231531-c6227db76b6e",
};

const outDir = join(
  process.cwd(),
  "public",
  "puzzles",
);

await mkdir(outDir, {
  recursive: true,
});

for (
  const [name, id]
  of Object.entries(assets)
) {
  const response = await fetch(
    `${base}${id}${suffix}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed ${name}: ${response.status}`,
    );
  }

  const bytes = new Uint8Array(
    await response.arrayBuffer(),
  );

  await writeFile(
    join(outDir, `${name}.jpg`),
    bytes,
  );

  console.log(
    `saved ${name}.jpg`,
  );
}