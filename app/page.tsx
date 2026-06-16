'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { allSkillIds, pillars } from '@/lib/data';
import { useLocalStorageState } from '@/lib/storage';
import { Ratings } from '@/lib/stats';
import { QuizHistory, ScoreEntry } from '@/lib/quiz';
import Header from '@/components/Header';
import PillarView from '@/components/PillarView';
import QuizOverlay from '@/components/QuizOverlay';
import Dashboard from '@/components/Dashboard';
import SkillTree from '@/components/tree/SkillTree';
import SkillDetail from '@/components/SkillDetail';

export default function Page() {
  const [ratings, setRatings] = useLocalStorageState<Ratings>('pickleball-gm-ratings', {});
  const [quizHistory, setQuizHistory] = useLocalStorageState<QuizHistory>(
    'pickleball-gm-quiz-history',
    {}
  );
  const [quizScoreHistory, setQuizScoreHistory] = useLocalStorageState<ScoreEntry[]>(
    'pickleball-gm-quiz-scores',
    []
  );

  const [activePillar, setActivePillar] = useState('score');
  const [view, setView] = useState<'list' | 'tree'>('list');
  const [detailSkill, setDetailSkill] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [quizOpen, setQuizOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll while an overlay is open.
  useEffect(() => {
    const lock = quizOpen || dashOpen || detailSkill != null;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [quizOpen, dashOpen, detailSkill]);

  const setRating = useCallback(
    (id: string, score: number, notes: string) => {
      setRatings((prev) => ({
        ...prev,
        [id]: { score, notes, updated: new Date().toISOString() },
      }));
    },
    [setRatings]
  );

  const rateSkill = useCallback(
    (id: string, value: number) => {
      setRatings((prev) => {
        const cur = prev[id] || { score: 0, notes: '' };
        const score = cur.score === value ? 0 : value;
        return { ...prev, [id]: { score, notes: cur.notes || '', updated: new Date().toISOString() } };
      });
    },
    [setRatings]
  );

  const clearSkill = useCallback(
    (id: string) => {
      setRatings((prev) => {
        const cur = prev[id] || { score: 0, notes: '' };
        return {
          ...prev,
          [id]: { score: 0, notes: cur.notes || '', updated: new Date().toISOString() },
        };
      });
    },
    [setRatings]
  );

  const setNotes = useCallback(
    (id: string, text: string) => {
      setRatings((prev) => {
        const cur = prev[id] || { score: 0, notes: '' };
        return {
          ...prev,
          [id]: { score: cur.score || 0, notes: text, updated: new Date().toISOString() },
        };
      });
    },
    [setRatings]
  );

  const toggleSkill = useCallback((id: string) => {
    setExpandedSkill((cur) => (cur === id ? null : id));
  }, []);

  const toggleGroup = useCallback((key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const pushScore = useCallback(
    (entry: ScoreEntry) => {
      setQuizScoreHistory((prev) => {
        const next = [...prev, entry];
        return next.length > 50 ? next.slice(-50) : next;
      });
    },
    [setQuizScoreHistory]
  );

  const exportData = useCallback(() => {
    const blob = new Blob(
      [
        JSON.stringify(
          { ratings, quizHistory, quizScoreHistory, exportDate: new Date().toISOString() },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pickleball-data.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, [ratings, quizHistory, quizScoreHistory]);

  const importData = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result));
          if (!data || typeof data !== 'object') throw new Error('bad');
          if (!data.ratings && !data.quizHistory && !data.quizScoreHistory) throw new Error('bad');
          if (data.ratings && typeof data.ratings === 'object') setRatings(data.ratings);
          if (data.quizHistory && typeof data.quizHistory === 'object')
            setQuizHistory(data.quizHistory);
          if (Array.isArray(data.quizScoreHistory)) setQuizScoreHistory(data.quizScoreHistory);
          setExpandedSkill(null);
          alert('Progress imported successfully.');
        } catch {
          alert('Could not import: the file is not valid Pickleball Strategy data.');
        }
      };
      reader.readAsText(file);
    },
    [setRatings, setQuizHistory, setQuizScoreHistory]
  );

  const resetAll = useCallback(() => {
    if (
      !confirm(
        'Reset ALL progress? This permanently clears every rating, note, and quiz result. This cannot be undone.'
      )
    )
      return;
    setRatings({});
    setQuizHistory({});
    setQuizScoreHistory([]);
    setExpandedSkill(null);
  }, [setRatings, setQuizHistory, setQuizScoreHistory]);

  const triggerImport = useCallback(() => importInputRef.current?.click(), []);

  const onImportFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) importData(f);
      e.target.value = '';
    },
    [importData]
  );

  const overallPct = useMemo(() => {
    let total = 0;
    let rated = 0;
    allSkillIds.forEach((id) => {
      total++;
      if ((ratings[id]?.score || 0) > 0) rated++;
    });
    return total ? Math.round((rated / total) * 100) : 0;
  }, [ratings]);

  const pillar = pillars.find((p) => p.id === activePillar) ?? pillars[0];

  return (
    <>
      <Header
        ratings={ratings}
        overallPct={overallPct}
        activePillar={activePillar}
        view={view}
        onSetView={setView}
        onSelectPillar={setActivePillar}
        onDash={() => setDashOpen(true)}
        onImport={triggerImport}
        onExport={exportData}
      />

      {view === 'tree' ? (
        <SkillTree ratings={ratings} onSelectSkill={setDetailSkill} />
      ) : (
        <div className="content">
          <PillarView
            pillar={pillar}
            ratings={ratings}
            expandedSkill={expandedSkill}
            collapsedGroups={collapsedGroups}
            onToggleSkill={toggleSkill}
            onToggleGroup={toggleGroup}
            onRate={rateSkill}
            onClear={clearSkill}
            onNotes={setNotes}
            onOpenDetail={setDetailSkill}
          />
        </div>
      )}

      <div className="bottom-bar">
        <button className="quiz-fab" onClick={() => setQuizOpen(true)}>
          🧠 Quiz Me
        </button>
      </div>

      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={onImportFile}
      />

      <QuizOverlay
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        quizHistory={quizHistory}
        setQuizHistory={setQuizHistory}
        ratings={ratings}
        setRating={setRating}
        pushScore={pushScore}
      />

      <Dashboard
        open={dashOpen}
        onClose={() => setDashOpen(false)}
        ratings={ratings}
        quizScoreHistory={quizScoreHistory}
        onExport={exportData}
        onImport={triggerImport}
        onReset={resetAll}
      />

      <SkillDetail
        skillId={detailSkill}
        ratings={ratings}
        onClose={() => setDetailSkill(null)}
        onRate={rateSkill}
        onClear={clearSkill}
        onNotes={setNotes}
      />
    </>
  );
}
