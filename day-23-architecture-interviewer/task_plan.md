# Day 23 implementation plan

## Objective

Complete the Architecture Interviewer exactly within the pasted handoff: authentication, Supabase persistence/RLS, streamed Groq interviewer flow, structured interview state, chat UI, history/settings, diagram/review/export endpoints, tests, and deployment configuration.

## Constraints

- Preserve the existing Next 16 + React 19 + Supabase SSR + Groq stack.
- Do not add dashboard, gamification, or post-core stretch features.
- Keep service-role and AI keys server-only.
- Track product-file edits separately from planning metadata.
- Commit and push after product-file edit counts 5, 10, 15, etc.

## Phases

- [in_progress] Inventory current code and extract the handoff contracts.
- [pending] Complete shared types, auth, Supabase queries, AI/domain helpers, and tests.
- [pending] Complete API routes and streaming state flow.
- [pending] Complete chat, sidebar, settings, and auth UI.
- [pending] Run tests, lint, build, and fix failures.
- [pending] Document GitHub, Google OAuth, Supabase, Groq, and deployment setup.

## Checkpoint ledger

Product files edited: 5

Next push checkpoint: 10 product files

## Definition of done

- The pasted core checklist is implemented without unrelated features.
- `pnpm test:run`, `pnpm lint`, and `pnpm build` pass.
- Checkpoint commits have been pushed to `origin/day-23-architecture-interviewer` after every five product-file edits.
- Final handoff explains credentials, provider callbacks, Supabase SQL, and deployment.
