'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  PointerEvent as RPointerEvent,
  WheelEvent as RWheelEvent,
} from 'react';
import { hierarchy, tree, HierarchyPointNode } from 'd3-hierarchy';
import { pillars, levelColors, Pillar, Skill, SkillGroup } from '@/lib/data';
import { getRating, Ratings } from '@/lib/stats';

type NodeDatum =
  | { type: 'root'; name: string }
  | { type: 'pillar'; name: string; pillar: Pillar }
  | { type: 'group'; name: string }
  | { type: 'skill'; name: string; skill: Skill };

interface Props {
  ratings: Ratings;
  onSelectSkill: (id: string) => void;
}

const LEVEL_GAP = 230; // horizontal distance between depths
const ROW_GAP = 26; // vertical distance between sibling leaves

type NodeDatumNode = NodeDatum & { children?: NodeDatumNode[] };

function buildRoot(): NodeDatumNode {
  return {
    type: 'root',
    name: 'root',
    children: pillars.map(
      (p): NodeDatumNode => ({
        type: 'pillar',
        name: p.label,
        pillar: p,
        children: p.groups.map(
          (g: SkillGroup): NodeDatumNode => ({
            type: 'group',
            name: g.label,
            children: g.skills.map(
              (s): NodeDatumNode => ({ type: 'skill', name: s.label, skill: s })
            ),
          })
        ),
      })
    ),
  };
}

export default function SkillTree({ ratings, onSelectSkill }: Props) {
  const { nodes, links, minX, maxX, maxY } = useMemo(() => {
    const root = hierarchy<NodeDatumNode>(buildRoot() as NodeDatumNode);
    const layout = tree<NodeDatumNode>().nodeSize([ROW_GAP, LEVEL_GAP]);
    const laid = layout(root);
    const ns = laid.descendants();
    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    ns.forEach((n) => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      maxY = Math.max(maxY, n.y);
    });
    return { nodes: ns, links: laid.links(), minX, maxX, maxY };
  }, []);

  // pan/zoom transform
  const wrapRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 16, y: 40, k: 0.7 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const moved = useRef(false);

  // Fit the whole tree to the container: width-fit zoom, anchored at left,
  // vertically centered on the breadth midpoint.
  const fit = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const LABEL_PAD = 170; // room for the longest skill label past its node
    const contentW = maxY + LABEL_PAD;
    const k = Math.max(0.42, Math.min(1, W / contentW));
    const midX = (minX + maxX) / 2;
    setT({ x: 16 - LEVEL_GAP * k, y: H / 2 - midX * k, k });
  }, [maxY, minX, maxX]);

  useEffect(() => {
    fit();
  }, [fit]);

  const transform = t;

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
    moved.current = false;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
    setT((cur) => ({ ...cur, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onWheel = (e: RWheelEvent<SVGSVGElement>) => {
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setT((cur) => ({ ...cur, k: Math.min(2.5, Math.max(0.4, cur.k * factor)) }));
  };
  const zoom = (dir: number) =>
    setT((cur) => ({ ...cur, k: Math.min(2.5, Math.max(0.4, cur.k * (dir > 0 ? 1.2 : 1 / 1.2))) }));
  const reset = () => fit();

  return (
    <div className="tree-wrap" ref={wrapRef}>
      <svg
        className="tree-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {links.map((l, i) => {
            const s = l.source as HierarchyPointNode<NodeDatumNode>;
            const d = l.target as HierarchyPointNode<NodeDatumNode>;
            const mid = (s.y + d.y) / 2;
            return (
              <path
                key={i}
                d={`M${s.y},${s.x} C${mid},${s.x} ${mid},${d.x} ${d.y},${d.x}`}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth={1.5}
              />
            );
          })}
          {nodes.map((n, i) => (
            <TreeNode key={i} node={n} ratings={ratings} onSelectSkill={onSelectSkill} pressedMoved={moved} />
          ))}
        </g>
      </svg>

      <div className="tree-controls">
        <button onClick={() => zoom(1)} aria-label="Zoom in">＋</button>
        <button onClick={() => zoom(-1)} aria-label="Zoom out">－</button>
        <button onClick={reset} aria-label="Reset view">⤢</button>
      </div>

      <div className="tree-legend">
        <span className="tl-title">Your level</span>
        {['Not rated', 'Beginner', 'Developing', 'Competent', 'Advanced', 'Elite'].map((lvl, i) => (
          <span key={i} className="tl-item">
            <i style={{ background: i === 0 ? '#CBD5E1' : levelColors[i] }} />
            {lvl}
          </span>
        ))}
      </div>
      <div className="tree-hint">Drag to pan · scroll / ＋－ to zoom · tap a skill</div>
    </div>
  );
}

function TreeNode({
  node,
  ratings,
  onSelectSkill,
  pressedMoved,
}: {
  node: HierarchyPointNode<NodeDatumNode>;
  ratings: Ratings;
  onSelectSkill: (id: string) => void;
  pressedMoved: React.MutableRefObject<boolean>;
}) {
  const d = node.data;
  const x = node.y; // depth -> horizontal
  const y = node.x; // breadth -> vertical

  if (d.type === 'root') return null;

  if (d.type === 'pillar') {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-12} y={-15} rx={9} width={170} height={30} fill={d.pillar.bg} stroke="#10B981" strokeWidth={1.2} />
        <text x={4} y={5} fontSize={13} fontWeight={800} fill="#0F172A">
          {d.pillar.emoji} {d.name}
        </text>
      </g>
    );
  }

  if (d.type === 'group') {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={4} fontSize={11} fontWeight={700} fill="#0B9A6D" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {d.name}
        </text>
      </g>
    );
  }

  // skill node
  const score = getRating(ratings, d.skill.id).score;
  const fill = score > 0 ? levelColors[score] : '#CBD5E1';
  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        if (!pressedMoved.current) onSelectSkill(d.skill.id);
      }}
    >
      <circle cx={0} cy={0} r={7} fill={fill} stroke="#fff" strokeWidth={1.5} />
      <text x={13} y={4} fontSize={11.5} fontWeight={600} fill="#1E293B">
        {d.name}
      </text>
    </g>
  );
}
