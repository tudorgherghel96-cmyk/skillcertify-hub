import React, { createContext, useContext, useState, useCallback } from "react";
import { MODULES } from "@/data/courseData";

/* ─── types ─── */

export interface LessonProgress {
  completed: boolean;
}

export interface PracticeProgress {
  bestScore: number; // 0-100
  attempts: number;
}

export interface GqaResult {
  passed: boolean | null; // null = not attempted
  score: number | null;
  failedAt: string | null; // ISO timestamp of last fail for 24h cooldown
}

export interface ModuleProgress {
  lessons: Record<number, LessonProgress>; // lessonId → progress
  practice: PracticeProgress;
  gqa: GqaResult;
}

export interface ProgressState {
  modules: Record<number, ModuleProgress>;
  cscs: { passed: boolean | null; score: number | null };
}

/* ─── defaults ─── */

const defaultModuleProgress = (moduleId: number): ModuleProgress => ({
  lessons: {},
  practice: { bestScore: 0, attempts: 0 },
  gqa: { passed: null, score: null, failedAt: null },
});

const loadProgress = (): ProgressState => {
  try {
    const raw = localStorage.getItem("sc_progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { modules: {}, cscs: { passed: null, score: null } };
};

const saveProgress = (state: ProgressState) => {
  localStorage.setItem("sc_progress", JSON.stringify(state));
};

/* ─── derived helpers ─── */

export const getModuleProgress = (
  state: ProgressState,
  moduleId: number
): ModuleProgress => state.modules[moduleId] ?? defaultModuleProgress(moduleId);

export const getLessonsCompleted = (mp: ModuleProgress, totalLessons: number) => {
  let count = 0;
  for (let i = 1; i <= totalLessons; i++) {
    if (mp.lessons[i]?.completed) count++;
  }
  return count;
};

export const areAllLessonsComplete = (mp: ModuleProgress, totalLessons: number) =>
  getLessonsCompleted(mp, totalLessons) === totalLessons;

export const isPracticeUnlocked = (mp: ModuleProgress, totalLessons: number) =>
  areAllLessonsComplete(mp, totalLessons);

export const isGqaUnlocked = (mp: ModuleProgress) => mp.practice.bestScore >= 80;

export const isModuleComplete = (mp: ModuleProgress) => mp.gqa.passed === true;

export const isModuleUnlocked = (state: ProgressState, moduleId: number): boolean => {
  if (moduleId === 1) return true;
  const prev = getModuleProgress(state, moduleId - 1);
  return isModuleComplete(prev);
};

export const canResitGqa = (mp: ModuleProgress): boolean => {
  if (!mp.gqa.failedAt) return true;
  const failDate = new Date(mp.gqa.failedAt);
  return Date.now() - failDate.getTime() >= 24 * 60 * 60 * 1000;
};

export const hoursUntilResit = (mp: ModuleProgress): number => {
  if (!mp.gqa.failedAt) return 0;
  const diff = 24 * 60 * 60 * 1000 - (Date.now() - new Date(mp.gqa.failedAt).getTime());
  return Math.max(0, Math.ceil(diff / (60 * 60 * 1000)));
};

export const allGqaPassed = (state: ProgressState): boolean =>
  MODULES.every((m) => getModuleProgress(state, m.id).gqa.passed === true);

export const getOverallProgress = (state: ProgressState): { modulesComplete: number; percentage: number } => {
  let done = 0;
  MODULES.forEach((m) => {
    if (isModuleComplete(getModuleProgress(state, m.id))) done++;
  });
  return { modulesComplete: done, percentage: Math.round((done / MODULES.length) * 100) };
};

export const getNextAction = (
  state: ProgressState
): { moduleId: number; lessonId: number | null; label: string } | null => {
  for (const mod of MODULES) {
    if (!isModuleUnlocked(state, mod.id)) continue;
    const mp = getModuleProgress(state, mod.id);
    if (isModuleComplete(mp)) continue;

    // find first incomplete lesson
    for (const lesson of mod.lessons) {
      if (!mp.lessons[lesson.id]?.completed) {
        return {
          moduleId: mod.id,
          lessonId: lesson.id,
          label: `Continue Module ${mod.id} — Lesson ${mod.id}.${lesson.id}`,
        };
      }
    }

    // all lessons done, practice or GQA next
    if (!isGqaUnlocked(mp)) {
      return { moduleId: mod.id, lessonId: null, label: `Practice Quiz — Module ${mod.id}` };
    }
    return { moduleId: mod.id, lessonId: null, label: `Take GQA Module ${mod.id} Test` };
  }
  if (allGqaPassed(state)) {
    return { moduleId: 0, lessonId: null, label: "Prepare for CSCS Test" };
  }
  return null;
};

/* ─── context ─── */

interface ProgressContextValue {
  progress: ProgressState;
  completeLesson: (moduleId: number, lessonId: number) => void;
  recordPractice: (moduleId: number, score: number) => void;
  recordGqa: (moduleId: number, passed: boolean, score: number) => void;
  recordCscs: (passed: boolean, score: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  const update = useCallback((fn: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const ensureModule = (state: ProgressState, moduleId: number): ProgressState => {
    if (state.modules[moduleId]) return state;
    return {
      ...state,
      modules: { ...state.modules, [moduleId]: defaultModuleProgress(moduleId) },
    };
  };

  const completeLesson = useCallback(
    (moduleId: number, lessonId: number) =>
      update((prev) => {
        const s = ensureModule(prev, moduleId);
        return {
          ...s,
          modules: {
            ...s.modules,
            [moduleId]: {
              ...s.modules[moduleId],
              lessons: { ...s.modules[moduleId].lessons, [lessonId]: { completed: true } },
            },
          },
        };
      }),
    [update]
  );

  const recordPractice = useCallback(
    (moduleId: number, score: number) =>
      update((prev) => {
        const s = ensureModule(prev, moduleId);
        const mp = s.modules[moduleId];
        return {
          ...s,
          modules: {
            ...s.modules,
            [moduleId]: {
              ...mp,
              practice: {
                bestScore: Math.max(mp.practice.bestScore, score),
                attempts: mp.practice.attempts + 1,
              },
            },
          },
        };
      }),
    [update]
  );

  const recordGqa = useCallback(
    (moduleId: number, passed: boolean, score: number) =>
      update((prev) => {
        const s = ensureModule(prev, moduleId);
        return {
          ...s,
          modules: {
            ...s.modules,
            [moduleId]: {
              ...s.modules[moduleId],
              gqa: { passed, score, failedAt: passed ? null : new Date().toISOString() },
            },
          },
        };
      }),
    [update]
  );

  const recordCscs = useCallback(
    (passed: boolean, score: number) =>
      update((prev) => ({
        ...prev,
        cscs: { passed, score },
      })),
    [update]
  );

  return (
    <ProgressContext.Provider value={{ progress, completeLesson, recordPractice, recordGqa, recordCscs }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
};
