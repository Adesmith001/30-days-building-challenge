# State Fight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a playable, persistent Nigerian-state comparison game in `day-21-state-fight`.

**Architecture:** Keep game rules in small pure modules, persist progress in browser storage, and render a single React application with clear screen components. The supplied data and metric definitions stay the factual source for each battle result.

**Tech Stack:** React, TypeScript, Vite, Vitest, Motion, Lucide React.

**Spec:** `C:/Users/USER/.codex/attachments/244a0eb5-9c13-4ad4-853e-c0b32011b766/pasted-text.txt`

## Global Constraints

- Use the 36-state data already in `src/data/states.ts`.
- Keep outcome and deck generation deterministic.
- Support campaign, daily raid, last stronghold, discovery, trophies, history, source transparency, sound preference, and fast battles.
- Commit and push every five edited files.

---

### Task 1: Game engine

**Files:** `src/lib/compare.ts`, `src/lib/deck.ts`, `src/lib/scoring.ts`, tests beside the modules.

- [ ] Write and run failing tests for winner selection and deterministic, non-repeating battle decks.
- [ ] Implement the pure game rules and re-run tests.

### Task 2: Persisted game session

**Files:** `src/lib/storage.ts`, `src/hooks/useGame.ts`, `src/types/game.ts`.

- [ ] Add browser persistence and a hook that owns run state.
- [ ] Verify the build and manually check a complete run.

### Task 3: Playable interface

**Files:** `src/App.tsx`, `src/screens/*.tsx`, `src/components/*.tsx`, `src/index.css`.

- [ ] Replace the Vite starter with the home, mode, battle, results, atlas, and history flows.
- [ ] Add accessible controls, responsive tactical styling, source detail, settings, and share output.
- [ ] Run test, lint, and production build before final handoff.
