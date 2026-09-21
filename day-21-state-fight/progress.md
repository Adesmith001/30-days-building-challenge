Original prompt: fix up this screen, the continue button should be in the middle to make the UX better; add routes so there are things like /screen-name; fix up the home screen also, let there be an effect when there is a win and all

- 2026-09-21: Approved design: native History API routes, centered battle outcome, focused home launch module, restrained win animation.
- Preserve existing uncommitted map/dependency work and CampaignScreen file state.
- 2026-09-21: Added tested route mapping and History API navigation for /, /modes, /battle, /atlas, /history, /results.
- 2026-09-21: Rebuilt home as a campaign command console and centered battle results with win flash/burst motion.

TODO:
- Test gameplay, routes, lint, and build.

- 2026-09-21: Reproduced the finish-state conflict: clearing `run` could resolve the battle route to home while results were being created.
- 2026-09-21: Added a red/green regression test, centralized active-screen resolution, and connected the new `CampaignScreen` completion view.
