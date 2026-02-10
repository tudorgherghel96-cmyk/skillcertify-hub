import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  useProgress,
  getModuleProgress,
  isModuleComplete,
  allGqaPassed,
  getOverallProgress,
  areAllLessonsComplete,
} from "@/contexts/ProgressContext";
import { MODULES } from "@/data/courseData";

/* ─── types ─── */

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string; // emoji
  earned: boolean;
  earnedAt?: string;
}

export interface GamificationState {
  streak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  studyDates: string[]; // list of unique YYYY-MM-DD
  drillSessions: number;
  flashcardsMastered: Record<number, number>; // moduleId → count
  firstOpenDate: string | null;
  totalStudyMinutes: number;
}

const defaultState = (): GamificationState => ({
  streak: 0,
  lastStudyDate: null,
  studyDates: [],
  drillSessions: 0,
  flashcardsMastered: {},
  firstOpenDate: null,
  totalStudyMinutes: 0,
});

const STORAGE_KEY = "sc_gamification";

const load = (): GamificationState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch {}
  return defaultState();
};

const save = (s: GamificationState) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

/* ─── helpers ─── */

const todayStr = () => new Date().toISOString().slice(0, 10);

const daysBetween = (a: string, b: string) =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

/* ─── badge definitions ─── */

export function computeBadges(
  progress: ReturnType<typeof useProgress>["progress"],
  gam: GamificationState
): Badge[] {
  const overall = getOverallProgress(progress);
  const anyLessonDone = MODULES.some((m) => {
    const mp = getModuleProgress(progress, m.id);
    return Object.values(mp.lessons).some((l) => l.completed);
  });

  const modulesComplete = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id)));
  const anyPerfect = MODULES.some((m) => getModuleProgress(progress, m.id).practice.bestScore === 100);

  const totalHours = gam.totalStudyMinutes / 60;
  const allFlashcardsMastered = MODULES.some(
    (m) => (gam.flashcardsMastered[m.id] ?? 0) >= 40
  );

  return [
    {
      id: "first_lesson",
      title: "First Lesson",
      desc: "Complete your first lesson",
      icon: "📖",
      earned: anyLessonDone,
    },
    ...MODULES.map((m) => ({
      id: `module_master_${m.id}`,
      title: `Module ${m.id} Master`,
      desc: `Pass GQA Module ${m.id} test`,
      icon: "🏅",
      earned: isModuleComplete(getModuleProgress(progress, m.id)),
    })),
    {
      id: "perfect_score",
      title: "Perfect Score",
      desc: "Score 100% on any practice quiz",
      icon: "💯",
      earned: anyPerfect,
    },
    {
      id: "memory_machine",
      title: "Memory Machine",
      desc: "Master all flashcards for a module",
      icon: "🧠",
      earned: allFlashcardsMastered,
    },
    {
      id: "halfway",
      title: "Halfway There",
      desc: "3 of 5 GQA modules passed",
      icon: "⚡",
      earned: modulesComplete.length >= 3,
    },
    {
      id: "qualification",
      title: "Qualification Earned",
      desc: "All 5 GQA modules passed",
      icon: "🎓",
      earned: allGqaPassed(progress),
    },
    {
      id: "cscs_ready",
      title: "CSCS Ready",
      desc: "Pass the CSCS H&S test",
      icon: "💳",
      earned: progress.cscs.passed === true,
    },
    {
      id: "speed_learner",
      title: "Speed Learner",
      desc: "Complete course in under 6 hours",
      icon: "⚡",
      earned: allGqaPassed(progress) && totalHours <= 6 && totalHours > 0,
    },
    {
      id: "drill_sergeant",
      title: "Drill Sergeant",
      desc: "50 drill mode sessions completed",
      icon: "🎯",
      earned: gam.drillSessions >= 50,
    },
    {
      id: "streak_king",
      title: "Streak King",
      desc: "7 days studying in a row",
      icon: "🔥",
      earned: gam.streak >= 7,
    },
  ];
}

/* ─── smart nudges ─── */

export interface SmartNudge {
  id: string;
  message: string;
  action?: string; // route
  actionLabel?: string;
  type: "info" | "warning" | "success";
}

