'use client';

import { levelColors, levels, Rating, Skill } from '@/lib/data';

interface Props {
  skill: Skill;
  rating: Rating;
  expanded: boolean;
  onToggle: () => void;
  onRate: (value: number) => void;
  onClear: () => void;
  onNotes: (text: string) => void;
  onOpenDetail: () => void;
}

export default function SkillCard({
  skill,
  rating,
  expanded,
  onToggle,
  onRate,
  onClear,
  onNotes,
  onOpenDetail,
}: Props) {
  return (
    <div className={`skill-card ${expanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="skill-card-top">
        <div>
          <div className="sc-label">{skill.label}</div>
          <div className="sc-sub">{skill.sub}</div>
          {skill.chess && <div className="sc-chess">♟️ Chess concept</div>}
        </div>
        <div className="sc-dots">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`sc-dot ${i <= rating.score ? 'filled' : ''}`}
              style={{
                borderColor: i <= rating.score ? levelColors[i] : 'var(--line)',
                background: i <= rating.score ? levelColors[i] : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {expanded && (
        <div className="sc-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="sc-rate-row">
            <span className="sc-rate-label">Skill level</span>
            <div className="sc-rate-btns">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  className={`sc-rate-btn ${rating.score === i ? 'active' : ''}`}
                  style={
                    rating.score === i
                      ? { background: levelColors[i], borderColor: levelColors[i] }
                      : undefined
                  }
                  onClick={() => onRate(i)}
                >
                  {i}
                </button>
              ))}
            </div>
            {rating.score > 0 && (
              <button className="sc-rate-clear" onClick={onClear}>
                ✕
              </button>
            )}
          </div>
          <div className="level-labels">
            <span>Beginner</span>
            <span
              className="current"
              style={{ color: rating.score > 0 ? levelColors[rating.score] : 'var(--muted)' }}
            >
              {rating.score > 0 ? levels[rating.score] : 'Not rated'}
            </span>
            <span>Elite</span>
          </div>
          <div className="sc-notes">
            <textarea
              placeholder="Notes, drills, things to practice..."
              value={rating.notes || ''}
              onChange={(e) => onNotes(e.target.value)}
            />
          </div>
          <button className="sc-learn-btn" onClick={onOpenDetail}>
            📖 Learn &amp; 3D drill →
          </button>
        </div>
      )}
    </div>
  );
}
