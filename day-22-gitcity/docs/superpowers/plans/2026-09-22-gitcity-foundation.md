# GitCity Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute this plan inline with five-file checkpoints.

**Goal:** Build Slice 01 of GitCity as a readable Next.js foundation with deterministic demo data and optional real GitHub data.

**Architecture:** Keep the data pipeline in typed library modules, expose GitHub through a server route, and render the landing/city experiences through focused client components. The city scene is intentionally simple but uses real city semantics: lots, boroughs, landmarks, City Hall, and an active-day beacon.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Three.js, React Three Fiber, Drei, Vitest, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-22-gitcity-foundation-design.md`

## Global Constraints

- Keep secrets server-only; never expose `GITHUB_TOKEN` to the browser.
- Keep source readable with one statement per line and focused files.
- Use deterministic seeded generation for the same login and year.
- Support a local demo path when GitHub credentials are unavailable.
- Respect reduced motion and keyboard-visible focus states.

### Task 1: Project foundation and domain types

**Files:** `package.json`, `.env.example`, `src/app/globals.css`, `src/app/layout.tsx`, `src/types/github.ts`, `src/types/city.ts`

- Add the required runtime and test dependencies.
- Define shared GitHub and city contracts.
- Establish the graphite visual tokens and typography.

### Task 2: Data pipeline

**Files:** `src/lib/github/fill-calendar.ts`, `src/lib/stats/derive-year-stats.ts`, `src/lib/city/seeded-random.ts`, `src/lib/city/building-height.ts`, `src/lib/city/layout.ts`, `src/lib/city/generate-city.ts`, `src/lib/github/demo-snapshot.ts`, `src/lib/github/fetch-github-year.ts`, `src/app/api/github/[login]/route.ts`

- Test calendar completion, statistics, and deterministic generation before implementation.
- Implement demo snapshot generation and optional GitHub GraphQL fetching.
- Convert snapshots into a complete city model.

### Task 3: Landing experience

**Files:** `src/components/landing/LandingScreen.tsx`, `src/app/page.tsx`

- Build the landing page and route users to `/city/[login]`.

### Task 4: City experience

**Files:** `src/components/city/CityCanvas.tsx`, `src/components/city/CityExperience.tsx`, `src/components/city/CityGround.tsx`, `src/components/city/CityHall.tsx`, `src/components/city/ContributionBuildings.tsx`, `src/components/city/RepositoryLandmarks.tsx`, `src/components/city/BusiestDayBeacon.tsx`, `src/components/ui/CityInspector.tsx`, `src/components/ui/CityStats.tsx`, `src/app/city/[login]/page.tsx`

- Render an inspectable city with adaptive visual density and a useful stats HUD.

### Task 5: Verification

**Files:** `vitest.config.ts`, tests, `package.json`

- Run unit tests, lint, and production build.
- Review the diff for readable statement-by-statement code and verify the route behavior.
