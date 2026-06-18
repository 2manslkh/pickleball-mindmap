'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { AnimSpec, PlayerMarker } from '@/lib/skill-content';
import { DEFAULT_PLAYERS } from '@/lib/skill-content';
import {
  BALL_R,
  buildTrajectory,
  HALF_W,
  HALF_L,
  isBallTemplate,
  KITCHEN,
  netHeightAt,
  NET_H_POST,
  NET_HALF_W,
  SHOTS,
} from '@/lib/court-physics';

const LINE_Y = 0.01;

const COLORS = {
  court: '#2E7D9A',
  kitchen: '#256B86',
  line: '#F1F5F9',
  netCord: '#0F172A',
  netTape: '#F8FAFC',
  post: '#0F172A',
  ball: '#FACC15',
  you: '#10B981',
  opp: '#DC2626',
  paddle: '#1F2937',
  zone: '#FACC15',
};

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---------------------------------------------------------------------------
// Court geometry
// ---------------------------------------------------------------------------
function lineSeg(x1: number, z1: number, x2: number, z2: number): [number, number, number][] {
  return [
    [x1, LINE_Y, z1],
    [x2, LINE_Y, z2],
  ];
}

function CourtSurface() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, HALF_L * 2]} />
        <meshStandardMaterial color={COLORS.court} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, KITCHEN / 2]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, KITCHEN]} />
        <meshStandardMaterial color={COLORS.kitchen} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -KITCHEN / 2]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, KITCHEN]} />
        <meshStandardMaterial color={COLORS.kitchen} />
      </mesh>
    </group>
  );
}

function CourtLines() {
  const segs: [number, number, number][][] = [
    lineSeg(-HALF_W, -HALF_L, HALF_W, -HALF_L),
    lineSeg(-HALF_W, HALF_L, HALF_W, HALF_L),
    lineSeg(-HALF_W, -HALF_L, -HALF_W, HALF_L),
    lineSeg(HALF_W, -HALF_L, HALF_W, HALF_L),
    lineSeg(-HALF_W, KITCHEN, HALF_W, KITCHEN),
    lineSeg(-HALF_W, -KITCHEN, HALF_W, -KITCHEN),
    lineSeg(0, KITCHEN, 0, HALF_L),
    lineSeg(0, -KITCHEN, 0, -HALF_L),
  ];
  return (
    <>
      {segs.map((pts, i) => (
        <Line key={i} points={pts} color={COLORS.line} lineWidth={2} />
      ))}
    </>
  );
}

function Net() {
  const SEG = 28;
  const { geom, tape } = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    const tapePts: [number, number, number][] = [];
    for (let i = 0; i <= SEG; i++) {
      const x = -NET_HALF_W + (2 * NET_HALF_W * i) / SEG;
      const h = netHeightAt(x);
      positions.push(x, 0, 0, x, h, 0);
      tapePts.push([x, h, 0]);
      if (i < SEG) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return { geom: g, tape: tapePts };
  }, []);

  return (
    <group>
      <mesh geometry={geom}>
        <meshStandardMaterial color={COLORS.netCord} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <Line points={tape} color={COLORS.netTape} lineWidth={3} />
      {[-NET_HALF_W, NET_HALF_W].map((x) => (
        <mesh key={x} position={[x, NET_H_POST / 2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, NET_H_POST, 10]} />
          <meshStandardMaterial color={COLORS.post} />
        </mesh>
      ))}
    </group>
  );
}

function Zone({ rect }: { rect: [number, number, number, number] }) {
  const [cx, cz, w, d] = rect;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.02, cz]}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial color={COLORS.zone} transparent opacity={0.28} side={THREE.DoubleSide} />
    </mesh>
  );
}

