import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

test("compiled Vercel function loads and calls Groq", async (t) => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const cache = join(root, ".cache");
  mkdirSync(cache, { recursive: true });
  const output = mkdtempSync(join(cache, "api-test-"));
  const originalKey = process.env.GROQ_API_KEY;
  t.after(() => {
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
    assert.equal(dirname(output), cache);
    rmSync(output, { recursive: true, force: true });
  });

  // Like Vercel, emit JavaScript dependencies without copying TypeScript sources.
  const program = ts.createProgram([join(root, "api/duck.ts")], {
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    rootDir: root,
    outDir: output,
    noCheck: true,
  });
  assert.equal(program.emit().emitSkipped, false);
  const { default: handler } = await import(
    pathToFileURL(join(output, "api/duck.js")).href
  );

  process.env.GROQ_API_KEY = "test-key";
  const upstream = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
    assert.equal(options.headers.Authorization, "Bearer test-key");
    const payload = JSON.parse(options.body);
    assert.match(payload.messages[1].content, /My API crashes/);
    return Response.json({
      choices: [{ message: { content: JSON.stringify({
        kind: "question",
        question: "What error do you see?",
      }) } }],
    });
  });
  const response = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: "",
    setHeader(name: string, value: string) { this.headers[name] = value; },
    end(body: string) { this.body = body; },
  };
  await handler({
    method: "POST",
    url: "/api/duck",
    headers: { host: "localhost", "content-type": "application/json" },
    body: {
      action: "start",
      problem: { mode: "code", text: "My API crashes", tried: "", outcome: "" },
      state: {
        stage: "define", clarity: 0, summary: "", insights: [],
        assumptions: [], evidence: [], recentTurns: [],
      },
      currentQuestion: "", userText: "", hintLevel: 0,
    },
  }, response);
  assert.equal(upstream.mock.callCount(), 1);
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["cache-control"], "no-store");
  assert.equal(JSON.parse(response.body).question, "What error do you see?");
});
