'use client';

import dynamic from 'next/dynamic';
import { levelColors, levels, skillMap } from '@/lib/data';
import { skillContent } from '@/lib/skill-content';
import { getRating, Ratings } from '@/lib/stats';

// three.js only loads when a skill detail is opened.
const Court3D = dynamic(() => import('./court3d/Court3D'), {
  ssr: false,
  loading: () => <div className="court3d-loading">Loading 3D court…</div>,
});

interface Props {
  skillId: string | null;
  ratings: Ratings;
  onClose: () => void;
  onRate: (id: string, value: number) => void;
  onClear: (id: string) => void;
  onNotes: (id: string, text: string) => void;
}

const ytUrl = (q: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export default function SkillDetail({ skillId, ratings, onClose, onRate, onClear, onNotes }: Props) {
  const open = skillId != null;
  const entry = skillId ? skillMap[skillId] : null;
  const content = skillId ? skillContent[skillId] : null;
  const rating = skillId ? getRating(ratings, skillId) : { score: 0, notes: '' };

  return (
    <div className={`overlay ${open ? '' : 'hidden'}`}>
      <button className="overlay-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div className="overlay-card">
        {entry && content && skillId && (
          <>
            <div className="sd-eyebrow" style={{ color: entry.pillar.color }}>
              {entry.pillar.emoji} {entry.pillar.label}
            </div>
            <h2 className="sd-title">{entry.label}</h2>
            <p className="sd-sub">{entry.sub}</p>

            {/* 3D court animation */}
            <div className="sd-section">
              <Court3D anim={content.anim} />
              {content.anim.note && (
                <div className="sd-anim-note">
                  {content.anim.concept ? '💡 ' : '🎾 '}
                  {content.anim.note}
                </div>
              )}
            </div>

            {/* explanation */}
            <div className="sd-section">
              <h3 className="sd-h3">Why it matters</h3>
              <p className="sd-explain">{content.explanation}</p>
            </div>

            {/* video links */}
            <div className="sd-section">
              <h3 className="sd-h3">Watch tutorials</h3>
              <div className="sd-videos">
                {content.youtube.map((q) => (
                  <a key={q} className="sd-video-link" href={ytUrl(q)} target="_blank" rel="noopener noreferrer">
                    ▶ {q}
                  </a>
                ))}
              </div>
            </div>

            {/* rating */}
            <div className="sd-section">
              <h3 className="sd-h3">Your level</h3>
              <div className="sc-rate-row">
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
                      onClick={() => onRate(skillId, i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                {rating.score > 0 && (
                  <button className="sc-rate-clear" onClick={() => onClear(skillId)}>
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
                  onChange={(e) => onNotes(skillId, e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
