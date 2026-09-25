# Day 25: Who Broke Prod? Design

## Product goal

Build a polished, deterministic production-incident simulation game that makes the player investigate a believable system rather than guess a scripted answer. The player should correlate telemetry, record evidence and hypotheses, take actions with real consequences, verify recovery, identify root cause, and receive an explainable score.

The project will live in `day-25-who-broke-prod` on the branch `day-25-who-broke-prod`. It will be a standalone client-side Vite application and will be added to the challenge dashboard after verification.

## Scope

The shipped experience includes:

- Six materially distinct incidents: bad deploy, database pool exhaustion, cache stampede, queue backlog, payment-provider outage, and memory leak.
- Deterministic metrics, logs, traces, deployments, flags, topology, diagnostics, and incident timelines.
- Evidence pinning, revisable hypotheses, mitigation actions, escalating customer impact, recovery verification, root-cause submission, postmortems, and scored results.
- Guided hints with a score cost, local save/resume, run history, replay, a deterministic daily incident, and a three-incident on-call shift.
- A simulated terminal, keyboard shortcuts, command palette, screenshot-ready share card, native sharing when available, and downloadable image export.
- Purpose-built desktop and mobile layouts, reduced-motion behavior, and accessible keyboard interaction.

Backend services, accounts, multiplayer, cloud saves, and remote telemetry are intentionally excluded. Local browser persistence is sufficient for this portfolio project.

## Technical approach

Use the supplied Vite/React implementation as a reference, preserving its domain model and modular structure while correcting type, interaction, layout, and integration defects found during verification.

Core technologies:

- React 19 and TypeScript for the application.
- Vite for development and production builds.
- Tailwind CSS 4 for styling.
- Zustand for the single persisted game store.
- Recharts for deterministic telemetry visualizations.
- Motion for meaningful state transitions and recovery feedback.
- Lucide React for interface icons.
- `html-to-image` for local share-card export.
- Vitest and Testing Library for domain and interaction tests.

No additional runtime dependency will be introduced unless an existing browser API or installed library cannot satisfy a verified requirement.

## Architecture

### Domain and scenario data

`src/types.ts` defines the scenario, telemetry, run-state, evidence, hypothesis, action, score, and history contracts. Each incident is a declarative scenario module under `src/data/incidents/`, with shared topology and healthy diagnostic fixtures extracted only where they remove real duplication.

The six scenarios must teach different investigation patterns. A recent deployment is relevant only to the bad-deploy incident; healthy or misleading signals in the other scenarios prevent the game from teaching a single universal heuristic.

### Deterministic simulation

Small pure modules under `src/lib/` own seeded random generation, simulated time, telemetry generation, timeline derivation, incident-state transitions, and scoring. Given the same scenario and run state, telemetry and scores must be identical.

The simulation advances on a controlled timer while the incident is active. Unrelated actions consume time; dangerous actions increase impact. Correct mitigation enters a visible progress state, trends telemetry toward baseline, slows impact growth, and requires explicit recovery verification before the result flow begins.

### State and persistence

One Zustand store owns navigation, the current run, history, shift progress, settings, and user actions. Persist only serializable state needed to resume a run or show history. Timers and derived telemetry are reconstructed from the persisted run rather than stored independently.

Storage failures or malformed older data fall back to a clean state without preventing the application from loading.

### Interface composition

The UI is divided by user task:

- Landing views: home, how it works, incident library, history, and about.
- Incident views: alert acknowledgement, HUD, navigation, topology overview, metrics, logs, traces, deploys, database, cache, queues, flags, dependencies, timeline, evidence, hypotheses, actions, terminal, hints, and command palette.
- Result views: recovery, root-cause analysis, postmortem, score, share card, and shift completion.

Desktop uses a dense observability-workbench layout. Mobile uses a focused panel with bottom navigation rather than shrinking the desktop columns. The visual language is a dark operations console with restrained red, amber, blue, and green state colors; animation communicates system state rather than decorating static content.

## Primary flow

1. The player selects an incident, daily run, or shift.
2. The alert screen establishes severity, customer impact, region, and affected surface.
3. The player investigates correlated telemetry and pins evidence.
4. The player records or revises hypotheses and chooses operational actions.
5. The simulation applies the time, danger, and mitigation consequences deterministically.
6. A successful mitigation visibly rolls out; the player verifies telemetry recovery.
7. The player submits component, cause, trigger, and notes for root cause.
8. The application presents the scenario postmortem and an explainable score breakdown.
9. The completed run is stored locally and can be replayed or shared.

## Error handling and safeguards

- Invalid scenario identifiers return the player to a safe landing state.
- Duplicate evidence pins and concurrently started actions are rejected in the store.
- Destructive or risky actions require confirmation and describe their consequence before execution.
- Unsupported native sharing falls back to a downloaded share-card image.
- Share-card generation failures leave the score screen usable and present a retryable error.
- Browser storage parsing and quota errors never block a fresh run.
- Timers are cleaned up on state changes and unmounts to prevent duplicate simulation ticks.

## Accessibility and responsive behavior

- All interactive controls are native buttons, inputs, or selects with visible focus treatment and descriptive labels.
- Color is never the sole carrier of status; labels and icons accompany severity and telemetry state.
- Dialogs and the command palette manage focus, support Escape, and restore focus on close.
- Keyboard shortcuts are disabled while typing in editable fields.
- Reduced-motion preferences remove nonessential animation while keeping state changes understandable.
- The application supports widths from 320px upward without horizontal page overflow.

## Testing and verification

Automated tests cover:

- Seeded random determinism.
- Deterministic telemetry and visible degradation/recovery behavior.
- Scoring rewards correct diagnosis and penalizes hints, unsafe actions, and customer impact.
- Simulation transitions for mitigation, recovery, verification, and completion.
- Persistence recovery from valid and malformed saved state.
- Critical store interactions such as evidence, hypotheses, actions, daily incidents, and shift progression.

Release verification includes TypeScript compilation, production build, the complete test suite, targeted browser interaction checks, console-error review, desktop screenshots, and mobile screenshots.

## Repository and delivery workflow

Delivery follows the established Day 24 pattern:

1. Scaffold the standalone project, commit it, and push the new branch immediately.
2. Implement in commits containing exactly five unique edited product files whenever at least five remain.
3. Push every five-file commit without requesting confirmation.
4. Use a smaller final implementation commit only when fewer than five files remain or when a verified fix is isolated to fewer files.
5. Capture verified screenshots, add the Day 25 dashboard entry, commit, and push the dashboard integration.
6. Finish with a clean working tree except for intentionally untracked local planning notes.

The dashboard entry will use the title “Who Broke Prod?”, a `2026-09-25` date, the deployed Vercel URL convention `https://day-25-who-broke-prod.vercel.app/`, repository source URL, relevant technology tags, and screenshots stored under `dashboard/public/projects/day-25/`.

