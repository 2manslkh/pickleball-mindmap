'use client';

import { pillars } from '@/lib/data';
import { getPillarStats, Ratings } from '@/lib/stats';

interface Props {
  ratings: Ratings;
  overallPct: number;
  activePillar: string;
  onSelectPillar: (id: string) => void;
  onDash: () => void;
  onImport: () => void;
  onExport: () => void;
}

export default function Header({
  ratings,
  overallPct,
  activePillar,
  onSelectPillar,
  onDash,
  onImport,
  onExport,
}: Props) {
  return (
    <div className="header">
      <div className="header-top">
        <h1>🏓 Pickleball Strategy</h1>
        <div className="header-actions">
          <button title="Dashboard" onClick={onDash}>
            📈
          </button>
          <button title="Import progress" onClick={onImport}>
            📂
          </button>
          <button title="Export progress" onClick={onExport}>
            💾
          </button>
        </div>
      </div>
      <div className="overall-bar">
        <div className="overall-bar-fill" style={{ width: `${overallPct}%` }} />
      </div>
      <div className="pillar-tabs">
        {pillars.map((p) => {
          const stats = getPillarStats(p, ratings);
          return (
            <div
              key={p.id}
              className={`pillar-tab ${p.id === activePillar ? 'active' : ''}`}
              onClick={() => onSelectPillar(p.id)}
            >
              {p.emoji} {p.label}
              <span className="tab-score">{stats.avg > 0 ? stats.avg.toFixed(1) : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
