import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  useProgress,
  getModuleProgress,
  isModuleComplete,
  allGqaPassed,
  getOverallProgress,
  areAllLessonsComplete,
  getLessonsCompleted,
} from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MODULES } from "@/data/courseData";
import { triggerHaptic } from "@/lib/haptics";

/* ─── types ─── */

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface GamificationState {
  streak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  studyDates: string[];
  drillSessions: number;
  flashcardsMastered: Record<number, number>;
  firstOpenDate: string | null;
  totalStudyMinutes: number;
  streakFrozen: boolean;
  // New fields
  totalXp: number;
  dailyXp: number;
  dailyGoal: number; // XP target per day
  dailyXpDate: string; // YYYY-MM-DD
  level: number;
  milestonesAchieved: string[];
  streakFreezesAvailable: number;
  lessonStrength: Record<string, { strength: number; lastReviewed: string }>; // "moduleId.lessonId"
  dailyGoalSet: boolean;
  pendingMilestone: string | null; // ID of milestone to celebrate
  pendingXpPop: { amount: number; label: string } | null;
}

const defaultState = (): GamificationState => ({
  streak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  studyDates: [],
  drillSessions: 0,
  flashcardsMastered: {},
  firstOpenDate: null,
  totalStudyMinutes: 0,
  streakFrozen: false,
  totalXp: 0,
  dailyXp: 0,
  dailyGoal: 50,
  dailyXpDate: todayStr(),
  level: 1,
  milestonesAchieved: [],
  streakFreezesAvailable: 0,
  lessonStrength: {},
  dailyGoalSet: false,
  pendingMilestone: null,
  pendingXpPop: null,
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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const daysBetween = (a: string, b: string) =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

function xpToLevel(xp: number): number {
  // Each level = 100 XP, matching useXpProgress.ts
  return Math.floor(xp / 100) + 1;
}

/* ─── badge definitions ─── */

export function computeBadges(
  progress: ReturnType<typeof useProgress>["progress"],
  gam: GamificationState
): Badge[] {
  const anyLessonDone = MODULES.some((m) => {
    const mp = getModuleProgress(progress, m.id);
    return Object.values(mp.lessons).some((l) => l.completed);
  });

  const modulesComplete = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id)));
  const anyPerfect = MODULES.some((m) => getModuleProgress(progress, m.id).practice.bestScore === 100);
  const totalHours = gam.totalStudyMinutes / 60;
  const allFlashcardsMastered = MODULES.some((m) => (gam.flashcardsMastered[m.id] ?? 0) >= 40);

  return [
    { id: "first_lesson", title: "First Lesson", desc: "Complete your first lesson", icon: "📖", earned: anyLessonDone },
    ...MODULES.map((m) => ({
      id: `module_master_${m.id}`,
      title: `Module ${m.id} Master`,
      desc: `Pass GQA Module ${m.id} test`,
      icon: "🏅",
      earned: isModuleComplete(getModuleProgress(progress, m.id)),
    })),
    { id: "perfect_score", title: "Perfect Score", desc: "Score 100% on any practice quiz", icon: "💯", earned: anyPerfect },
    { id: "memory_machine", title: "Memory Machine", desc: "Master all flashcards for a module", icon: "🧠", earned: allFlashcardsMastered },
    { id: "halfway", title: "Halfway There", desc: "3 of 5 GQA modules passed", icon: "⚡", earned: modulesComplete.length >= 3 },
    { id: "qualification", title: "Qualification Earned", desc: "All 5 GQA modules passed", icon: "🎓", earned: allGqaPassed(progress) },
    { id: "cscs_ready", title: "CSCS Ready", desc: "Pass the CSCS H&S test", icon: "💳", earned: progress.cscs.passed === true },
    { id: "speed_learner", title: "Speed Learner", desc: "Complete course in under 6 hours", icon: "⚡", earned: allGqaPassed(progress) && totalHours <= 6 && totalHours > 0 },
    { id: "drill_sergeant", title: "Drill Sergeant", desc: "50 drill mode sessions completed", icon: "🎯", earned: gam.drillSessions >= 50 },
    { id: "streak_king", title: "Streak King", desc: "7 days studying in a row", icon: "🔥", earned: gam.streak >= 7 },
    { id: "xp_500", title: "XP Hunter", desc: "Earn 500 XP total", icon: "⭐", earned: gam.totalXp >= 500 },
    { id: "xp_2000", title: "XP Master", desc: "Earn 2000 XP total", icon: "🌟", earned: gam.totalXp >= 2000 },
  ];
}

