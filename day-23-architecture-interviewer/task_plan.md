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

- [complete] Inventory current code and extract the handoff contracts.
- [complete] Complete shared types, auth, Supabase queries, AI/domain helpers, and tests.
- [complete] Complete API routes and streaming state flow.
- [complete] Complete chat, sidebar, settings, and auth UI.
- [complete] Run tests, lint, build, and fix failures.
- [complete] Document GitHub, Google OAuth, Supabase, Groq, and deployment setup.

## Checkpoint ledger

Product files edited: 88

Next push checkpoint: final verification

## Definition of done

- The pasted core checklist is implemented without unrelated features.
- `pnpm test:run`, `pnpm lint`, and `pnpm build` pass.
- Checkpoint commits have been pushed to `origin/day-23-architecture-interviewer` after every five product-file edits.
- Final handoff explains credentials, provider callbacks, Supabase SQL, and deployment.
