import assert from "node:assert/strict";
import { pathToScreen, screenToPath } from "./routes.ts";

assert.equal(pathToScreen("/about"), "about");
assert.equal(pathToScreen("/history"), "history");
assert.equal(pathToScreen("/unknown"), "landing");
assert.equal(screenToPath("about"), "/about");
assert.equal(screenToPath("landing"), "/");