/* ─── smart nudges ─── */

export interface SmartNudge {
  id: string;
  message: string;
  action?: string;
  actionLabel?: string;
  type: "info" | "warning" | "success";
}

export function computeNudges(
  progress: ReturnType<typeof useProgress>["progress"],
  gam: GamificationState
): SmartNudge[] {
  const nudges: SmartNudge[] = [];

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

  // Decay warnings
  const decaying = Object.entries(gam.lessonStrength).filter(([, v]) => v.strength <= 50);
  if (decaying.length > 0) {
    nudges.push({
      id: "decay_warning",
      message: `${decaying.length} lesson${decaying.length > 1 ? "s" : ""} fading — review now to keep your knowledge fresh!`,
      action: "/dashboard",
      actionLabel: "Review",
      type: "warning",
    });
  }

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

  const modulesComplete = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id))).length;
  if (modulesComplete === 4) {
    nudges.push({ id: "almost_qualified", message: "You're 1 module away from your qualification!", type: "success" });
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

/* ─── social proof ─── */

const SOCIAL_PROOF_MESSAGES = [
  () => `${Math.floor(180 + Math.random() * 120)} workers are learning right now`,
  () => `${Math.floor(8 + Math.random() * 10)} workers earned their Green Card this week`,
  () => `Workers in London completed ${(Math.floor(35 + Math.random() * 20) * 100).toLocaleString()} lessons today`,
  () => `${Math.floor(50 + Math.random() * 80)} workers just passed their CSCS test this month`,
];

export function getSocialProofMessage(): string {
  const idx = Math.floor(Date.now() / 15000) % SOCIAL_PROOF_MESSAGES.length; // rotate every 15s
  return SOCIAL_PROOF_MESSAGES[idx]();
}

/* ─── milestone definitions ─── */

export const MILESTONES: Record<string, { title: string; message: string; emoji: string }> = {
  first_lesson: {
    title: "First Step! 🎉",
    message: "You just took your first step toward your CSCS card!",
    emoji: "🎉",
  },
  first_topic: {
    title: "Topic Complete! 🏅",
    message: "1 of 5 topics done — your CSCS card is taking shape!",
    emoji: "🏅",
  },
  streak_7: {
    title: "One Week Strong! 🔥",
    message: "Most people who keep a 7-day streak pass first time.",
    emoji: "🔥",
  },
  all_topics: {
    title: "All Topics Learned! 🎓",
    message: "Your CSCS card is assembling — you're almost there!",
    emoji: "🎓",
  },
  daily_goal: {
    title: "Daily Goal Smashed! 🔥",
    message: "You hit your daily learning target — keep the streak alive!",
    emoji: "🔥",
  },
};

/* ─── progress decay calculator ─── */

export function calculateDecayedStrength(lastReviewed: string): number {
  const days = daysBetween(lastReviewed, todayStr());
  return Math.max(0, 100 - days * 5);
}

export function getStrengthColor(strength: number): string {
  if (strength >= 75) return "bg-primary";
  if (strength >= 50) return "bg-amber-500";
  return "bg-destructive";
}

export function getStrengthLabel(strength: number): string | null {
  if (strength >= 75) return null;
  if (strength >= 50) return "Review needed";
  if (strength >= 25) return "Fading — review now!";
  return "Fading — review now!";
}

/* ─── Supabase streak sync ─── */

async function loadStreakFromSupabase(userId: string) {
  const { data } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak, last_active_date, streak_frozen")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;
  return {
    current: data.current_streak ?? 0,
    longest: data.longest_streak ?? 0,
    lastDate: data.last_active_date,
    frozen: data.streak_frozen ?? false,
  };
}

async function upsertStreak(userId: string, current: number, longest: number, lastDate: string, frozen: boolean) {
  const { data: existing } = await supabase
    .from("streaks")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("streaks").update({ current_streak: current, longest_streak: longest, last_active_date: lastDate, streak_frozen: frozen }).eq("user_id", userId);
  } else {
    await supabase.from("streaks").insert({ user_id: userId, current_streak: current, longest_streak: longest, last_active_date: lastDate, streak_frozen: frozen });
  }
}

