# JSON Surgery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first JSON transformation workbench with an editable source, readable pipeline, deterministic output, and generated JavaScript.

**Architecture:** A small Next.js client app uses focused pure functions for JSON paths, operations, and code generation. React state owns source text, pipeline history, and UI feedback; the UI is split into a header, input editor, pipeline panel, output panel, and small dialogs where needed.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, lucide-react, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-24-json-surgery-design.md`

## Global Constraints

- Keep the app local-first; ordinary JSON never leaves the browser.
- Prefer native browser APIs over new dependencies for file input, clipboard, download, and drag/reorder controls.
- Keep the first pass to four operations: rename, delete, convert type, and filter.
- Preserve the five-file Git cadence requested by the user; push after scaffolding and after each subsequent batch of five edited files.

---

### Task 1: Scaffold the Next.js application

**Files:**
- Create: `day-24-json-surgery/package.json`
- Create: `day-24-json-surgery/tsconfig.json`
- Create: `day-24-json-surgery/next.config.ts`
- Create: `day-24-json-surgery/postcss.config.mjs`
- Create: `day-24-json-surgery/src/app/layout.tsx`
- Create: `day-24-json-surgery/src/app/page.tsx`
- Create: `day-24-json-surgery/src/app/globals.css`

**Interfaces:**
- Produces: a runnable Next.js shell at `/` with `dev`, `build`, `lint`, `test`, and `test:run` scripts.

- [ ] Create the app directory and minimal package/config files.
- [ ] Add a placeholder page that renders the product name.
- [ ] Run `pnpm install` from the app directory.
- [ ] Run `pnpm build` and confirm the shell builds.
- [ ] Commit and push the scaffold before feature edits.

### Task 2: Model JSON paths and operation execution

**Files:**
- Create: `day-24-json-surgery/src/types/json.ts`
- Create: `day-24-json-surgery/src/types/operations.ts`
- Create: `day-24-json-surgery/src/lib/json.ts`
- Create: `day-24-json-surgery/src/lib/operations.ts`
- Test: `day-24-json-surgery/src/tests/operations.test.ts`

**Interfaces:**
- Produces: `parsePath`, `pathToString`, `getAtPath`, `setAtPath`, `deleteAtPath`, `executeOperation`, and `executePipeline`.

- [ ] Write tests for wildcard paths, rename, delete, conversion failure, and filtering.
- [ ] Run the focused test and confirm it fails before implementation.
- [ ] Implement minimal typed JSON path helpers and pure operations.
- [ ] Run the focused test and confirm it passes.
- [ ] After five edited files, commit and push the batch.

### Task 3: Add generated-code equivalence

**Files:**
- Create: `day-24-json-surgery/src/lib/codegen.ts`
- Create: `day-24-json-surgery/src/tests/codegen.test.ts`

**Interfaces:**
- Consumes: `TransformOperation[]` and `executePipeline` from Task 2.
- Produces: `generateJavaScript(operations): string` returning a standalone `transform` function.

- [ ] Write a test that evaluates generated JavaScript and compares it with `executePipeline`.
- [ ] Run the focused test to confirm it fails.
- [ ] Implement string generation for the four operation types.
- [ ] Run the focused test and the full test suite.
- [ ] Commit and push the batch at the five-file threshold or immediately if the batch ends below it.

### Task 4: Build stateful workbench UI

**Files:**
- Create: `day-24-json-surgery/src/lib/samples.ts`
- Create: `day-24-json-surgery/src/components/Header.tsx`
- Create: `day-24-json-surgery/src/components/JsonEditor.tsx`
- Create: `day-24-json-surgery/src/components/PipelinePanel.tsx`
- Create: `day-24-json-surgery/src/components/OutputPanel.tsx`
- Modify: `day-24-json-surgery/src/app/page.tsx`

**Interfaces:**
- Consumes: the JSON and operation helpers from Tasks 2–3.
- Produces: interactive source editing, add/edit/toggle/remove/reorder pipeline controls, output rendering, copy/download actions, and undo/redo.

- [ ] Add the deterministic starter dataset and operation labels.
- [ ] Render the desktop/mobile workbench shell and source editor.
- [ ] Add pipeline controls and derived output state.
- [ ] Add output JSON and generated-code tabs with clipboard/download actions.
- [ ] Run lint/build and manually verify the main loop.
- [ ] Commit and push after every fifth edited file.

### Task 5: Error states, accessibility, and polish

**Files:**
- Modify: `day-24-json-surgery/src/app/globals.css`
- Modify: `day-24-json-surgery/src/app/page.tsx`
- Modify: `day-24-json-surgery/src/components/JsonEditor.tsx`
- Modify: `day-24-json-surgery/src/components/PipelinePanel.tsx`
- Modify: `day-24-json-surgery/src/components/OutputPanel.tsx`

- [ ] Show line/column-friendly invalid JSON feedback without crashing the app.
- [ ] Add visible focus states, labels, keyboard-accessible buttons, and responsive overflow behavior.
- [ ] Add compact status metrics for bytes, steps, and output state.
- [ ] Run `pnpm test:run`, `pnpm lint`, and `pnpm build`.
- [ ] Complete a browser smoke check and push the final batch.
