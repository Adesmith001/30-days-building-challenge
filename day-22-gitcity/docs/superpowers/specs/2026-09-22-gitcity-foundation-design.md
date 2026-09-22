# GitCity Foundation Design

## Goal

Turn a GitHub user's contribution year into a deterministic, explorable city with a polished graphite landing experience and a browser-safe demo path.

## Visual direction

GitCity uses a dark graphite palette, warm tungsten highlights, mint interaction states, technical monospace labels, and square architectural geometry. The landing page presents the city as a measured instrument rather than a game board.

## Architecture

The data flow is `GitHub snapshot -> derived stats -> deterministic city model -> React UI / Three.js scene`. Server-only GitHub access is isolated behind a route handler. When no token is configured, the app uses a deterministic demo snapshot so the product remains inspectable locally.

The city model treats one calendar day as one lot, quarters as boroughs, repositories as landmarks, and the profile as City Hall. Rendering is kept in focused client components so the landing page can load without WebGL and the city route can degrade gracefully when data is unavailable.

## Scope

- Landing page with username entry and product framing.
- GitHub year route with profile, contributions, repositories, and totals.
- Calendar completion for all days in the selected year.
- Derived active-day, streak, busiest-day, and busiest-month statistics.
- Deterministic lot layout and building heights.
- City canvas with orbit controls, central hall, landmarks, day lots, and an inspector panel.
- Focused unit tests plus lint and production build verification.

## Explicit non-goals

Supabase persistence, authentication, publishing, replay cinematics, year morphing, and portfolio embeds remain outside this slice.
