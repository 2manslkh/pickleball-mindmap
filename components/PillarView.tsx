'use client';

import { Pillar } from '@/lib/data';
import { getPillarStats, getRating, Ratings } from '@/lib/stats';
import SkillCard from './SkillCard';

interface Props {
  pillar: Pillar;
  ratings: Ratings;
  expandedSkill: string | null;
  collapsedGroups: Set<string>;
  onToggleSkill: (id: string) => void;
  onToggleGroup: (key: string) => void;
  onRate: (id: string, value: number) => void;
  onClear: (id: string) => void;
  onNotes: (id: string, text: string) => void;
  onOpenDetail: (id: string) => void;
}

export default function PillarView({
  pillar,
  ratings,
  expandedSkill,
  collapsedGroups,
  onToggleSkill,
  onToggleGroup,
  onRate,
  onClear,
  onNotes,
  onOpenDetail,
}: Props) {
  const stats = getPillarStats(pillar, ratings);

  return (
    <>
      <div className="pillar-hero">
        <div className="hero-eyebrow">Pillar</div>
        <h2>
          {pillar.emoji} {pillar.label}
        </h2>
        <div className="chess-sub">♟️ {pillar.chess}</div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hs-val">{stats.avg > 0 ? stats.avg.toFixed(1) : '—'}</div>
            <div className="hs-label">Avg Level</div>
          </div>
          <div className="hero-stat">
            <div className="hs-val">
              {stats.rated}/{stats.total}
            </div>
            <div className="hs-label">Rated</div>
          </div>
        </div>
      </div>

      {pillar.groups.map((g) => {
        const gKey = pillar.id + '_' + g.label;
        const isCollapsed = collapsedGroups.has(gKey);
        const gRated = g.skills.filter((s) => getRating(ratings, s.id).score > 0).length;

        return (
          <div className="skill-group" key={gKey}>
            <div
              className={`skill-group-header ${isCollapsed ? 'collapsed' : ''}`}
              onClick={() => onToggleGroup(gKey)}
            >
              <h3>{g.label}</h3>
              <span className="sg-badge">
                {gRated}/{g.skills.length}
              </span>
              <span className="sg-chevron">▼</span>
            </div>

            {!isCollapsed &&
              g.skills.map((s) => (
                <SkillCard
                  key={s.id}
                  skill={s}
                  rating={getRating(ratings, s.id)}
                  expanded={expandedSkill === s.id}
                  onToggle={() => onToggleSkill(s.id)}
                  onRate={(value) => onRate(s.id, value)}
                  onClear={() => onClear(s.id)}
                  onNotes={(text) => onNotes(s.id, text)}
                  onOpenDetail={() => onOpenDetail(s.id)}
                />
              ))}
          </div>
        );
      })}

      <div className="gm-principle">
        <div className="gm-title">The GM Principle</div>
        <div className="gm-body">
          Every shot is a move. Every move has a purpose.
          <br />
          If you can&apos;t explain WHY you hit that shot, you shouldn&apos;t have hit it.
        </div>
      </div>
    </>
  );
}
