'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { AnimSpec, PlayerMarker } from '@/lib/skill-content';
import { DEFAULT_PLAYERS } from '@/lib/skill-content';

// Court half-dimensions (world units ≈ metres). x: sideline, z: baseline.
const HALF_W = 3.05;
const HALF_L = 6.7;
const KITCHEN = 2.13;
const NET_H = 0.86;
const BALL_R = 0.13;
const LINE_Y = 0.02;

const COLORS = {
  court: '#2E7D9A',
  kitchen: '#256B86',
  line: '#F1F5F9',
  net: '#0F172A',
  ball: '#FACC15',
  you: '#10B981',
  opp: '#DC2626',
  zone: '#FACC15',
};

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function lineSeg(x1: number, z1: number, x2: number, z2: number): [number, number, number][] {
  return [
    [x1, LINE_Y, z1],
    [x2, LINE_Y, z2],
  ];
}

function CourtSurface() {
  return (
    <group>
      {/* playing surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, HALF_L * 2]} />
        <meshStandardMaterial color={COLORS.court} />
      </mesh>
      {/* kitchens (both sides) slightly different shade */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, KITCHEN / 2]}>
        <planeGeometry args={[HALF_W * 2, KITCHEN]} />
        <meshStandardMaterial color={COLORS.kitchen} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -KITCHEN / 2]}>
        <planeGeometry args={[HALF_W * 2, KITCHEN]} />
        <meshStandardMaterial color={COLORS.kitchen} />
      </mesh>
    </group>
  );
}

function CourtLines() {
  const segs: [number, number, number][][] = [
    // perimeter
    lineSeg(-HALF_W, -HALF_L, HALF_W, -HALF_L),
    lineSeg(-HALF_W, HALF_L, HALF_W, HALF_L),
    lineSeg(-HALF_W, -HALF_L, -HALF_W, HALF_L),
    lineSeg(HALF_W, -HALF_L, HALF_W, HALF_L),
    // kitchen lines
    lineSeg(-HALF_W, KITCHEN, HALF_W, KITCHEN),
    lineSeg(-HALF_W, -KITCHEN, HALF_W, -KITCHEN),
    // center service lines (baseline -> kitchen, both sides)
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
  return (
    <group>
      <mesh position={[0, NET_H / 2, 0]}>
        <boxGeometry args={[HALF_W * 2 + 0.3, NET_H, 0.04]} />
        <meshStandardMaterial color={COLORS.net} transparent opacity={0.55} />
      </mesh>
      {/* tape */}
      <mesh position={[0, NET_H, 0]}>
        <boxGeometry args={[HALF_W * 2 + 0.3, 0.05, 0.06]} />
        <meshStandardMaterial color={COLORS.line} />
      </mesh>
    </group>
  );
}

function Players({ players }: { players: PlayerMarker[] }) {
  return (
    <>
      {players.map((p, i) => (
        <mesh key={i} position={[p.pos[0], 0.3, p.pos[1]]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.6, 20]} />
          <meshStandardMaterial color={p.team === 'you' ? COLORS.you : COLORS.opp} />
        </mesh>
      ))}
    </>
  );
}

function Zone({ rect }: { rect: [number, number, number, number] }) {
  const [cx, cz, w, d] = rect;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.03, cz]}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial color={COLORS.zone} transparent opacity={0.28} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Ball({ from, to, arc }: { from: [number, number]; to: [number, number]; arc: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const reduced = useMemo(prefersReducedMotion, []);
  const pathRef = useRef<[number, number, number][]>([]);

  // Precompute a trail polyline for context.
  const trail = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 24; i++) {
      const tt = i / 24;
      pts.push(ballPos(from, to, arc, tt));
    }
    return pts;
  }, [from, to, arc]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (reduced) {
      const p = ballPos(from, to, arc, 1);
      ref.current.position.set(p[0], p[1], p[2]);
      return;
    }
    // advance, with a brief hold at the end before looping
    t.current += delta / 2.2;
    if (t.current > 1.35) t.current = 0;
    const tt = Math.min(t.current, 1);
    const p = ballPos(from, to, arc, tt);
    ref.current.position.set(p[0], p[1], p[2]);
  });

  pathRef.current = trail;

  return (
    <group>
      <Line points={trail} color={COLORS.ball} lineWidth={1.5} dashed dashSize={0.15} gapSize={0.12} />
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[BALL_R, 20, 20]} />
        <meshStandardMaterial color={COLORS.ball} emissive={COLORS.ball} emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function ballPos(
  from: [number, number],
  to: [number, number],
  arc: number,
  t: number
): [number, number, number] {
  const x = from[0] + (to[0] - from[0]) * t;
  const z = from[1] + (to[1] - from[1]) * t;
  const y = arc * 4 * t * (1 - t) + BALL_R;
  return [x, y, z];
}

export interface Court3DProps {
  anim: AnimSpec;
}

export default function Court3D({ anim }: Court3DProps) {
  const players = anim.players ?? DEFAULT_PLAYERS;
  const showBall = !!(anim.from && anim.to);
  const arc = anim.arc ?? defaultArc(anim.template);
  const [key, setKey] = useState(0); // replay by remounting the ball

  return (
    <div style={{ position: 'relative', width: '100%', height: 280, borderRadius: 'var(--r-logo)', overflow: 'hidden', background: '#1B5870' }}>
      <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 6.5, 9.5], fov: 42 }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 9, 6]} intensity={1.1} castShadow />
        <CourtSurface />
        <CourtLines />
        <Net />
        <Players players={players} />
        {anim.highlight && <Zone rect={anim.highlight} />}
        {showBall && <Ball key={key} from={anim.from!} to={anim.to!} arc={arc} />}
        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />
      </Canvas>
      {showBall && (
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

function defaultArc(template: AnimSpec['template']): number {
  switch (template) {
    case 'lob':
      return 2.4;
    case 'serve':
    case 'return':
      return 1.1;
    case 'drop':
      return 1.5;
    case 'smash':
    case 'speedup':
      return 0.2;
    default:
      return 0.55;
  }
}
