# 10,000 Danfos

Day 26 of the 30 Days Building challenge: a Lagos-inspired multi-agent traffic simulation presented as an interactive engineering game.

## What is real

- Up to 10,000 visible vehicles rendered with Three.js instancing
- Typed-array simulation state running in a module worker
- Grid, brute-force, and quadtree neighbour search
- Live candidate-check, neighbour, cell, simulation, and frame metrics
- Roadblocks with route recomputation
- Deterministic seeds and correctness tests
- Device calibration and safe benchmark limits

Road geometry, traffic volume, congestion, and speeds are synthetic.

## Run locally

```bash
pnpm install
pnpm dev
```

## Verify

```bash
pnpm test
pnpm lint
pnpm build
```
