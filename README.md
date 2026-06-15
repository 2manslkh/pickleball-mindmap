# 🏓 Pickleball Strategy — Grandmaster Edition

A chess-grandmaster framework for pickleball strategy. Rate your skills across five
strategic pillars, track progress, and quiz yourself. All data is stored locally in
your browser (localStorage) — no account, no backend.

Built with **Next.js 16** (App Router, React 19, TypeScript). The visual design follows
the [DIP](../dip) design system (clean light-editorial: green-primary, gold accents,
Plus Jakarta Sans). Installable as a PWA.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)              |
| `npm run build` | Production build (runs the TypeScript checks) |
| `npm run start` | Serve the production build                     |
| `npm run lint`  | ESLint (flat config, `eslint-config-next`)    |

## Project layout

```
app/
  layout.tsx        Root layout, fonts (next/font), metadata, PWA manifest hookup
  page.tsx          Top-level client component: all state + localStorage + handlers
  globals.css       The DIP design-token stylesheet (CSS variables)
  manifest.ts       Web app manifest (PWA)
  icon.png          Favicon / PWA icon (auto-served by Next)
  apple-icon.png    Apple touch icon
components/
  Header.tsx        App header, overall progress bar, pillar tabs
  PillarView.tsx    Pillar hero + skill groups
  SkillCard.tsx     A rateable skill row (1–5 with notes)
  QuizOverlay.tsx   The quiz flow (spaced-repetition pick, scoring, results)
  Dashboard.tsx     Radar chart, weak skills, quiz history, data export/import/reset
  ServiceWorkerRegister.tsx
lib/
  data.ts           Pillars, skills, and quiz questions (+ types)
  stats.ts          Rating + pillar-stat helpers
  quiz.ts           Question picking and shuffle
  storage.ts        useLocalStorageState hook (SSR-safe)
public/
  sw.js             Minimal service worker (offline + installability)
  icon-*.png        PWA manifest icons
```

## Data

Progress lives in `localStorage` under `pickleball-gm-*` keys. Use the dashboard's
**Your Data** section (or the header buttons) to export/import a JSON backup or reset
everything.

## Deployment

Deploys to **Vercel** as a standard Next.js app (`vercel.json` pins the `nextjs`
framework). Push to the default branch or run `vercel`.

## Releasing (semantic versioning)

This project follows [SemVer](https://semver.org) and tracks releases with annotated
git tags (`vMAJOR.MINOR.PATCH`) and [`CHANGELOG.md`](./CHANGELOG.md).

To cut a release, move the relevant `[Unreleased]` notes into a new version section in
the changelog, commit, then run one of:

```bash
npm run release:patch   # 2.0.0 -> 2.0.1  (bugfixes)
npm run release:minor   # 2.0.0 -> 2.1.0  (new features, backwards compatible)
npm run release:major   # 2.0.0 -> 3.0.0  (breaking changes)
```

Each script bumps `package.json`, creates a `chore(release): vX.Y.Z` commit and a
matching annotated tag, and pushes the commit and tag (`git push --follow-tags`).
The tag `vX.Y.Z` always points to the commit where `package.json` is at that version.