async function loadGamificationFromSupabase(userId: string) {
  const { data } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

async function upsertGamification(userId: string, gam: GamificationState) {
  await supabase.from("user_gamification").upsert({
    user_id: userId,
    total_xp: gam.totalXp,
    daily_xp: gam.dailyXp,
    daily_goal: gam.dailyGoal,
    level: gam.level,
    milestones_achieved: gam.milestonesAchieved,
    streak_freezes_available: gam.streakFreezesAvailable,
    daily_xp_date: gam.dailyXpDate,
  }, { onConflict: "user_id" });
}

/* ─── context ─── */

interface GamificationContextValue {
  gamification: GamificationState;
  recordStudySession: () => void;
  recordDrillSession: () => void;
  recordFlashcardMastery: (moduleId: number, count: number) => void;
  addStudyMinutes: (minutes: number) => void;
  addXp: (amount: number, label: string) => void;
  setDailyGoal: (xpTarget: number) => void;
  clearPendingMilestone: () => void;
  clearPendingXpPop: () => void;
  refreshLessonStrength: (moduleId: number, lessonId: number) => void;
  badges: Badge[];
  nudges: SmartNudge[];
  motivationalMessage: string | null;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { progress } = useProgress();
  const { user } = useAuth();
  const [gamification, setGamification] = useState<GamificationState>(load);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback((fn: (prev: GamificationState) => GamificationState) => {
    setGamification((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  // Debounced Supabase sync
  const syncToSupabase = useCallback((state: GamificationState) => {
    if (!user) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => upsertGamification(user.id, state), 1000);
  }, [user]);

  // Load from Supabase when user logs in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [remote, remoteGam] = await Promise.all([
        loadStreakFromSupabase(user.id),
        loadGamificationFromSupabase(user.id),
      ]);

      update((prev) => {
        let next = { ...prev };
        if (remote) {
          next = { ...next, streak: remote.current, longestStreak: remote.longest, lastStudyDate: remote.lastDate, streakFrozen: remote.frozen };
        }
        if (remoteGam) {
          next = {
            ...next,
            totalXp: Math.max(next.totalXp, remoteGam.total_xp ?? 0),
            dailyXp: remoteGam.daily_xp_date === todayStr() ? (remoteGam.daily_xp ?? 0) : 0,
            dailyGoal: remoteGam.daily_goal ?? 50,
            dailyXpDate: remoteGam.daily_xp_date ?? todayStr(),
            level: remoteGam.level ?? 1,
            milestonesAchieved: (remoteGam.milestones_achieved as string[]) ?? [],
            streakFreezesAvailable: remoteGam.streak_freezes_available ?? 0,
            dailyGoalSet: (remoteGam.daily_goal ?? 50) !== 50,
          };
        }
        return next;
      });
    })();
  }, [user, update]);

  // Decay lesson strength on load
  useEffect(() => {
    update((prev) => {
      const updated = { ...prev.lessonStrength };
      for (const [key, val] of Object.entries(updated)) {
        updated[key] = { ...val, strength: calculateDecayedStrength(val.lastReviewed) };
      }
      return { ...prev, lessonStrength: updated };
    });
  }, [update]);

  // Check milestones
  const checkMilestones = useCallback((state: GamificationState) => {
    const achieved = new Set(state.milestonesAchieved);
    let pending: string | null = null;

    // First lesson
    const anyLesson = MODULES.some((m) => {
      const mp = getModuleProgress(progress, m.id);
      return Object.values(mp.lessons).some((l) => l.completed);
    });
    if (anyLesson && !achieved.has("first_lesson")) {
      achieved.add("first_lesson");
      pending = "first_lesson";
    }

    // First topic complete
    const modulesComplete = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id))).length;
    if (modulesComplete >= 1 && !achieved.has("first_topic")) {
      achieved.add("first_topic");
      pending = "first_topic";
    }

    // 7-day streak
    if (state.streak >= 7 && !achieved.has("streak_7")) {
      achieved.add("streak_7");
      pending = "streak_7";
    }

    // All topics
    if (allGqaPassed(progress) && !achieved.has("all_topics")) {
      achieved.add("all_topics");
      pending = "all_topics";
    }

    // Streak freeze earned at 3-day
    let freezes = state.streakFreezesAvailable;
    if (state.streak >= 3 && freezes === 0 && !achieved.has("streak_freeze_earned")) {
      achieved.add("streak_freeze_earned");
      freezes = 1;
    }

    return {
      milestonesAchieved: Array.from(achieved),
      pendingMilestone: pending,
      streakFreezesAvailable: freezes,
    };
  }, [progress]);

  const recordStudySession = useCallback(() => {
    const today = todayStr();
    update((prev) => {
      if (prev.lastStudyDate === today) return prev;

      let newStreak = prev.streak;
      let frozen = prev.streakFrozen;
      let freezes = prev.streakFreezesAvailable;

      if (prev.lastStudyDate) {
        const gap = daysBetween(prev.lastStudyDate, today);
        if (gap === 1) {
          newStreak = prev.streak + 1;
        } else if (gap === 0) {
          newStreak = prev.streak;
        } else if (gap === 2 && freezes > 0) {
          // Auto-activate streak freeze
          freezes--;
          frozen = true;
          newStreak = prev.streak; // Preserve
        } else if (gap > 1 && prev.streakFrozen) {
          newStreak = prev.streak;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newLongest = Math.max(prev.longestStreak, newStreak);
      const newDates = [...new Set([...prev.studyDates, today])];

      // Streak bonus XP
      const streakXp = newStreak > prev.streak ? 25 : 0;

      // Reset daily XP if new day
      const dailyXp = prev.dailyXpDate === today ? prev.dailyXp + streakXp : streakXp;

      if (user) {
        upsertStreak(user.id, newStreak, newLongest, today, frozen);
      }

      const next: GamificationState = {
        ...prev,
        lastStudyDate: today,
        studyDates: newDates,
        streak: newStreak,
        longestStreak: newLongest,
        firstOpenDate: prev.firstOpenDate ?? today,
        streakFrozen: frozen,
        streakFreezesAvailable: freezes,
        totalXp: prev.totalXp + streakXp,
        dailyXp,
        dailyXpDate: today,
        level: xpToLevel(prev.totalXp + streakXp),
      };

      const milestoneData = checkMilestones(next);
      return { ...next, ...milestoneData };
    });
  }, [update, user, checkMilestones]);

  const addXp = useCallback((amount: number, label: string) => {
    update((prev) => {
      const today = todayStr();
      const newTotalXp = prev.totalXp + amount;
      const newDailyXp = (prev.dailyXpDate === today ? prev.dailyXp : 0) + amount;
      const hitGoal = newDailyXp >= prev.dailyGoal && prev.dailyXp < prev.dailyGoal && prev.dailyGoalSet;

      const next: GamificationState = {
        ...prev,
        totalXp: newTotalXp,
        dailyXp: newDailyXp,
        dailyXpDate: today,
        level: xpToLevel(newTotalXp),
        pendingXpPop: { amount, label },
        pendingMilestone: hitGoal ? "daily_goal" : prev.pendingMilestone,
      };

      const milestoneData = checkMilestones(next);
      syncToSupabase({ ...next, ...milestoneData });
      return { ...next, ...milestoneData, pendingMilestone: hitGoal ? "daily_goal" : milestoneData.pendingMilestone };
    });
  }, [update, checkMilestones, syncToSupabase]);

  const setDailyGoal = useCallback((xpTarget: number) => {
    update((prev) => {
      const next = { ...prev, dailyGoal: xpTarget, dailyGoalSet: true };
      if (user) syncToSupabase(next);
      return next;
    });
  }, [update, user, syncToSupabase]);

  const clearPendingMilestone = useCallback(() => {
    update((prev) => ({ ...prev, pendingMilestone: null }));
  }, [update]);

  const clearPendingXpPop = useCallback(() => {
    update((prev) => ({ ...prev, pendingXpPop: null }));
  }, [update]);

  const refreshLessonStrength = useCallback((moduleId: number, lessonId: number) => {
    const key = `${moduleId}.${lessonId}`;
    update((prev) => ({
      ...prev,
      lessonStrength: {
        ...prev.lessonStrength,
        [key]: { strength: 100, lastReviewed: todayStr() },
      },
    }));
    if (user) {
      supabase.from("lesson_strength").upsert({
        user_id: user.id,
        module_id: moduleId,
        lesson_id: lessonId,
        strength: 100,
        last_reviewed_at: new Date().toISOString(),
      }, { onConflict: "user_id,module_id,lesson_id" }).then(() => {});
    }
  }, [update, user]);

  const recordDrillSession = useCallback(() => {
    update((prev) => ({ ...prev, drillSessions: prev.drillSessions + 1 }));
  }, [update]);

  const recordFlashcardMastery = useCallback(
    (moduleId: number, count: number) => {
      update((prev) => ({ ...prev, flashcardsMastered: { ...prev.flashcardsMastered, [moduleId]: count } }));
    },
    [update]
  );

  const addStudyMinutes = useCallback(
    (minutes: number) => {
      update((prev) => ({ ...prev, totalStudyMinutes: prev.totalStudyMinutes + minutes }));
    },
    [update]
  );

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
        addXp,
        setDailyGoal,
        clearPendingMilestone,
        clearPendingXpPop,
        refreshLessonStrength,
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
