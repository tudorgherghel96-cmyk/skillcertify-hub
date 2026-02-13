import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { MODULES } from "@/data/courseData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const LOCAL_KEY = "sc_progress";

const loadLocal = (): ProgressState => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { modules: {}, cscs: { passed: null, score: null } };
};

const saveLocal = (state: ProgressState) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
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

export const isPracticeUnlocked = (mp: ModuleProgress, totalLessons: number, superUser = false) =>
  superUser || areAllLessonsComplete(mp, totalLessons);

export const isGqaUnlocked = (mp: ModuleProgress, superUser = false) =>
  superUser || mp.practice.bestScore >= 80;

export const isModuleComplete = (mp: ModuleProgress) => mp.gqa.passed === true;

export const isModuleUnlocked = (state: ProgressState, moduleId: number, superUser = false): boolean => {
  if (superUser) return true;
  if (moduleId === 1) return true;
  const prev = getModuleProgress(state, moduleId - 1);
  return isModuleComplete(prev);
};

export const canResitGqa = (mp: ModuleProgress, superUser = false): boolean => {
  if (superUser) return true;
  if (!mp.gqa.failedAt) return true;
  const failDate = new Date(mp.gqa.failedAt);
  return Date.now() - failDate.getTime() >= 24 * 60 * 60 * 1000;
};

export const hoursUntilResit = (mp: ModuleProgress): number => {
  if (!mp.gqa.failedAt) return 0;
  const diff = 24 * 60 * 60 * 1000 - (Date.now() - new Date(mp.gqa.failedAt).getTime());
  return Math.max(0, Math.ceil(diff / (60 * 60 * 1000)));
};

export const allGqaPassed = (state: ProgressState, superUser = false): boolean =>
  superUser || MODULES.every((m) => getModuleProgress(state, m.id).gqa.passed === true);

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

    for (const lesson of mod.lessons) {
      if (!mp.lessons[lesson.id]?.completed) {
        return {
          moduleId: mod.id,
          lessonId: lesson.id,
          label: `Continue Topic ${mod.id} · Lesson ${lesson.id}`,
        };
      }
    }

    if (!isGqaUnlocked(mp)) {
      return { moduleId: mod.id, lessonId: null, label: `Practice — Topic ${mod.id}` };
    }
    return { moduleId: mod.id, lessonId: null, label: `Take Topic ${mod.id} Test` };
  }
  if (allGqaPassed(state)) {
    return { moduleId: 0, lessonId: null, label: "Prepare for CSCS Test" };
  }
  return null;
};

/* ─── Supabase sync helpers ─── */

async function loadFromSupabase(userId: string): Promise<ProgressState> {
  const state: ProgressState = { modules: {}, cscs: { passed: null, score: null } };

  // Load lesson progress
  const { data: lessons } = await supabase
    .from("progress")
    .select("module_id, lesson_id, completed")
    .eq("user_id", userId);

  if (lessons) {
    for (const row of lessons) {
      if (!state.modules[row.module_id]) {
        state.modules[row.module_id] = defaultModuleProgress(row.module_id);
      }
      const lessonId = parseInt(row.lesson_id.split(".")[1] || row.lesson_id, 10);
      if (row.completed) {
        state.modules[row.module_id].lessons[lessonId] = { completed: true };
      }
    }
  }

  // Load practice attempts (best score + count per module)
  const { data: practice } = await supabase
    .from("practice_attempts")
    .select("module_id, percentage")
    .eq("user_id", userId);

  if (practice) {
    const byModule: Record<number, { best: number; count: number }> = {};
    for (const row of practice) {
      if (!byModule[row.module_id]) byModule[row.module_id] = { best: 0, count: 0 };
      byModule[row.module_id].count++;
      byModule[row.module_id].best = Math.max(byModule[row.module_id].best, row.percentage ?? 0);
    }
    for (const [mid, data] of Object.entries(byModule)) {
      const moduleId = Number(mid);
      if (!state.modules[moduleId]) state.modules[moduleId] = defaultModuleProgress(moduleId);
      state.modules[moduleId].practice = { bestScore: data.best, attempts: data.count };
    }
  }

  // Load GQA results (latest per module)
  const { data: gqa } = await supabase
    .from("gqa_results")
    .select("module_id, passed, score, attempted_at")
    .eq("user_id", userId)
    .order("attempted_at", { ascending: false });

  if (gqa) {
    const seen = new Set<number>();
    for (const row of gqa) {
      if (seen.has(row.module_id)) continue;
      seen.add(row.module_id);
      if (!state.modules[row.module_id]) state.modules[row.module_id] = defaultModuleProgress(row.module_id);
      state.modules[row.module_id].gqa = {
        passed: row.passed,
        score: row.score ? Number(row.score) : null,
        failedAt: row.passed ? null : row.attempted_at,
      };
    }
  }

  // Load CSCS results
  const { data: cscs } = await supabase
    .from("cscs_results")
    .select("passed, score")
    .eq("user_id", userId)
    .order("attempted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cscs) {
    state.cscs = { passed: cscs.passed, score: cscs.score ? Number(cscs.score) : null };
  }

  return state;
}

