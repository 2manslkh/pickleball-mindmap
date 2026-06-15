# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/2manslkh/pickleball-mindmap/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/2manslkh/pickleball-mindmap/releases/tag/v2.0.0
