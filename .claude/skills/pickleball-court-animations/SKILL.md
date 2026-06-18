---
name: pickleball-court-animations
description: Use when creating, editing, debugging, or regenerating the 3D court animations (AnimSpec / Court3D) in the pickleball-mindmap app — e.g. a ball passes through the net, a shot arc looks wrong, players don't move, or a new skill needs a drill visualization.
---

# Pickleball Court 3D Animations

## Overview

Each skill card shows a looping 3D drill on a Three.js court (`@react-three/fiber`). You describe a shot **declaratively** — where the ball starts, where it ends, and the shot *type* — and the renderer derives the whole 3D flight from physics.

**Core principle: you choose WHERE the ball goes and WHAT shot it is. You never set arc heights.** The renderer solves a gravity parabola whose curvature is guaranteed to clear the net (at its real sagging height for the crossing point) by a shot-appropriate margin, then bounces. Authoring a path that "looks right" by guessing a peak height is exactly the bug class this system removes.

## The three files

| File | Role | Edit when |
|------|------|-----------|
| `lib/skill-content.ts` | The `AnimSpec` data — one per skill (`from`, `to`, `template`, `spin`, `players`, `highlight`, `note`, `concept`). | Adding/changing a skill's drill. **This is where you author.** |
| `lib/court-physics.ts` | Pure trajectory math: court dims, net sag, `SHOTS` table, `buildTrajectory`. No three.js. | Adding a new shot template or tuning physics. |
| `components/court3d/Court3D.tsx` | Renderer: court, net, animated player figures, the master `useFrame` loop. | Changing visuals or player animation. |

## Coordinate system (official USA Pickleball dimensions, metres)

```
x: sideline → sideline   [-3.05 .. 3.05]   (court 6.10 m / 20 ft wide)
z: baseline → baseline   [-6.71 .. 6.71]   (court 13.41 m / 44 ft long)
net at z = 0             kitchen lines at z = ±2.13 (7 ft)
net sags: 0.914 m (36 in) at the posts → 0.864 m (34 in) at center
"You" = near side (z > 0)   ·   Opponents = far side (z < 0)
```

`from` and `to` are `[x, z]` ground positions. Height is computed, never given.

