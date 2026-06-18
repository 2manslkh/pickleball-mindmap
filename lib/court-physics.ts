// Pickleball court physics — pure, render-free trajectory math shared by the
// Court3D renderer and the trajectory verification test. No three.js imports
// here so it can run in plain Node.
//
// OFFICIAL DIMENSIONS (USA Pickleball), world units = metres.
//   x: sideline → sideline,  z: baseline → baseline,  y: up.  Net at z = 0.
import type { AnimTemplate } from './skill-content';

export const HALF_W = 3.048; // 20 ft court width / 2
export const HALF_L = 6.705; // 44 ft court length / 2
export const KITCHEN = 2.134; // 7 ft non-volley zone from the net
export const NET_H_CENTER = 0.8636; // 34 in at center
export const NET_H_POST = 0.9144; // 36 in at the posts
export const NET_HALF_W = 3.353; // posts 1 ft outside each sideline (22 ft span)
// Ball is enlarged ~2.4x over the real 3.7 cm radius purely for legibility on a
// ~13 m court rendered into ~280 px. Trajectory math uses this value so
// landings/clearances stay self-consistent.
export const BALL_R = 0.09;

// Net height at a given x — parabolic sag from 36" posts to 34" center.
export function netHeightAt(x: number): number {
  const f = Math.min(Math.abs(x) / NET_HALF_W, 1);
  return NET_H_CENTER + (NET_H_POST - NET_H_CENTER) * f * f;
}

// ---------------------------------------------------------------------------
// SHOT PHYSICS TABLE — one row per ball-flight template.
//   contactH : launch height at the striker's paddle (m)
//   targetH  : ball height at `to` — court level (≈BALL_R) for groundstrokes
//              that bounce, or contact height for volleys hit out of the air
//   netMargin: minimum clearance of the ball's BOTTOM over the net tape (m)
//   bounce   : true → ball bounces at the landing point; false → volley
//   duration : flight time in seconds (slower = floatier)
//   spin     : default spin if the spec doesn't set one
// ---------------------------------------------------------------------------
export interface ShotPhysics {
  contactH: number;
  targetH: number;
  netMargin: number;
  bounce: boolean;
  duration: number;
  spin: 'top' | 'flat' | 'slice';
}

export type BallTemplate = Exclude<AnimTemplate, 'formation' | 'courtZone'>;

export const SHOTS: Record<BallTemplate, ShotPhysics> = {
  serve: { contactH: 0.85, targetH: BALL_R, netMargin: 0.45, bounce: true, duration: 1.5, spin: 'flat' },
  return: { contactH: 0.8, targetH: BALL_R, netMargin: 0.4, bounce: true, duration: 1.5, spin: 'flat' },
  drive: { contactH: 0.62, targetH: BALL_R, netMargin: 0.12, bounce: true, duration: 0.95, spin: 'top' },
  drop: { contactH: 0.6, targetH: BALL_R, netMargin: 0.32, bounce: true, duration: 1.35, spin: 'flat' },
  dink: { contactH: 0.5, targetH: BALL_R, netMargin: 0.07, bounce: true, duration: 1.25, spin: 'flat' },
  lob: { contactH: 0.7, targetH: BALL_R, netMargin: 1.7, bounce: true, duration: 1.95, spin: 'flat' },
  smash: { contactH: 1.55, targetH: BALL_R, netMargin: 0.18, bounce: true, duration: 0.8, spin: 'flat' },
  rollVolley: { contactH: 0.7, targetH: 0.45, netMargin: 0.22, bounce: false, duration: 0.95, spin: 'top' },
  speedup: { contactH: 0.75, targetH: 0.72, netMargin: 0.12, bounce: false, duration: 0.78, spin: 'flat' },
  blockReset: { contactH: 0.45, targetH: BALL_R, netMargin: 0.16, bounce: true, duration: 1.15, spin: 'slice' },
  erne: { contactH: 0.85, targetH: 0.55, netMargin: 0.18, bounce: false, duration: 0.8, spin: 'flat' },
  crossCourt: { contactH: 0.5, targetH: BALL_R, netMargin: 0.07, bounce: true, duration: 1.3, spin: 'flat' },
  downLine: { contactH: 0.5, targetH: BALL_R, netMargin: 0.16, bounce: true, duration: 1.1, spin: 'flat' },
};

export const isBallTemplate = (t: AnimTemplate): t is BallTemplate => t in SHOTS;

export const spinSkew = (spin: 'top' | 'flat' | 'slice') =>
  spin === 'top' ? 0.6 : spin === 'slice' ? -0.45 : 0;

// Apex-shape bump: 0 at t=0 and t=1, peak skewed earlier (topspin) or later (slice).
export function bump(t: number, skew: number): number {
  return t * (1 - t) * (1 + skew * (1 - 2 * t));
}

export interface Trajectory {
  pos: (t: number) => [number, number, number]; // flight, t ∈ [0,1]
  bounceAt: (t: number) => [number, number, number]; // bounce, t ∈ [0,1]
  rest: [number, number, number];
  hasBounce: boolean;
  duration: number;
  spinRate: number;
  tNet: number | null; // flight param where z = 0 (null if the path never crosses)
}

// A gravity parabola whose curvature is solved so the ball clears the net (at
// its real height for the crossing x) by `netMargin`. Endpoints are the contact
// and target heights, so launch/landing are physically honest.
export function buildTrajectory(
  from: [number, number],
  to: [number, number],
  shot: ShotPhysics
): Trajectory {
  const [fx, fz] = from;
  const [tx, tz] = to;
  const h0 = shot.contactH;
  const h1 = shot.targetH;
  const skew = spinSkew(shot.spin);

  const crosses = (fz > 0 && tz < 0) || (fz < 0 && tz > 0);
  const tNet = crosses ? fz / (fz - tz) : null;
  const tNetSolve = Math.min(0.82, Math.max(0.18, tNet ?? 0.5));
  const xCross = fx + (tx - fx) * tNetSolve;
  const yClear = netHeightAt(xCross) + shot.netMargin + BALL_R;

  const bAtNet = bump(tNetSolve, skew) || 0.0001;
  let k = (yClear - h0 - (h1 - h0) * tNetSolve) / bAtNet;
  k = Math.min(7, Math.max(0.05, k));

  const pos = (t: number): [number, number, number] => {
    const x = fx + (tx - fx) * t;
    const z = fz + (tz - fz) * t;
    const y = Math.max(BALL_R, h0 + (h1 - h0) * t + k * bump(t, skew));
    return [x, y, z];
  };

  const dx = tx - fx;
  const dz = tz - fz;
  const dl = Math.hypot(dx, dz) || 1;
  const bounceH = Math.min(0.55, 0.22 + 0.14 * Math.max(0, k - 0.8));
  const bounceLen = 0.6;
  const bounceAt = (t: number): [number, number, number] => {
    const x = tx + (dx / dl) * bounceLen * t;
    const z = tz + (dz / dl) * bounceLen * t;
    const y = BALL_R + bounceH * Math.sin(Math.PI * t);
    return [x, y, z];
  };

  const rest: [number, number, number] = shot.bounce
    ? [tx + (dx / dl) * bounceLen, BALL_R, tz + (dz / dl) * bounceLen]
    : [tx, h1, tz];

  const spinRate = shot.spin === 'top' ? 16 : shot.spin === 'slice' ? -9 : 7;
  return { pos, bounceAt, rest, hasBounce: shot.bounce, duration: shot.duration, spinRate, tNet };
}
