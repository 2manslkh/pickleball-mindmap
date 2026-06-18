// Headless verification that every ball-flight AnimSpec produces a trajectory
// that clears the net. Run with:  npx tsx scripts/verify-trajectories.ts
//
// Invariant checked: while the ball is over the net (|z| small), its BOTTOM
// (y - BALL_R) must stay above the net height at that x. This is the bug that
// caused balls to pass through the net.
import { skillContent } from '../lib/skill-content';
import {
  BALL_R,
  buildTrajectory,
  isBallTemplate,
  netHeightAt,
  SHOTS,
} from '../lib/court-physics';

let failures = 0;
let ballShots = 0;

for (const [id, content] of Object.entries(skillContent)) {
  const a = content.anim;
  if (!a.from || !a.to || a.concept || !isBallTemplate(a.template)) continue;
  ballShots++;

  const shot = { ...SHOTS[a.template], spin: a.spin ?? SHOTS[a.template].spin };
  const traj = buildTrajectory(a.from, a.to, shot);

  // Sample finely and find the worst clearance anywhere the ball is at/over net.
  let worst = Infinity;
  let worstZ = 0;
  let worstX = 0;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const [x, y, z] = traj.pos(t);
    if (Math.abs(z) > 0.15) continue; // only care about the net region
    const clearance = y - BALL_R - netHeightAt(x);
    if (clearance < worst) {
      worst = clearance;
      worstZ = z;
      worstX = x;
    }
  }

  const crosses = (a.from[1] > 0 && a.to[1] < 0) || (a.from[1] < 0 && a.to[1] > 0);
  if (!crosses) {
    console.log(`~ ${id.padEnd(12)} ${a.template.padEnd(11)} no net crossing (same-side path)`);
    continue;
  }

  const ok = worst >= 0;
  if (!ok) failures++;
  const mark = ok ? '✓' : '✗ THROUGH NET';
  console.log(
    `${ok ? '✓' : '✗'} ${id.padEnd(12)} ${a.template.padEnd(11)} clearance=${(worst * 100).toFixed(1).padStart(6)}cm  ` +
      `@x=${worstX.toFixed(2)} ${mark === '✓' ? '' : mark}`
  );
}

console.log(`\n${ballShots} ball shots checked, ${failures} through-net failures.`);
process.exit(failures > 0 ? 1 : 0);
