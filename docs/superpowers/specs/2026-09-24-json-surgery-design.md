# JSON Surgery Design

## Goal

Build a local-first JSON transformation workbench for Day 24. The main loop is: paste or load JSON, add readable transformation steps, inspect the result, and copy or download a generated JavaScript transform.

## Product shape

- Dark developer-tool visual language: graphite surfaces, blue/green status accents, monospace data areas, and compact uppercase labels.
- Desktop layout: top command bar, three work areas for input, steps, and output, plus a small activity/status footer.
- Mobile layout: the same work areas stack vertically without hiding the primary actions.
- Starter data is loaded on first visit so the app is useful immediately.

## MVP behavior

1. Parse and pretty-print JSON with a clear inline error state.
2. Load the built-in sample and accept a local `.json` file.
3. Add, remove, toggle, and reorder four operations: rename a key, delete a key, convert a primitive type, and filter array records.
4. Recompute output deterministically from the source and current pipeline.
5. Undo and redo pipeline changes.
6. Copy or download output JSON.
7. Generate copyable JavaScript for the current pipeline.
8. Keep all source data in the browser; no server or API is needed.

## Architecture

The app is a small Next.js client surface. Pure JSON path and transformation functions live in `src/lib` and are tested independently. The page owns the editable source text and pipeline state, while presentational components render the editor, pipeline list, and output panels. Generated code is derived from the same operation model used by the internal executor so the two paths can be compared in tests.

## Non-goals for this pass

CodeMirror, drag-and-drop libraries, authentication, remote persistence, schema inference, worker execution, and the full 17-operation reference list are intentionally deferred until the core loop proves useful.

## Validation

- `pnpm test:run`
- `pnpm lint`
- `pnpm build`
- Manual browser smoke check for load sample, add step, reorder, undo/redo, invalid JSON, copy, and download.
