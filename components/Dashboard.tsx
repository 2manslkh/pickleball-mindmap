'use client';

import { useEffect } from 'react';
import { allSkillIds, pillars, skillMap } from '@/lib/data';
import { ScoreEntry } from '@/lib/quiz';
import { getPillarStats, getRating, Ratings } from '@/lib/stats';

interface Props {
  open: boolean;
  onClose: () => void;
  ratings: Ratings;
  quizScoreHistory: ScoreEntry[];
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

const SZ = 220;
const CX = SZ / 2;
const CY = SZ / 2;
const MR = 75;

export default function Dashboard({
  open,
  onClose,
  ratings,
  quizScoreHistory,
  onExport,
  onImport,
  onReset,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const ps = pillars.map((p) => ({ ...p, ...getPillarStats(p, ratings) }));

  const angle = (i: number) => (i / pillars.length) * Math.PI * 2 - Math.PI / 2;

  // Weakest RATED skills first (most actionable); unrated skills fall to the end.
  const weak = allSkillIds
    .map((id) => ({ id, label: skillMap[id].label, score: getRating(ratings, id).score }))
    .sort((a, b) => {
      const ak = a.score === 0 ? Infinity : a.score;
      const bk = b.score === 0 ? Infinity : b.score;
      return ak - bk;
    })
    .slice(0, 6);

  const recent = quizScoreHistory.slice(-20);

  return (
    <div className="overlay">
      <button className="overlay-close" onClick={onClose}>
        ✕
      </button>
      <div id="dashContent" style={{ width: '100%', maxWidth: 560 }}>
        <div className="dash-section">
          <h3>📊 Skill Radar</h3>
          <div className="radar-wrap">
            <svg
              width={SZ}
              height={SZ}
              viewBox={`0 0 ${SZ} ${SZ}`}
              style={{ overflow: 'visible' }}
            >
              {[1, 2, 3, 4, 5].map((l) => {
                const r = (MR * l) / 5;
                const pts = pillars
                  .map((_, i) => `${CX + r * Math.cos(angle(i))},${CY + r * Math.sin(angle(i))}`)
                  .join(' ');
                return <polygon key={l} points={pts} fill="none" stroke="#E2E8F0" />;
              })}
              {pillars.map((p, i) => {
                const a = angle(i);
                const lx = CX + (MR + 24) * Math.cos(a);
                const ly = CY + (MR + 24) * Math.sin(a);
                const anchor =
                  Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
                return (
                  <g key={p.id}>
                    <line
                      x1={CX}
                      y1={CY}
                      x2={CX + MR * Math.cos(a)}
                      y2={CY + MR * Math.sin(a)}
                      stroke="#E2E8F0"
                      strokeWidth={0.5}
                    />
                    <text
                      x={lx}
                      y={ly + 4}
                      textAnchor={anchor}
                      fill="#334155"
                      fontSize={9}
                      fontWeight={700}
                      style={{ fontFamily: 'var(--font)' }}
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
              <polygon
                points={ps
                  .map((p, i) => {
                    const r = MR * (p.avg / 5);
                    return `${CX + r * Math.cos(angle(i))},${CY + r * Math.sin(angle(i))}`;
                  })
                  .join(' ')}
                fill="rgba(16,185,129,0.18)"
                stroke="#10B981"
                strokeWidth={2}
              />
              {ps.map((p, i) => {
                const r = MR * (p.avg / 5);
                return (
                  <circle
                    key={p.id}
                    cx={CX + r * Math.cos(angle(i))}
                    cy={CY + r * Math.sin(angle(i))}
                    r={4}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                );
              })}
            </svg>
          </div>
          {ps.map((p) => {
            const pct = p.avg > 0 ? Math.round((p.avg / 5) * 100) : 0;
            return (
              <div className="pillar-row" key={p.id}>
                <div className="pr-label">{p.label}</div>
                <div className="pr-bar">
                  <div
                    className="pr-fill"
                    style={{ width: `${Math.max(5, pct)}%`, background: p.color }}
                  >
                    {p.avg.toFixed(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dash-section">
          <h3>🔴 Areas to Improve</h3>
          {weak.map((w) => {
            const c = w.score === 0 ? '#64748B' : w.score <= 2 ? '#DC2626' : '#C4A33A';
            return (
              <div className="weak-card" style={{ borderColor: c }} key={w.id}>
                <div className="wc-name">{w.label}</div>
                <div className="wc-stars" style={{ color: c }}>
                  {w.score > 0 ? '★'.repeat(w.score) + '☆'.repeat(5 - w.score) : '—'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="dash-section">
          <h3>📈 Quiz History</h3>
          {recent.length ? (
            <div className="hist-bars">
              {recent.map((s, i) => {
                const h = Math.max(4, (s.pct / 100) * 55);
                const c = s.pct >= 80 ? '#10B981' : s.pct >= 60 ? '#C4A33A' : '#DC2626';
                return (
                  <div
                    key={i}
                    className="hist-bar"
                    style={{ height: h, background: c }}
                    title={`${s.pct}%`}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 12, color: 'var(--muted)', fontSize: 11 }}>
              Take a quiz to see history
            </div>
          )}
        </div>

        <div className="dash-section">
          <h3>⚙️ Your Data</h3>
          <button className="dash-btn" onClick={onExport}>
            💾 Export progress (JSON)
          </button>
          <button className="dash-btn" onClick={onImport}>
            📂 Import progress
          </button>
          <button className="dash-btn danger" onClick={onReset}>
            🗑️ Reset all progress
          </button>
        </div>
      </div>
    </div>
  );
}