async function migrateLocalToSupabase(userId: string, localState: ProgressState) {
  // Migrate lesson progress
  for (const [mid, mp] of Object.entries(localState.modules)) {
    const moduleId = Number(mid);
    for (const [lid, lp] of Object.entries(mp.lessons)) {
      if (lp.completed) {
        const lessonId = `${moduleId}.${lid}`;
        await supabase.from("progress").upsert(
          { user_id: userId, module_id: moduleId, lesson_id: lessonId, completed: true },
          { onConflict: "user_id,module_id,lesson_id" }
        ).select();
      }
    }

    // Migrate practice (insert a single summary attempt if any)
    if (mp.practice.attempts > 0) {
      await supabase.from("practice_attempts").insert({
        user_id: userId,
        module_id: moduleId,
        mode: "quiz",
        score: Math.round(mp.practice.bestScore * 0.15),
        total: 15,
        percentage: mp.practice.bestScore,
      }).select();
    }

    // Migrate GQA
    if (mp.gqa.passed !== null) {
      await supabase.from("gqa_results").insert({
        user_id: userId,
        module_id: moduleId,
        passed: mp.gqa.passed,
        score: mp.gqa.score,
      }).select();
    }
  }

  // Migrate CSCS
  if (localState.cscs.passed !== null) {
    await supabase.from("cscs_results").insert({
      user_id: userId,
      passed: localState.cscs.passed,
      score: localState.cscs.score,
    }).select();
  }

  // Clear local storage after migration
  localStorage.removeItem(LOCAL_KEY);
}

/* ─── context ─── */

interface ProgressContextValue {
  progress: ProgressState;
  loading: boolean;
  completeLesson: (moduleId: number, lessonId: number) => void;
  recordPractice: (moduleId: number, score: number) => void;
  recordGqa: (moduleId: number, passed: boolean, score: number) => void;
  recordCscs: (passed: boolean, score: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(loadLocal);
  const [loading, setLoading] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      // Not logged in: use localStorage
      setProgress(loadLocal());
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      // Check if there's local progress to migrate
      const localState = loadLocal();
      const hasLocalData = Object.keys(localState.modules).length > 0 || localState.cscs.passed !== null;

      if (hasLocalData) {
        await migrateLocalToSupabase(user.id, localState);
      }

      // Load fresh from Supabase
      const cloudState = await loadFromSupabase(user.id);
      if (!cancelled) {
        setProgress(cloudState);
        saveLocal(cloudState); // Cache locally for offline
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  const ensureModule = (state: ProgressState, moduleId: number): ProgressState => {
    if (state.modules[moduleId]) return state;
    return {
      ...state,
      modules: { ...state.modules, [moduleId]: defaultModuleProgress(moduleId) },
    };
  };

  // Debounced save to localStorage (always) for offline cache
  const debouncedSaveLocal = useCallback((state: ProgressState) => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => saveLocal(state), 500);
  }, []);

  const update = useCallback((fn: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = fn(prev);
      debouncedSaveLocal(next);
      return next;
    });
  }, [debouncedSaveLocal]);

  const completeLesson = useCallback(
    (moduleId: number, lessonId: number) => {
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
      });

      // Sync to Supabase
      if (user) {
        supabase.from("progress").upsert(
          {
            user_id: user.id,
            module_id: moduleId,
            lesson_id: `${moduleId}.${lessonId}`,
            completed: true,
          },
          { onConflict: "user_id,module_id,lesson_id" }
        ).select().then(({ error }) => {
          if (error) console.error("Failed to sync lesson progress:", error);
        });
      }
    },
    [update, user]
  );

  const recordPractice = useCallback(
    (moduleId: number, score: number) => {
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
      });

      // Sync to Supabase
      if (user) {
        supabase.from("practice_attempts").insert({
          user_id: user.id,
          module_id: moduleId,
          mode: "quiz",
          score: Math.round(score * 0.15),
          total: 15,
          percentage: score,
        }).select().then(({ error }) => {
          if (error) console.error("Failed to sync practice:", error);
        });
      }
    },
    [update, user]
  );

  const recordGqa = useCallback(
    (moduleId: number, passed: boolean, score: number) => {
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
      });

      // Sync to Supabase
      if (user) {
        supabase.from("gqa_results").insert({
          user_id: user.id,
          module_id: moduleId,
          passed,
          score,
        }).select().then(({ error }) => {
          if (error) console.error("Failed to sync GQA:", error);
        });

        // Also record in assessment_attempts for 24h lockout tracking
        supabase.from("assessment_attempts").insert({
          user_id: user.id,
          topic_id: moduleId,
          passed,
          score,
          can_retry_at: passed ? new Date().toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }).select().then(({ error }) => {
          if (error) console.error("Failed to sync assessment attempt:", error);
        });
      }
    },
    [update, user]
  );

  const recordCscs = useCallback(
    (passed: boolean, score: number) => {
      update((prev) => ({
        ...prev,
        cscs: { passed, score },
      }));

      // Sync to Supabase
      if (user) {
        supabase.from("cscs_results").insert({
          user_id: user.id,
          passed,
          score,
        }).select().then(({ error }) => {
          if (error) console.error("Failed to sync CSCS:", error);
        });
      }
    },
    [update, user]
  );

  return (
    <ProgressContext.Provider value={{ progress, loading, completeLesson, recordPractice, recordGqa, recordCscs }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
};