// A stylized ~1.75 m figure: capsule body + head + a swinging paddle arm.
function PlayerFigure({
  color,
  rootRef,
  armRef,
}: {
  color: string;
  rootRef: (el: THREE.Group | null) => void;
  armRef: (el: THREE.Group | null) => void;
}) {
  return (
    <group ref={rootRef}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.2, 1.15, 6, 14]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.62, 0]} castShadow>
        <sphereGeometry args={[0.16, 18, 18]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* shoulder pivot — rotates to swing the paddle */}
      <group ref={armRef} position={[0.2, 1.35, 0]}>
        <mesh position={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.05, 0.05]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.26, 0.2]} />
          <meshStandardMaterial color={COLORS.paddle} />
        </mesh>
      </group>
    </group>
  );
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function sideOf(z: number): 'you' | 'opp' {
  return z >= 0 ? 'you' : 'opp';
}

function nearestIdx(players: PlayerMarker[], pt: [number, number], team: 'you' | 'opp'): number {
  let best = -1;
  let bd = Infinity;
  players.forEach((p, i) => {
    if (p.team !== team) return;
    const d = (p.pos[0] - pt[0]) ** 2 + (p.pos[1] - pt[1]) ** 2;
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
}

// ---------------------------------------------------------------------------
// Scene — one master useFrame drives ball + every player so they stay in sync.
// ---------------------------------------------------------------------------
function Scene({ anim, replayKey }: { anim: AnimSpec; replayKey: number }) {
  const players = anim.players ?? DEFAULT_PLAYERS;
  const reduced = useMemo(prefersReducedMotion, []);
  const showBall = !!(anim.from && anim.to && !anim.concept && isBallTemplate(anim.template));

  const shot =
    showBall && isBallTemplate(anim.template)
      ? { ...SHOTS[anim.template], spin: anim.spin ?? SHOTS[anim.template].spin }
      : null;

  const traj = useMemo(() => {
    if (!showBall || !shot || !anim.from || !anim.to) return null;
    return buildTrajectory(anim.from, anim.to, shot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBall, anim.from?.[0], anim.from?.[1], anim.to?.[0], anim.to?.[1], anim.template, anim.spin, replayKey]);

  const trail = useMemo(() => {
    if (!traj) return [];
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 28; i++) pts.push(traj.pos(i / 28));
    return pts;
  }, [traj]);

  const strikerIdx = useMemo(
    () => (showBall && anim.from ? nearestIdx(players, anim.from, sideOf(anim.from[1])) : -1),
    [showBall, anim.from, players]
  );
  const receiverIdx = useMemo(
    () => (showBall && anim.to ? nearestIdx(players, anim.to, sideOf(anim.to[1])) : -1),
    [showBall, anim.to, players]
  );

  const ballRef = useRef<THREE.Mesh>(null);
  const rootRefs = useRef<(THREE.Group | null)[]>([]);
  const armRefs = useRef<(THREE.Group | null)[]>([]);
  const clock = useRef(0);

  const HOLD = 0.5;
  const BOUNCE_T = 0.5;

  useFrame((_, delta) => {
    clock.current += Math.min(delta, 0.05);
    const dur = traj?.duration ?? 1.2;
    const cyc = dur + (traj?.hasBounce ? BOUNCE_T : 0) + HOLD;
    const u = reduced ? cyc : clock.current % cyc;
    const fu = Math.min(u / dur, 1); // flight progress, clamped through bounce/hold

    // ----- ball -----
    if (ballRef.current && traj) {
      let p: [number, number, number];
      if (reduced) p = traj.rest;
      else if (u < dur) p = traj.pos(u / dur);
      else if (traj.hasBounce && u < dur + BOUNCE_T) p = traj.bounceAt((u - dur) / BOUNCE_T);
      else p = traj.rest;
      ballRef.current.position.set(p[0], p[1], p[2]);
      if (!reduced) ballRef.current.rotation.x += delta * traj.spinRate;
    }

    // ----- players -----
    players.forEach((pl, i) => {
      const root = rootRefs.current[i];
      const arm = armRefs.current[i];
      if (!root) return;
      const base = pl.pos;
      let px = base[0];
      let pz = base[1];
      let bob = 0;
      let swing = 0;

      if (!reduced) {
        const idle = 0.5 + 0.5 * Math.sin(clock.current * 2.6 + i * 1.7);
        bob = 0.03 * idle; // gentle ready bounce

        if (i === strikerIdx && traj && anim.from) {
          // The striker stands at the contact point (just behind the ball, away
          // from the net) and lunges through contact at the start of the cycle.
          // This puts a player at the baseline for serves/returns/drops without
          // every spec having to override player positions.
          swing = fu < 0.22 ? Math.sin((fu / 0.22) * Math.PI) : Math.max(0, 1 - (fu - 0.22) / 0.35);
          const back = pl.team === 'you' ? 0.45 : -0.45;
          px = anim.from[0];
          pz = anim.from[1] + back - back * 0.55 * swing;
        }

        if (i === receiverIdx && traj && anim.to) {
          const p2 = smooth(fu);
          let tgx = anim.to[0];
          let tgz = anim.to[1];
          if (pl.team === 'opp') tgz = Math.min(tgz, -0.45);
          else tgz = Math.max(tgz, 0.45);
          tgx = Math.max(-HALF_W, Math.min(HALF_W, tgx));
          px = base[0] + (tgx - base[0]) * 0.55 * p2;
          pz = base[1] + (tgz - base[1]) * 0.55 * p2;
          if (fu > 0.7) bob += 0.07 * Math.sin(((fu - 0.7) / 0.3) * Math.PI); // split-step
        }
      }

      root.position.set(px, bob, pz);
      root.rotation.y = pl.team === 'you' ? Math.PI : 0;
      root.rotation.x = 0.2 * swing;
      if (arm) arm.rotation.z = -1.5 * swing;
    });
  });

  return (
    <>
      <CourtSurface />
      <CourtLines />
      <Net />
      {players.map((pl, i) => (
        <PlayerFigure
          key={i}
          color={pl.team === 'you' ? COLORS.you : COLORS.opp}
          rootRef={(el) => {
            rootRefs.current[i] = el;
          }}
          armRef={(el) => {
            armRefs.current[i] = el;
          }}
        />
      ))}
      {anim.highlight && <Zone rect={anim.highlight} />}
      {traj && (
        <>
          <Line points={trail} color={COLORS.ball} lineWidth={1.5} dashed dashSize={0.18} gapSize={0.12} />
          <mesh ref={ballRef} castShadow>
            <sphereGeometry args={[BALL_R, 22, 22]} />
            <meshStandardMaterial color={COLORS.ball} emissive={COLORS.ball} emissiveIntensity={0.25} />
          </mesh>
        </>
      )}
    </>
  );
}

export interface Court3DProps {
  anim: AnimSpec;
}

export default function Court3D({ anim }: Court3DProps) {
  const [key, setKey] = useState(0); // replay by remounting the scene clock
  const hasBall = !!(anim.from && anim.to && !anim.concept);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 280,
        borderRadius: 'var(--r-logo)',
        overflow: 'hidden',
        background: '#1B5870',
      }}
    >
      <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 6.8, 10], fov: 42 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 10, 6]} intensity={1.1} castShadow />
        <Scene key={key} anim={anim} replayKey={key} />
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0.4, 0]}
        />
      </Canvas>
      {hasBall && (
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-pill)',
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            color: 'var(--ink)',
          }}
        >
          ↻ Replay
        </button>
      )}
      {anim.note && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            maxWidth: '62%',
            background: 'rgba(15,23,42,0.62)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 'var(--r-pill)',
            pointerEvents: 'none',
          }}
        >
          {anim.note}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(15,23,42,0.55)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 600,
          padding: '4px 9px',
          borderRadius: 'var(--r-pill)',
          pointerEvents: 'none',
        }}
      >
        Drag to orbit · pinch/scroll to zoom
      </div>
    </div>
  );
}