**Default conventions** (so "deep" and "backhand" aren't guesses):
- **Handedness:** assume right-handed players. An opponent's backhand corner is their **left** = far side, **positive** `x`. A "you" player's backhand is your left = near side, negative `x`.
- **Depth targets:** "deep" landing ≈ `z` between ±5.4 and ±6.0 (just inside the baseline). Kitchen landing ≈ `z` between ±1.6 and ±2.0. A body/volley `to.z` sits just past the opponent's kitchen line (≈ ±2.4 to ±2.6).

## Authoring an AnimSpec — the workflow

1. **Pick the template** from the table below. It sets contact height, net clearance, bounce vs volley, speed, and default spin.
2. **Set `from`** = the striker's contact point `[x, z]`. A player figure is auto-placed there, so for a serve use a baseline `z` (~6.4), for a dink use a kitchen-line `z` (~2.4).
3. **Set `to`** = where the ball ends. For a **groundstroke** (`bounce: true`) this is the landing spot; for a **volley** (`bounce: false`) it's the opponent's in-air contact point. The renderer handles the height.
4. **`from` and `to` MUST be on opposite sides of the net** (`from.z` and `to.z` have opposite signs). Every shot crosses the net. A same-side path renders with no net constraint and reads as wrong.
5. Optionally set `spin` (`'top'` dips steeper, `'slice'` floats, `'flat'`), `players`, `highlight: [cx, cz, w, d]`, and `note`.
6. **Verify** (see below). The check must report `0 through-net failures`.

```ts
// A backhand-targeted cross-court dink from the right kitchen.
w1: {
  explanation: '...',
  youtube: yt('pickleball attack backhand'),
  anim: { template: 'dink', from: [1.2, 2.4], to: [-1.9, -1.9], spin: 'slice' },
}
```

## Shot template reference

| template | use for | `to` is | bounces | net clearance |
|----------|---------|---------|---------|---------------|
| `serve` | serve from baseline | deep landing | yes | comfortable (~45 cm) |
| `return` | return of serve | deep landing | yes | comfortable |
| `drive` | hard groundstroke / 3rd-shot drive | landing | yes | low skim (~8 cm), topspin |
| `drop` | 3rd/5th-shot drop into kitchen | kitchen landing | yes | soft (~20 cm) |
| `dink` | kitchen dink | kitchen landing | yes | barely clears (~3-6 cm) |
| `crossCourt` | cross-court dink/angle | kitchen landing | yes | barely clears |
| `downLine` | down-the-line dink | kitchen landing | yes | a bit more (higher net at sideline) |
| `lob` | offensive/defensive lob | deep landing | yes | way over (>1 m) |
| `smash` | overhead | landing | yes | steep down, hit from ~1.55 m |
| `speedup` | flat speed-up at a body | **in-air contact (~0.7 m)** | no | low |
| `rollVolley` | topspin roll volley | **in-air contact (~0.45 m)** | no | dips with topspin |
| `blockReset` | soft block/reset off a hard ball | kitchen landing | yes | soft |
| `erne` | volley from beside the net post | **in-air contact** | no | low |
| `formation`, `courtZone` | **concept only — no ball.** Use with `concept: true`, `note`, `highlight`, `players`. | — | — | — |

To add a new shot type: add a row to `SHOTS` in `lib/court-physics.ts` and the name to the `AnimTemplate` union in `lib/skill-content.ts`. Pick `contactH`, `targetH`, `netMargin`, `bounce`, `duration`, default `spin`. Then verify.

## Concept (no-ball) skills

For strategy ideas with no single shot, use `concept: true` with a `courtZone` or `formation` template and show a `highlight` rectangle + `note`:

```ts
anim: { template: 'courtZone', concept: true, highlight: [-1.6, -2.6, 1.6, 1.4], note: 'Find it, then go back to it' }
```

## Players animate automatically

Don't hand-animate players. The renderer auto-detects the **striker** (nearest player on `from`'s side) and the **receiver** (nearest on `to`'s side):
- Striker stands at the contact point and swings the paddle through the ball.
- Receiver shifts toward the landing/contact point and split-steps as the ball arrives.
- Everyone has a gentle ready-bounce.

Override formation only when the *positioning* is the teaching point (stacking, sliding as a unit) via the `players` array. `DEFAULT_PLAYERS` is doubles-at-kitchen.

## Verification — REQUIRED before claiming done

Net clearance is not eyeballed. Run the headless check over every spec:

```bash
npx tsx scripts/verify-trajectories.ts
```

It builds the real trajectory for each ball spec, samples the net region, and asserts the ball's bottom stays above the net. **It must print `0 through-net failures`.** A WebGL screenshot is NOT sufficient (and often impossible headlessly) — the math check is the source of truth. Also run `npx tsc --noEmit`.

## Common mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Guessing a low arc / peak height | Ball passes through the net | There is no arc field. Choose the right `template`; physics clears the net. |
| `from` and `to` on the same side of the net | Flat path, no net interaction, looks broken | Opposite signs on `from.z` / `to.z`. Every shot crosses z = 0. |
| Using `dink`/`drive` for a body speed-up | Ball lands on the floor instead of arriving at the body | Use `speedup`/`rollVolley` (volleys; `to` is in-air). |
| Serve `from` at the kitchen line | Server figure stands at the net | Serves/returns/drops start at a baseline `z` (~5.8-6.4). |
| Forgetting `concept: true` on a strategy card | Renderer tries to fly a ball with no real shot | Set `concept: true` + `courtZone`/`formation`. |
| Editing the duplicated math in `Court3D.tsx` | Drift between render and verifier | Physics lives ONLY in `lib/court-physics.ts`. Edit there. |
| Claiming done off a screenshot | Through-net bugs slip by (WebGL often blank headlessly) | Run `verify-trajectories.ts`; require 0 failures. |
