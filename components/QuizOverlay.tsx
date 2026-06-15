'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { questions, skillMap, QuizOption } from '@/lib/data';
import {
  PickedQuestion,
  QuizHistory,
  ScoreEntry,
  pickQuestions,
  shuffleArray,
} from '@/lib/quiz';
import { Ratings } from '@/lib/stats';

interface Props {
  open: boolean;
  onClose: () => void;
  quizHistory: QuizHistory;
  setQuizHistory: Dispatch<SetStateAction<QuizHistory>>;
  ratings: Ratings;
  setRating: (id: string, score: number, notes: string) => void;
  pushScore: (entry: ScoreEntry) => void;
}

interface SkillScore {
  c: number;
  t: number;
  md: number;
}
interface Answer {
  correct: boolean;
  skill: string;
  diff: number;
}
interface Result {
  c: number;
  t: number;
  pct: number;
  grade: string;
  gc: string;
  updates: { label: string; old: number; ns: number }[];
}

const KEYS = ['A', 'B', 'C', 'D'];
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function QuizOverlay({
  open,
  onClose,
  quizHistory,
  setQuizHistory,
  ratings,
  setRating,
  pushScore,
}: Props) {
  const [qs, setQs] = useState<PickedQuestion[]>([]);
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState<Answer[]>([]);
  const [scores, setScores] = useState<Record<string, SkillScore>>({});
  const [opts, setOpts] = useState<(QuizOption & { oi: number })[]>([]);
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  // Snapshots read at start/finish so mid-quiz state updates don't restart it.
  const quizHistoryRef = useRef(quizHistory);
  quizHistoryRef.current = quizHistory;
  const ratingsRef = useRef(ratings);
  ratingsRef.current = ratings;

  const start = useCallback(() => {
    const picked = shuffleArray(
      pickQuestions(questions, Math.min(12, questions.length), quizHistoryRef.current)
    );
    setQs(picked);
    setCur(0);
    setAns([]);
    setScores({});
    setResult(null);
    setAnsweredIndex(null);
  }, []);

  useEffect(() => {
    if (open) start();
  }, [open, start]);

  // (Re)shuffle options whenever the current question changes.
  useEffect(() => {
    if (result || !qs.length) return;
    const q = qs[cur];
    if (!q) return;
    const shuffled = shuffleArray(q.options.map((o, i) => ({ ...o, oi: i })));
    setOpts(shuffled);
    setCorrectIndex(shuffled.findIndex((o) => o.correct));
    setAnsweredIndex(null);
  }, [qs, cur, result]);

  const answerQ = useCallback(
    (idx: number) => {
      if (answeredIndex !== null || result) return;
      const q = qs[cur];
      if (!q) return;
      const ok = idx === correctIndex;
      setAnsweredIndex(idx);
      setAns((prev) => [...prev, { correct: ok, skill: q.skill, diff: q.diff }]);
      setScores((prev) => {
        const s = { ...(prev[q.skill] || { c: 0, t: 0, md: 0 }) };
        s.t++;
        if (ok) {
          s.c++;
          s.md = Math.max(s.md, q.diff);
        }
        return { ...prev, [q.skill]: s };
      });
      const hk = q.skill + '_' + (q._oi || 0);
      setQuizHistory((prev) => ({
        ...prev,
        [hk]: { lastCorrect: ok, lastTime: Date.now(), attempts: (prev[hk]?.attempts || 0) + 1 },
      }));
    },
    [answeredIndex, result, qs, cur, correctIndex, setQuizHistory]
  );

  const finishQuiz = useCallback(() => {
    const t = ans.length;
    const c = ans.filter((a) => a.correct).length;
    const pct = t ? Math.round((c / t) * 100) : 0;
    pushScore({ date: new Date().toISOString(), correct: c, total: t, pct });

    let grade = 'Beginner';
    let gc = '#DC2626';
    if (pct >= 90) {
      grade = 'Elite';
      gc = '#10B981';
    } else if (pct >= 70) {
      grade = 'Advanced';
      gc = '#0B9A6D';
    } else if (pct >= 50) {
      grade = 'Competent';
      gc = '#C4A33A';
    } else if (pct >= 30) {
      grade = 'Developing';
      gc = '#F59E0B';
    }

    // A quiz can only RAISE a rating, never lower a self-assessment.
    const updates: { label: string; old: number; ns: number }[] = [];
    const snap = ratingsRef.current;
    for (const [sid, d] of Object.entries(scores)) {
      const nd = skillMap[sid];
      if (!nd) continue;
      const old = snap[sid]?.score || 0;
      let earned: number;
      if (d.c === d.t) earned = Math.ceil(d.md * 1.2);
      else if (d.c > 0) earned = Math.round(d.md * 0.8);
      else earned = 0;
      const ns = Math.min(5, Math.max(old, earned));
      if (ns === old) continue;
      setRating(sid, ns, snap[sid]?.notes || '');
      updates.push({ label: nd.label, old, ns });
    }

    setResult({ c, t, pct, grade, gc, updates });
  }, [ans, scores, pushScore, setRating]);

  const nextQ = useCallback(() => {
    if (cur < qs.length - 1) setCur((c) => c + 1);
    else finishQuiz();
  }, [cur, qs.length, finishQuiz]);

  // Keyboard: A–D to answer, Enter/Space to advance, Escape to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (result) return;
      const km: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
      const k = e.key.toLowerCase();
      if (k in km && answeredIndex === null) {
        e.preventDefault();
        answerQ(km[k]);
      }
      if ((e.key === 'Enter' || e.key === ' ') && answeredIndex !== null) {
        e.preventDefault();
        nextQ();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, result, answeredIndex, answerQ, nextQ, onClose]);

  if (!open) return null;

  const q = qs[cur];

  return (
    <div className="overlay">
      <button className="overlay-close" onClick={onClose}>
        ✕
      </button>
      <div className="overlay-card">
        {result ? (
          <div className="results-center">
            <div
              className="score-ring"
              style={{ borderColor: result.gc, background: result.gc + '15' }}
            >
              <div className="sr-num" style={{ color: result.gc }}>
                {result.c}/{result.t}
              </div>
              <div className="sr-pct" style={{ color: result.gc }}>
                {result.pct}%
              </div>
            </div>
            <h2 style={{ color: result.gc, fontSize: 18, marginBottom: 6 }}>{result.grade}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
              {result.c} of {result.t} correct
            </p>
            {result.updates.length > 0 ? (
              <div style={{ textAlign: 'left', margin: '16px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                  Skill ratings raised:
                </div>
                {result.updates.map((u, i) => (
                  <div className="skill-update-row" key={i}>
                    <span>{u.label}</span>
                    <span className="su-up">
                      {u.old > 0 ? stars(u.old) : '(new)'} → {stars(u.ns)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '14px 0' }}>
                Your self-ratings are unchanged — quizzes only ever raise a rating, never lower it.
              </p>
            )}
            <button className="quiz-btn" onClick={start}>
              🧠 Try Again
            </button>
            <button className="quiz-btn secondary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : q ? (
          <>
            <div className="quiz-progress">
              {qs.map((_, i) => {
                let cls = 'dot';
                if (i < ans.length) cls += ans[i].correct ? ' done' : ' wrong';
                else if (i === cur) cls += ' current';
                return <div key={i} className={cls} />;
              })}
            </div>
            <div className="quiz-cat">
              {q.cat} · {cur + 1}/{qs.length}
            </div>
            {q.scenario && <div className="quiz-scenario">{q.scenario}</div>}
            <div className="quiz-q">{q.question}</div>
            <div className="quiz-opts">
              {opts.map((o, i) => {
                let cls = 'quiz-opt';
                if (answeredIndex !== null) {
                  if (i === correctIndex) cls += ' correct';
                  else if (i === answeredIndex) cls += ' wrong';
                  if (i !== answeredIndex && i !== correctIndex) cls += ' disabled';
                }
                return (
                  <button key={i} className={cls} onClick={() => answerQ(i)}>
                    <span className="opt-key">{KEYS[i]}</span>
                    <span>{o.text}</span>
                  </button>
                );
              })}
            </div>
            {answeredIndex !== null && (
              <>
                <div className="quiz-explain">
                  <strong>{answeredIndex === correctIndex ? '✅ Correct!' : '❌ Not quite.'}</strong>{' '}
                  {q.explanation}
                </div>
                <button className="quiz-btn" onClick={nextQ}>
                  {cur < qs.length - 1 ? 'Next Question →' : 'See Results →'}
                </button>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
