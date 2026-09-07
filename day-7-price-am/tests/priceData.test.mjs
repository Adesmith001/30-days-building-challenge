import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import https from "node:https";

const source = readFileSync(new URL("../src/data/prices.ts", import.meta.url), "utf8");

const expectedIds = [
  "eggs",
  "tomatoes",
  "bread",
  "rice",
  "shawarma",
  "jollof",
  "suya",
  "power-bank",
  "earbuds",
  "phone",
  "sneakers",
  "fan",
  "cooking-gas",
  "generator",
  "haircut",
  "rent",
];

for (const id of expectedIds) {
  assert.match(source, new RegExp(`id: "${id}"`), `missing ${id}`);
}

assert.ok(!source.includes("source.unsplash.com"), "remote image redirects can break cards");
assert.ok(!source.includes("unsplash.com/photos"), "Unsplash page URLs are not image files");
assert.ok(!source.includes("unsplash.com"), "Unsplash images should not be used");
assert.ok(!source.includes("data:image/svg+xml"), "cards should use real raster photos");
assert.ok(!source.includes("BOKKU"), "data should only be sourced from Jiji, Chowdeck or Glovo");
assert.ok(!source.includes("PRICEPALLY"), "data should only be sourced from Jiji, Chowdeck or Glovo");
assert.ok(!source.includes("IG "), "data should only be sourced from Jiji, Chowdeck or Glovo");
assert.ok(!source.includes("ONLINE STORE"), "data should only be sourced from Jiji, Chowdeck or Glovo");
assert.ok(new Set([...source.matchAll(/id: "([^"]+)"/g)].map((match) => match[1])).size >= 20);

const imageUrls = [...source.matchAll(/image:\s*"([^"]+)"/g)].map((match) => match[1]);
const contexts = [...source.matchAll(/context:\s*"([^"]+)"/g)].map((match) => match[1]);

assert.equal(imageUrls.length, contexts.length, "each card should have one image");

for (const context of contexts) {
  assert.match(context, /\b(JIJI|CHOWDECK|GLOVO)\b/, `${context} needs an allowed source`);
}

for (const url of imageUrls) {
  const response = await getImage(url);

  assert.equal(response.statusCode, 200, `${url} returned ${response.statusCode}`);
  assert.match(
    response.contentType,
    /^image\/(jpeg|jpg|png|webp)/,
    `${url} returned ${response.contentType}`,
  );
  assert.ok(response.bytes > 0, `${url} returned no image bytes`);
}

function getImage(url) {
  return new Promise((resolve, reject) => {
    let bytes = 0;

    const request = https.request(url, { method: "GET" }, (response) => {
      response.on("data", (chunk) => {
        bytes += chunk.length;

        if (bytes > 0) {
          request.destroy();
          resolve({
            statusCode: response.statusCode,
            contentType: response.headers["content-type"] ?? "",
            bytes,
          });
        }
      });

      response.on("end", () => {
        resolve({
          statusCode: response.statusCode,
          contentType: response.headers["content-type"] ?? "",
          bytes,
        });
      });
    });

    request.setTimeout(10000, () => {
      request.destroy(new Error(`timeout fetching ${url}`));
    });
    request.on("error", (error) => {
      if (bytes > 0) return;
      reject(error);
    });
    request.end();
  });
}
