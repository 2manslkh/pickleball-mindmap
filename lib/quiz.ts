import { Question } from './data';

export interface QuizHistoryEntry {
  lastCorrect: boolean;
  lastTime: number;
  attempts: number;
}
export type QuizHistory = Record<string, QuizHistoryEntry>;

export interface ScoreEntry {
  date: string;
  correct: number;
  total: number;
  pct: number;
}

export type PickedQuestion = Question & { _oi: number };

export function shuffleArray<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Spaced-repetition-ish weighting: never-seen and recently-wrong questions
 * bubble to the front; recently-correct ones sink. A little jitter keeps it
 * from being fully deterministic.
 */
export function pickQuestions(
  questions: Question[],
  n: number,
  quizHistory: QuizHistory
): PickedQuestion[] {
  const now = Date.now();
  const scored = questions.map((q, i) => {
    const h = quizHistory[q.skill + '_' + i];
    let p = 0;
    if (!h) p = 0;
    else if (!h.lastCorrect) p = 1;
    else p = 2 + Math.max(0, 10 - (now - h.lastTime) / 3600000);
    return { q, i, p: p + Math.random() * 1.5 };
  });
  scored.sort((a, b) => a.p - b.p);
  return scored.slice(0, n).map((s) => ({ ...s.q, _oi: s.i }));
}
