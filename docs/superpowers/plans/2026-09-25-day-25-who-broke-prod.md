# Day 25: Who Broke Prod? Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deterministic, responsive production-incident simulation game with six scenarios, persistent progress, explainable scoring, shareable results, automated tests, and dashboard integration.

**Architecture:** A standalone Vite/React client uses declarative incident modules, pure deterministic simulation libraries, and one persisted Zustand store. Small task-focused components render investigation and result flows; Vitest exercises the pure domain logic and critical store transitions.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, Recharts, Motion, Lucide React, html-to-image, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-09-25-day-25-who-broke-prod-design.md`

## Global Constraints

- Project directory and branch are both `day-25-who-broke-prod`.
- Preserve all six incidents and the complete client-side scope from the approved specification.
- Use browser persistence only; do not add backend services or authentication.
- Reuse browser APIs and installed dependencies before adding code or packages.
- Push the scaffold immediately, then commit and push every batch of exactly five unique edited product files.
- Use a smaller commit only for an isolated verified fix or a final remainder below five files.
- Support 320px-wide mobile layouts, keyboard navigation, and reduced motion.
- Do not commit dependency directories, build output, test output, or local environment values.

---

### Task 1: Scaffold the standalone application

**Files:**
- Create: `day-25-who-broke-prod/package.json`
- Create: `day-25-who-broke-prod/pnpm-lock.yaml`
- Create: `day-25-who-broke-prod/vite.config.ts`
- Create: `day-25-who-broke-prod/tsconfig.json`
- Create: `day-25-who-broke-prod/index.html`
- Create: `day-25-who-broke-prod/vercel.json`
- Create: `day-25-who-broke-prod/.env.example`
- Create: `day-25-who-broke-prod/src/main.tsx`
- Create: `day-25-who-broke-prod/src/app.tsx`
- Create: `day-25-who-broke-prod/src/index.css`

**Interfaces:**
- Produces: a buildable Vite root rendering `App` and a `@/*` alias resolving to `src/*`.

- [x] **Step 1: Create the scaffold files**

```tsx
// src/app.tsx
export default function App() {
  return <main>WHO BROKE PROD?</main>;
}
```

- [x] **Step 2: Install exact project dependencies**

Run: `pnpm install`

- [x] **Step 3: Verify the scaffold**

Run: `pnpm build`
Expected: TypeScript and Vite complete successfully and write `dist/`.

- [ ] **Step 4: Commit and push the scaffold**

Run: `git add day-25-who-broke-prod docs/superpowers/plans/2026-09-25-day-25-who-broke-prod.md && git commit -m "chore: scaffold day 25 who broke prod" && git push -u origin day-25-who-broke-prod`

### Task 2: Define the domain and first scenario

**Files:**
- Create: `day-25-who-broke-prod/src/types.ts`
- Create: `day-25-who-broke-prod/src/lib/rng.ts`
- Create: `day-25-who-broke-prod/src/lib/time.ts`
- Create: `day-25-who-broke-prod/src/data/incidents/shared.ts`
- Create: `day-25-who-broke-prod/src/data/incidents/bad-deploy.ts`

**Interfaces:**
- Produces: `IncidentScenario`, `IncidentRunState`, `HistoryRecord`, `hashString()`, `seededRandom()`, `scenarioTime()`, and the `badDeploy` scenario.

- [ ] **Step 1: Define strict scenario and run-state contracts**

```ts
export interface IncidentScenario {
  id: string;
  seed: number;
  metrics: MetricConfig[];
  actions: ActionDefinition[];
  rootCause: RootCauseDefinition;
}
```

- [ ] **Step 2: Add deterministic primitives and shared healthy fixtures**

```ts
export function seededRandom(seed: number): () => number;
export function scenarioTime(scenario: IncidentScenario, offset: number): string;
```

- [ ] **Step 3: Add the bad-deploy investigation data and type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit and push five files**

Run: `git add day-25-who-broke-prod/src/types.ts day-25-who-broke-prod/src/lib/rng.ts day-25-who-broke-prod/src/lib/time.ts day-25-who-broke-prod/src/data/incidents/shared.ts day-25-who-broke-prod/src/data/incidents/bad-deploy.ts && git commit -m "feat: define incident simulation domain" && git push`

### Task 3: Add five distinct incident scenarios

**Files:**
- Create: `day-25-who-broke-prod/src/data/incidents/db-pool.ts`
- Create: `day-25-who-broke-prod/src/data/incidents/cache-stampede.ts`
- Create: `day-25-who-broke-prod/src/data/incidents/queue-backlog.ts`
- Create: `day-25-who-broke-prod/src/data/incidents/payment-outage.ts`
- Create: `day-25-who-broke-prod/src/data/incidents/memory-leak.ts`

**Interfaces:**
- Consumes: `IncidentScenario` and shared topology/diagnostic helpers.
- Produces: five named `IncidentScenario` exports with distinct evidence, actions, causes, and postmortems.

- [ ] **Step 1: Encode each scenario as complete typed data**

```ts
export const scenarioSeeds = {
  "db-pool": 2502,
  "cache-stampede": 2503,
  "queue-backlog": 2504,
  "payment-outage": 2505,
  "memory-leak": 2506,
} as const;
```

- [ ] **Step 2: Type-check all scenario objects**

Run: `pnpm exec tsc --noEmit`
Expected: PASS with no missing scenario fields.

- [ ] **Step 3: Commit and push five files**

Run: `git add day-25-who-broke-prod/src/data/incidents/db-pool.ts day-25-who-broke-prod/src/data/incidents/cache-stampede.ts day-25-who-broke-prod/src/data/incidents/queue-backlog.ts day-25-who-broke-prod/src/data/incidents/payment-outage.ts day-25-who-broke-prod/src/data/incidents/memory-leak.ts && git commit -m "feat: add production incident library" && git push`

### Task 4: Implement deterministic simulation and scoring

**Files:**
- Create: `day-25-who-broke-prod/src/data/incidents/index.ts`
- Create: `day-25-who-broke-prod/src/lib/telemetry.ts`
- Create: `day-25-who-broke-prod/src/lib/timeline.ts`
- Create: `day-25-who-broke-prod/src/lib/simulation.ts`
- Create: `day-25-who-broke-prod/src/lib/scoring.ts`

**Interfaces:**
- Produces: `incidents`, `getIncident()`, `dailyIncident()`, `generateMetricSeries()`, `visibleTimeline()`, `createRun()`, and `calculateScore()`.

- [ ] **Step 1: Add deterministic metric generation**

```ts
export function generateMetricSeries(
  scenario: IncidentScenario,
  metric: MetricConfig,
  run: IncidentRunState,
): MetricPoint[];
```

- [ ] **Step 2: Add run initialization, recovery derivation, and scoring**

```ts
export function createRun(scenario: IncidentScenario): IncidentRunState;
export function calculateScore(scenario: IncidentScenario, run: IncidentRunState): ScoreBreakdown;
```

- [ ] **Step 3: Type-check deterministic domain code**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit and push five files**

Run: `git add day-25-who-broke-prod/src/data/incidents/index.ts day-25-who-broke-prod/src/lib/telemetry.ts day-25-who-broke-prod/src/lib/timeline.ts day-25-who-broke-prod/src/lib/simulation.ts day-25-who-broke-prod/src/lib/scoring.ts && git commit -m "feat: build deterministic incident engine" && git push`

### Task 5: Add the store and shared UI primitives

**Files:**
- Create: `day-25-who-broke-prod/src/store/use-game-store.ts`
- Create: `day-25-who-broke-prod/src/lib/cn.ts`
- Create: `day-25-who-broke-prod/src/components/ui/button.tsx`
- Create: `day-25-who-broke-prod/src/components/ui/badge.tsx`
- Create: `day-25-who-broke-prod/src/components/ui/section-header.tsx`

**Interfaces:**
- Produces: `useGameStore`, `cn()`, `Button`, `Badge`, and `SectionHeader`.

- [ ] **Step 1: Implement persisted game actions**

```ts
type GameActions = {
  startIncident: (scenarioId: string) => void;
  addEvidence: (pin: EvidencePin) => void;
  executeAction: (actionId: string) => void;
  verifyRecovery: () => void;
};
```

- [ ] **Step 2: Add minimal reusable UI primitives**

```tsx
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} />;
}
```

- [ ] **Step 3: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/store/use-game-store.ts day-25-who-broke-prod/src/lib/cn.ts day-25-who-broke-prod/src/components/ui/button.tsx day-25-who-broke-prod/src/components/ui/badge.tsx day-25-who-broke-prod/src/components/ui/section-header.tsx && git commit -m "feat: add persistent game state" && git push`

### Task 6: Build landing and discovery views

**Files:**
- Create: `day-25-who-broke-prod/src/components/landing/background-graph.tsx`
- Create: `day-25-who-broke-prod/src/components/landing/landing.tsx`
- Create: `day-25-who-broke-prod/src/components/landing/how-it-works.tsx`
- Create: `day-25-who-broke-prod/src/components/landing/library.tsx`
- Create: `day-25-who-broke-prod/src/components/landing/history.tsx`

**Interfaces:**
- Produces: the home, instructions, incident library, and history screens driven by `useGameStore`.

- [ ] **Step 1: Implement navigation and launch controls**

```tsx
<button onClick={() => startIncident("bad-deploy")}>START INCIDENT</button>
<button onClick={startDaily}>DAILY INCIDENT</button>
<button onClick={startShift}>ON-CALL SHIFT Â· 3 INCIDENTS</button>
```

- [ ] **Step 2: Verify keyboard-accessible native controls**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit and push five files**

Run: `git add day-25-who-broke-prod/src/components/landing/background-graph.tsx day-25-who-broke-prod/src/components/landing/landing.tsx day-25-who-broke-prod/src/components/landing/how-it-works.tsx day-25-who-broke-prod/src/components/landing/library.tsx day-25-who-broke-prod/src/components/landing/history.tsx && git commit -m "feat: build incident launch experience" && git push`

### Task 7: Establish the incident shell navigation

**Files:**
- Create: `day-25-who-broke-prod/src/components/landing/about.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/alert-screen.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/hud.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/sidebar.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/mobile-nav.tsx`

**Interfaces:**
- Produces: alert acknowledgement, persistent incident status, desktop navigation, and mobile bottom navigation.

- [ ] **Step 1: Render severity, time, impact, and pause state from the store**

```tsx
<output aria-label="Customer impact">{Math.round(run.impact)}</output>
<button onClick={togglePause}>{run.paused ? "RESUME" : "PAUSE"}</button>
```

- [ ] **Step 2: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/components/landing/about.tsx day-25-who-broke-prod/src/components/incident/alert-screen.tsx day-25-who-broke-prod/src/components/incident/hud.tsx day-25-who-broke-prod/src/components/incident/sidebar.tsx day-25-who-broke-prod/src/components/incident/mobile-nav.tsx && git commit -m "feat: add incident navigation shell" && git push`

### Task 8: Build topology and metric investigation

**Files:**
- Create: `day-25-who-broke-prod/src/components/incident/system-map.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/overview-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/metric-chart.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/metrics-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/logs-panel.tsx`

**Interfaces:**
- Consumes: scenario topology, deterministic metric points, log entries, and evidence actions.
- Produces: correlated topology, charts, and searchable logs with evidence pinning.

- [ ] **Step 1: Render deterministic data and pin controls**

```tsx
<button onClick={() => addEvidence(toMetricEvidence(metric))}>PIN EVIDENCE</button>
```

- [ ] **Step 2: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/components/incident/system-map.tsx day-25-who-broke-prod/src/components/incident/overview-panel.tsx day-25-who-broke-prod/src/components/incident/metric-chart.tsx day-25-who-broke-prod/src/components/incident/metrics-panel.tsx day-25-who-broke-prod/src/components/incident/logs-panel.tsx && git commit -m "feat: add telemetry investigation views" && git push`

### Task 9: Add traces and diagnostic panels

**Files:**
- Create: `day-25-who-broke-prod/src/components/incident/traces-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/deploys-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/diagnostic-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/flags-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/timeline-panel.tsx`

**Interfaces:**
- Produces: trace waterfall, deployment correlation, database/cache/queue/dependency diagnostics, flags, and event timeline.

- [ ] **Step 1: Render typed scenario diagnostics and pin actions**

```tsx
<button disabled={!panel.evidenceId} onClick={pinDiagnostic}>PIN DIAGNOSTIC</button>
```

- [ ] **Step 2: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/components/incident/traces-panel.tsx day-25-who-broke-prod/src/components/incident/deploys-panel.tsx day-25-who-broke-prod/src/components/incident/diagnostic-panel.tsx day-25-who-broke-prod/src/components/incident/flags-panel.tsx day-25-who-broke-prod/src/components/incident/timeline-panel.tsx && git commit -m "feat: expand incident diagnostics" && git push`

### Task 10: Add investigation decisions and terminal

**Files:**
- Create: `day-25-who-broke-prod/src/components/incident/evidence-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/hypothesis-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/actions-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/terminal-panel.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/panel-router.tsx`

**Interfaces:**
- Produces: evidence review, editable hypotheses, confirmed operational actions, simulated commands, and panel routing.

- [ ] **Step 1: Connect decision tools to store actions**

```tsx
<form onSubmit={saveHypothesis}>
  <select name="componentId" required>
    {scenario.services.map((service) => (
      <option key={service.id} value={service.id}>{service.name}</option>
    ))}
  </select>
  <input name="cause" required />
  <button type="submit">SAVE HYPOTHESIS</button>
</form>
<button onClick={() => confirmAction(action.id)}>EXECUTE</button>
```

- [ ] **Step 2: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/components/incident/evidence-panel.tsx day-25-who-broke-prod/src/components/incident/hypothesis-panel.tsx day-25-who-broke-prod/src/components/incident/actions-panel.tsx day-25-who-broke-prod/src/components/incident/terminal-panel.tsx day-25-who-broke-prod/src/components/incident/panel-router.tsx && git commit -m "feat: add investigation decision tools" && git push`

### Task 11: Complete the active incident workbench

**Files:**
- Create: `day-25-who-broke-prod/src/components/incident/timeline-rail.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/mitigation-banner.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/hints.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/command-palette.tsx`
- Create: `day-25-who-broke-prod/src/components/incident/incident-shell.tsx`

**Interfaces:**
- Produces: live simulation ticks, mitigation progress, scored hints, keyboard command navigation, and responsive workbench composition.

- [ ] **Step 1: Advance simulation only while active and unpaused**

```ts
useEffect(() => {
  if (run.paused) return;
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}, [run.paused, tick]);
```

- [ ] **Step 2: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/components/incident/timeline-rail.tsx day-25-who-broke-prod/src/components/incident/mitigation-banner.tsx day-25-who-broke-prod/src/components/incident/hints.tsx day-25-who-broke-prod/src/components/incident/command-palette.tsx day-25-who-broke-prod/src/components/incident/incident-shell.tsx && git commit -m "feat: complete incident workbench" && git push`

### Task 12: Build the recovery and scoring flow

**Files:**
- Create: `day-25-who-broke-prod/src/components/result/recovery-screen.tsx`
- Create: `day-25-who-broke-prod/src/components/result/root-cause-screen.tsx`
- Create: `day-25-who-broke-prod/src/components/result/postmortem-screen.tsx`
- Create: `day-25-who-broke-prod/src/components/result/share-card.tsx`
- Create: `day-25-who-broke-prod/src/components/result/score-screen.tsx`

**Interfaces:**
- Produces: recovery verification, structured root-cause submission, postmortem comparison, score breakdown, and downloadable/native-shared results.

- [ ] **Step 1: Implement the full result state sequence**

```tsx
switch (run.status) {
  case "recovered": return <RecoveryScreen />;
  case "root-cause": return <RootCauseScreen />;
  case "postmortem": return <PostmortemScreen />;
  case "score": return <ScoreScreen />;
}
```

- [ ] **Step 2: Type-check and commit five files**

Run: `pnpm exec tsc --noEmit`
Run: `git add day-25-who-broke-prod/src/components/result/recovery-screen.tsx day-25-who-broke-prod/src/components/result/root-cause-screen.tsx day-25-who-broke-prod/src/components/result/postmortem-screen.tsx day-25-who-broke-prod/src/components/result/share-card.tsx day-25-who-broke-prod/src/components/result/score-screen.tsx && git commit -m "feat: add incident recovery results" && git push`

### Task 13: Integrate the complete application and first test

**Files:**
- Create: `day-25-who-broke-prod/src/components/result/shift-complete.tsx`
- Modify: `day-25-who-broke-prod/src/app.tsx`
- Modify: `day-25-who-broke-prod/src/main.tsx`
- Modify: `day-25-who-broke-prod/src/index.css`
- Create: `day-25-who-broke-prod/src/tests/rng.test.ts`

**Interfaces:**
- Produces: complete view routing, global responsive visual system, shift summary, and deterministic RNG coverage.

- [ ] **Step 1: Write the deterministic RNG test**

```ts
expect([a(), a(), a()]).toEqual([b(), b(), b()]);
```

- [ ] **Step 2: Run the test and verify it initially fails before the alias/test setup is complete**

Run: `pnpm test:run -- src/tests/rng.test.ts`

- [ ] **Step 3: Wire all screens and finalize global styles**

```tsx
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
```

- [ ] **Step 4: Run tests/build, then commit and push five files**

Run: `pnpm test:run && pnpm build`
Run: `git add day-25-who-broke-prod/src/components/result/shift-complete.tsx day-25-who-broke-prod/src/app.tsx day-25-who-broke-prod/src/main.tsx day-25-who-broke-prod/src/index.css day-25-who-broke-prod/src/tests/rng.test.ts && git commit -m "feat: integrate production incident simulator" && git push`

### Task 14: Add behavior coverage

**Files:**
- Create: `day-25-who-broke-prod/src/tests/telemetry.test.ts`
- Create: `day-25-who-broke-prod/src/tests/scoring.test.ts`
- Create: `day-25-who-broke-prod/src/tests/simulation.test.ts`
- Create: `day-25-who-broke-prod/src/tests/store.test.ts`
- Create: `day-25-who-broke-prod/src/tests/app.test.tsx`

**Interfaces:**
- Tests: telemetry determinism/degradation, score incentives, state transitions, persistence-safe actions, and screen routing.

- [ ] **Step 1: Write failing behavior tests**

```ts
expect(generateMetricSeries(scenario, metric, run)).toEqual(
  generateMetricSeries(scenario, metric, run),
);
expect(calculateScore(scenario, correctRun).rootCause).toBeGreaterThan(2000);
```

- [ ] **Step 2: Run tests and correct implementation defects only**

Run: `pnpm test:run`
Expected: all tests pass without weakening assertions.

- [ ] **Step 3: Commit and push five files**

Run: `git add day-25-who-broke-prod/src/tests/telemetry.test.ts day-25-who-broke-prod/src/tests/scoring.test.ts day-25-who-broke-prod/src/tests/simulation.test.ts day-25-who-broke-prod/src/tests/store.test.ts day-25-who-broke-prod/src/tests/app.test.tsx && git commit -m "test: cover incident simulation behavior" && git push`

### Task 15: Browser verification and dashboard integration

**Files:**
- Create: `dashboard/public/projects/day-25/1.png`
- Create: `dashboard/public/projects/day-25/2.png`
- Create: `dashboard/public/projects/day-25/3.png`
- Create: `dashboard/public/projects/day-25/4.png`
- Modify: `dashboard/src/data/projects.ts`

**Interfaces:**
- Produces: verified portfolio screenshots and the completed Day 25 dashboard record.

- [ ] **Step 1: Run final automated checks**

Run: `pnpm test:run && pnpm build`
Expected: PASS.

- [ ] **Step 2: Exercise the app in a browser**

Verify: launch an incident, pin evidence, save a hypothesis, execute one wrong action and the correct mitigation, observe recovery, verify it, complete root cause/postmortem/score, reload persisted history, and repeat navigation at 390px width with no console errors.

- [ ] **Step 3: Capture four representative screenshots**

Capture: landing, active investigation, recovery/result, and mobile incident navigation.

- [ ] **Step 4: Add the dashboard entry and run dashboard tests/build**

Run: `pnpm test && pnpm build` from `dashboard/`.
Expected: PASS.

- [ ] **Step 5: Commit and push exactly five files**

Run: `git add dashboard/public/projects/day-25 dashboard/src/data/projects.ts && git commit -m "feat: add day 25 project to dashboard" && git push`

- [ ] **Step 6: Confirm the branch is clean**

Run: `git status --short --branch`
Expected: branch tracks `origin/day-25-who-broke-prod`; only intentionally untracked local planning notes may remain.
