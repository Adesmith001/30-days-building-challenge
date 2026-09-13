import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./projects.ts", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const modalSource = readFileSync(new URL("../components/ProjectModal.tsx", import.meta.url), "utf8");

test("dashboard registers day 1 Cursor Chaos", () => {
  assert.match(source, /day:\s*1/);
  assert.match(source, /title:\s*"Cursor Chaos"/);
  assert.match(source, /liveUrl:\s*"[^"]*day-1-cursor-chaos/);
  assert.match(source, /twitterUrl\?:\s*string/);
});

test("dashboard registers day 2 Meeting Cost", () => {
  assert.match(source, /day:\s*2/);
  assert.match(source, /title:\s*"Meeting Cost"/);
  assert.match(source, /liveUrl:\s*"[^"]*day-2-meeting-cost/);
});

test("dashboard registers day 5 Do Not Touch", () => {
  assert.match(source, /day:\s*5/);
  assert.match(source, /title:\s*"Do Not Touch"/);
  assert.match(source, /liveUrl:\s*"[^"]*day-5-do-not-touch/);
});

test("dashboard registers day 13 Later with its project screenshots", () => {
  assert.match(source, /day:\s*13/);
  assert.match(source, /title:\s*"Later"/);
  assert.match(source, /\/projects\/day-13\/1\.png/);
  assert.match(source, /\/projects\/day-13\/7\.png/);
});

test("project sheets expose a full-size image gallery", () => {
  assert.match(modalSource, /gallery/);
  assert.match(modalSource, /aria-label=.*image/i);
  assert.match(stylesSource, /\.modal__media img[\s\S]*object-fit:\s*contain/);
  assert.match(stylesSource, /\.gallery__image[\s\S]*max-height:\s*100%/);
  assert.match(stylesSource, /\.modal__panel[\s\S]*overflow:\s*hidden/);
  assert.match(stylesSource, /\.modal__content[\s\S]*overflow-y:\s*auto/);
  assert.match(stylesSource, /\.modal__panel\s*\{[\s\S]*grid-template-rows:\s*minmax\(330px, auto\) minmax\(0, 1fr\)/);
});

test("dashboard app is composed from focused components", () => {
  assert.match(appSource, /from "\.\/components\/ProjectModal"/);
  assert.match(appSource, /from "\.\/components\/ProjectArchive"/);
  assert.match(appSource, /from "\.\/components\/SiteHeader"/);
});