export function computeNudges(
  progress: ReturnType<typeof useProgress>["progress"],
  gam: GamificationState
): SmartNudge[] {
  const nudges: SmartNudge[] = [];
  const overall = getOverallProgress(progress);

  // Weak module areas
  for (const mod of MODULES) {
    const mp = getModuleProgress(progress, mod.id);
    if (mp.practice.attempts > 0 && mp.practice.bestScore < 80 && mp.practice.bestScore > 0) {
      nudges.push({
        id: `weak_${mod.id}`,
        message: `You scored ${mp.practice.bestScore}% on Module ${mod.id} practice — focus on ${mod.title}`,
        action: `/practice/${mod.id}`,
        actionLabel: "Practice Now",
        type: "warning",
      });
    }
  }

  // Inactivity
  if (gam.lastStudyDate) {
    const days = daysBetween(gam.lastStudyDate, todayStr());
    if (days >= 2) {
      nudges.push({
        id: "inactivity",
        message: `Haven't studied in ${days} days — your memory fades! Quick 5-min revision?`,
        action: "/dashboard",
        actionLabel: "Start Revision",
        type: "warning",
      });
    }
  }

  // GQA resit available
  for (const mod of MODULES) {
    const mp = getModuleProgress(progress, mod.id);
    if (mp.gqa.passed === false && mp.gqa.failedAt) {
      const hours = (Date.now() - new Date(mp.gqa.failedAt).getTime()) / 3600000;
      if (hours >= 24) {
        nudges.push({
          id: `resit_${mod.id}`,
          message: `Your Module ${mod.id} resit is available now (24 hours have passed)`,
          action: `/gqa-test/${mod.id}`,
          actionLabel: "Take Resit",
          type: "info",
        });
      }
    }
  }

  // Close to qualification
  const modulesComplete = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id))).length;
  if (modulesComplete === 4) {
    nudges.push({
      id: "almost_qualified",
      message: "You're 1 module away from your qualification!",
      type: "success",
    });
  }

  return nudges;
}

/* ─── motivational messages ─── */

export function getMotivationalMessage(
  progress: ReturnType<typeof useProgress>["progress"]
): string | null {
  const modulesComplete = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id))).length;

  if (progress.cscs.passed) return "🎉 You've done it! CSCS Health & Safety Test PASSED!";
  if (allGqaPassed(progress)) return "🎉 QUALIFICATION COMPLETE! Now let's nail the CSCS test.";
  if (modulesComplete >= 3) return "Over halfway! The hardest modules are behind you.";
  if (modulesComplete === 1) return "1 down, 4 to go! You're on your way to the CSCS card.";
  return null;
}

/* ─── context ─── */

interface GamificationContextValue {
  gamification: GamificationState;
  recordStudySession: () => void;
  recordDrillSession: () => void;
  recordFlashcardMastery: (moduleId: number, count: number) => void;
  addStudyMinutes: (minutes: number) => void;
  badges: Badge[];
  nudges: SmartNudge[];
  motivationalMessage: string | null;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { progress } = useProgress();
  const [gamification, setGamification] = useState<GamificationState>(load);

  const update = useCallback((fn: (prev: GamificationState) => GamificationState) => {
    setGamification((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  // Record study on mount / each page view
  const recordStudySession = useCallback(() => {
    const today = todayStr();
    update((prev) => {
      if (prev.lastStudyDate === today) return prev;
      const newDates = [...new Set([...prev.studyDates, today])];
      let newStreak = prev.streak;
      if (prev.lastStudyDate) {
        const gap = daysBetween(prev.lastStudyDate, today);
        newStreak = gap === 1 ? prev.streak + 1 : gap === 0 ? prev.streak : 1;
      } else {
        newStreak = 1;
      }
      return {
        ...prev,
        lastStudyDate: today,
        studyDates: newDates,
        streak: newStreak,
        firstOpenDate: prev.firstOpenDate ?? today,
      };
    });
  }, [update]);

  const recordDrillSession = useCallback(() => {
    update((prev) => ({ ...prev, drillSessions: prev.drillSessions + 1 }));
  }, [update]);

  const recordFlashcardMastery = useCallback(
    (moduleId: number, count: number) => {
      update((prev) => ({
        ...prev,
        flashcardsMastered: { ...prev.flashcardsMastered, [moduleId]: count },
      }));
    },
    [update]
  );

  const addStudyMinutes = useCallback(
    (minutes: number) => {
      update((prev) => ({ ...prev, totalStudyMinutes: prev.totalStudyMinutes + minutes }));
    },
    [update]
  );

  // Auto-record daily study
  useEffect(() => {
    recordStudySession();
  }, [recordStudySession]);

  const badges = computeBadges(progress, gamification);
  const nudges = computeNudges(progress, gamification);
  const motivationalMessage = getMotivationalMessage(progress);

  return (
    <GamificationContext.Provider
      value={{
        gamification,
        recordStudySession,
        recordDrillSession,
        recordFlashcardMastery,
        addStudyMinutes,
        badges,
        nudges,
        motivationalMessage,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be within GamificationProvider");
  return ctx;
};
