# Skill Tree + Per-Skill Content (explanation, video, 3D drill) — Design

Date: 2026-06-15
Branch: redesign-dip-editorial
Status: Approved (verbal), ready for implementation plan

## Goal

Add to the Next.js pickleball-strategy app:
1. An interactive **skill tree visualization** of the existing hierarchy
   (5 pillars → 18 groups → 57 skills).
2. For each skill: a richer **explanation**, **YouTube tutorial links**, and a
   **stylized 3D animation** of the drill/technique on a pickleball court.

## Decisions (locked with user)

- **3D**: stylized, orbit-able 3D court scene (react-three-fiber), driven by
  per-skill parametric data. Applies to all skills; concept skills get an
  illustrative scene + note rather than a faked ball flight.
- **Video**: curated YouTube **search-query** links (e.g.
  `youtube.com/results?search_query=pickleball+roll+volley+tutorial`). Never
  hard-coded video IDs — avoids broken links / fabrication.
- **Tree**: a new full-screen **Tree** view (toggle alongside the existing
  list); nodes colored by current rating; tap a skill node → Skill Detail.

## Architecture

Existing: Next 16 app-router single client page (`app/page.tsx`) with overlay
components (Header, PillarView, SkillCard, QuizOverlay, Dashboard); ratings in
`localStorage` via `lib/storage.ts`; hierarchy + quiz data in `lib/data.ts`.

New units (each one purpose, well-bounded):

### 1. `lib/skill-content.ts` — content layer
- `SkillContent { explanation: string; youtube: string[]; anim: AnimSpec }`
- `content: Record<SkillId, SkillContent>` for all 57 skills.
- `explanation`: 2–4 factual coaching sentences (authored from domain
  knowledge), richer than the existing one-line `sub`.
- `youtube`: one or more search query strings → rendered as valid search links.
- `anim`: `{ template: AnimTemplate; params: AnimParams }`.
- Kept separate from `data.ts` so the hierarchy stays clean and content is
  independently editable.

### 2. Animation model (in `lib/skill-content.ts` / `lib/anim.ts`)
- ~12–15 **templates** parameterize all 57 skills:
  `serve, return, drive, drop, dink, lob, smash, rollVolley, speedup,
  blockReset, erne, formation, crossCourt, downLine, courtZone`.
- `AnimParams`: ball path control points (start/peak/end in court coords),
  arc height, player marker positions, highlighted target zone, optional note.
- Concept skills (psychology, shot selection, mental) → `courtZone`/`formation`
  illustrative template + a short on-screen note; rely on explanation + video.

### 3. `components/court3d/` — 3D scene
- `Court3D.tsx`: `@react-three/fiber` `<Canvas>` — court surface, lines,
  kitchen, net; `@react-three/drei` `OrbitControls`. Play/pause/replay.
- `BallTrajectory.tsx`: animates a sphere along a parabolic/Bézier path (loop).
- `PlayerMarkers.tsx`: player position pucks.
- Driver hook interprets `AnimSpec`.
- **Lazy-loaded** with `next/dynamic` `{ ssr:false }` so three.js (~150KB gz)
  loads only when a Skill Detail opens.
- Mobile: cap DPR (≤2), simple geometry, pause when offscreen.
- `prefers-reduced-motion` → render a static frame, no loop.

### 4. `components/tree/SkillTree.tsx` — visualization
- Layout via `d3-hierarchy` (layered tree); custom SVG node + edge rendering.
- ~80 nodes (5 + 18 + 57). Skill nodes colored by rating (`levelColors`).
- Lightweight pan/zoom (SVG transform; pointer/wheel handlers).
- Tap a skill node → `onSelectSkill(id)` → opens Skill Detail.
- Pillar/group nodes are structural (expand/scroll focus only).

### 5. `components/SkillDetail.tsx` — per-skill panel
- Overlay (consistent with Quiz/Dashboard overlays). Shows: title + pillar +
  rating control (reuse existing logic), **explanation**, **3D animation**
  (`Court3D` with the skill's `AnimSpec`), **Watch tutorials** (YouTube search
  links), notes.
- Opened from both tree nodes and existing list cards (add a "Learn / 3D"
  affordance to `SkillCard`).

### 6. `components/Header.tsx` — navigation
- Add a **List / Tree** view toggle. Dashboard, quiz, import/export unchanged.

## Data flow

`data.ts` (hierarchy) + `skill-content.ts` (content) → `SkillTree` builds nodes
from pillars + ratings (`storage`) → select skill → `SkillDetail(id)` reads
content + rating → `Court3D` reads `AnimSpec`. Ratings persistence unchanged.

State: client view state in `app/page.tsx` (`view: 'list'|'tree'`,
`selectedSkillId`). No new routes for now.

## Dependencies

`three`, `@react-three/fiber`, `@react-three/drei`, `d3-hierarchy`,
`@types/d3-hierarchy`. Compatible with React 19 / Next 16.

## Scope

In: the units above, content for all 57 skills, one tree layout, search-link
videos, lazy 3D.
Out (YAGNI): bespoke hand-animated characters/mocap, user-uploaded video,
shareable deep-link URLs, multiple tree layouts.

## Verification

- `next build` compiles + type-checks + prerenders.
- Browser dogfood (mobile 390×844): Tree renders + pan/zoom; node → detail;
  3D canvas mounts and animates; YouTube links open valid searches; no console
  errors. Spot-check a physical skill (roll volley) and a concept skill
  (reset after every point).

## Risks / mitigations

- **Bundle size (three.js)** → lazy-load behind Skill Detail.
- **r3f vs React 19 / Next 16 SSR** → `@react-three/fiber` v9 supports React
  19; render client-only via `dynamic({ ssr:false })`.
- **57 unique animations infeasible** → template + params keeps authoring
  tractable; concept skills use illustrative defaults, not fake drills.
- **Mobile perf** → DPR cap, offscreen pause, reduced-motion static frame.
