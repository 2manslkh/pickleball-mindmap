# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2026-06-20

### Changed

- **Removed all chess framing.** Title "Grandmaster Edition" → "Pickleball Strategy",
  "chess-grandmaster framework" → "a complete strategy framework", dropped the
  ♟️ "Chess concept" badge and pawn iconography, and renamed chess-derived concepts
  to plain pickleball language ("Zwischenzug" → "In-between shot", "Prophylaxis" →
  "Prevention", pillar taglines reworded). Internal `pickleball-gm-*` localStorage
  keys are intentionally kept to preserve existing users' saved progress.

### Fixed

- **Educational content corrections** (reviewed against the USA Pickleball rulebook):
  - Erne legality stated precisely — both feet established outside the non-volley
    zone and no kitchen contact during the volley.
  - Overhead error corrected to over-hitting long (was "hitting into the net").
  - "Change pace & spin" drill now visualizes a slice dink instead of a baseline
    drive, matching the soft-game lesson.
  - Tightened the dink-margin quiz wording.
- `verify:court` npm script now runs (uses `npx tsx`).

## [2.1.0] - 2026-06-18

### Added

- **Physics-based 3D shot trajectories**: each drill now solves a gravity parabola
  whose curvature guarantees the ball clears the net (at its real sagging height for
  the crossing point) by a shot-appropriate margin, then bounces. Shot type and
  spin (topspin dips, slice floats) drive the flight — no hand-tuned arc heights.
- **Animated player figures**: stylized ~1.75 m figures (body, head, paddle). The
  striker stands at the contact point and swings through the ball; the receiver
  shifts to the target and split-steps.
- `pickleball-court-animations` authoring skill and a headless `npm run verify:court`
  net-clearance test that checks every shot spec.
- **App version badge** in the header, sourced from `package.json` (links to releases).

### Fixed

- Ball flight passing **through the net** on low/flat shots (dinks, drives, smashes,
  speed-ups) — the old single symmetric parabola peaked off-net and below net height.
- Player models that never moved during a drill.

### Changed

- Court now uses **official USA Pickleball dimensions** with a net that sags from
  36 in at the posts to 34 in at center; net clearance is checked at the real height.
- Ball trajectory physics extracted to `lib/court-physics.ts` (pure, render-free,
  shared by the renderer and the verifier).

## [2.0.0] - 2026-06-15

### Changed

- Migrated from a single `index.html` to a **Next.js 16** app (App Router, React 19,
  TypeScript). State and `localStorage` logic moved into React; rendering is now
  component-based instead of imperative DOM updates.
- Reskinned to the [DIP](../dip) **light editorial** design system: green primary,
  gold accents, Plus Jakarta Sans display type, restrained shadows.

### Added

- **PWA**: web manifest, branded 🏓 icons (192/512/maskable, apple-touch, favicon),
  and a service worker for offline support and installability.
- Quiz "raise-only" rule — a quiz can raise a self-rating but never lower it.
- Data controls: export / import (JSON) and reset, in the dashboard and header.
- Docked quiz launch bar that never overlaps scrollable content.
- `README.md` and `vercel.json` (pins the `nextjs` framework).
- Semantic-versioning tooling: `release:patch|minor|major` scripts and this changelog.

## [1.0.0] - pre-tagging

### Added

- Initial single-page pickleball strategy mindmap: five strategic pillars with tabs,
  per-skill self-rating with notes, a spaced-repetition quiz, and a dashboard
  (skill radar, weak areas, quiz history). Stored locally via `localStorage`.

[Unreleased]: https://github.com/2manslkh/pickleball-mindmap/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/2manslkh/pickleball-mindmap/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/2manslkh/pickleball-mindmap/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/2manslkh/pickleball-mindmap/releases/tag/v2.0.0
