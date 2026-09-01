Original prompt: let's start day 1, it should be in it own folder

Started Day 01 as a standalone folder: `day-01-cursor-chaos`.
Added package/config, test-first physics helpers, React shell, Matter.js world, Three.js rendering, pointer modes, controls, and responsive styling.
Ran `npm test` and `npm run build`; both pass. Vite reports a large chunk warning from Three.js, accepted for this standalone Day 1 build.
Ran the develop-web-game Playwright verifier after installing its missing Playwright runtime. Fixed a favicon 404, a React remount loop, physics substepping, body containment, and hover contrast.
Final verification:
- `npm test` passes: 2 tests, 0 failures.
- `npm run build` passes; remaining Vite warning is only the expected large Three.js chunk.
- Canvas verifier produced screenshots and state in `output/web-game-5`.
- Manual desktop/mobile browser pass produced screenshots in `output/final` with no console errors.
TODO: optional later polish could add collision audio, fragmentation, and dashboard linking.
