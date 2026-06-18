'use client';

import { pillars } from '@/lib/data';
import { getPillarStats, Ratings } from '@/lib/stats';

type View = 'list' | 'tree';

interface Props {
  ratings: Ratings;
  overallPct: number;
  activePillar: string;
  view: View;
  onSetView: (v: View) => void;
  onSelectPillar: (id: string) => void;
  onDash: () => void;
  onImport: () => void;
  onExport: () => void;
}

export default function Header({
  ratings,
  overallPct,
  activePillar,
  view,
  onSetView,
  onSelectPillar,
  onDash,
  onImport,
  onExport,
}: Props) {
  return (
    <div className="header">
      <div className="header-top">
        <h1>
          🏓 Pickleball Strategy
          {process.env.NEXT_PUBLIC_APP_VERSION && (
            <a
              className="app-version"
              href="https://github.com/2manslkh/pickleball-mindmap/releases"
              target="_blank"
              rel="noopener noreferrer"
              title="Release notes"
            >
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </a>
          )}
        </h1>
        <div className="header-actions">
          <div className="view-toggle" role="tablist" aria-label="View">
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => onSetView('list')}
              title="List view"
            >
              ☰
            </button>
            <button
              className={view === 'tree' ? 'active' : ''}
              onClick={() => onSetView('tree')}
              title="Skill tree view"
            >
              🌳
            </button>
          </div>
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
      <div className="pillar-tabs" style={view === 'tree' ? { opacity: 0.45, pointerEvents: 'none' } : undefined}>
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
