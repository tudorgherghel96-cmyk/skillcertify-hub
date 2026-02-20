/**
 * useXpProgress
 * Handles writing to user_lesson_progress, user_xp, and daily_xp_log.
 * Also implements streak logic on lesson completion.
 */

import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Level threshold: each 100 XP = 1 level
export function xpToLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export interface QuizAnswer {
  selected: number;
  correct: boolean;
}

export function useXpProgress(userId: string | undefined) {
  // Track pending quiz answers for the current lesson
  const quizAnswers = useRef<Record<number, QuizAnswer>>({});

  const recordQuizAnswer = useCallback(
    (cardPosition: number, selectedIndex: number, isCorrect: boolean) => {
      quizAnswers.current[cardPosition] = { selected: selectedIndex, correct: isCorrect };
    },
    [],
  );

  /**
   * Called on every card advance — upserts user_lesson_progress
   */
  const saveCardProgress = useCallback(
    async (
      lessonId: string,
      cardIndex: number,   // 0-based index of card just reached
      totalCards: number,
      xpEarned: number,
      isComplete: boolean,
    ) => {
      if (!userId) return;

      const cardsCompleted = cardIndex + 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      await db
        .from("user_lesson_progress")
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            cards_completed: cardsCompleted,
            total_cards: totalCards,
            quiz_answers: quizAnswers.current,
            xp_earned: xpEarned,
            completed_at: isComplete ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" },
        );
    },
    [userId],
  );

  /**
   * Called when lesson XP is earned — adds to user_xp and daily_xp_log,
   * returns new level if level-up occurred (otherwise null).
   */
  const addXpToDb = useCallback(
    async (xpAmount: number): Promise<{ newLevel: number | null; totalXp: number }> => {
      if (!userId || xpAmount <= 0) return { newLevel: null, totalXp: 0 };

      // ── user_xp upsert ──
      const { data: existing } = await supabase
        .from("user_xp")
        .select("total_xp, level")
        .eq("user_id", userId)
        .maybeSingle();

      const prevXp = existing?.total_xp ?? 0;
      const prevLevel = existing?.level ?? 1;
      const newTotalXp = prevXp + xpAmount;
      const newLevel = xpToLevel(newTotalXp);

      await supabase
        .from("user_xp")
        .upsert(
          { user_id: userId, total_xp: newTotalXp, level: newLevel, updated_at: new Date().toISOString() },
          { onConflict: "user_id" },
        );

      // ── daily_xp_log upsert ──
      const today = new Date().toISOString().slice(0, 10);
      const { data: dayLog } = await supabase
        .from("daily_xp_log")
        .select("xp_earned")
        .eq("user_id", userId)
        .eq("log_date", today)
        .maybeSingle();

      const dayXp = (dayLog?.xp_earned ?? 0) + xpAmount;
      await supabase
        .from("daily_xp_log")
        .upsert(
          { user_id: userId, log_date: today, xp_earned: dayXp, updated_at: new Date().toISOString() },
          { onConflict: "user_id,log_date" },
        );

      const leveledUp = newLevel > prevLevel;
      return { newLevel: leveledUp ? newLevel : null, totalXp: newTotalXp };
    },
    [userId],
  );

  /**
   * Called when a lesson is fully completed — implements streak logic.
   * Returns { current_streak, longest_streak } after update.
   */
  const onLessonCompleteStreak = useCallback(async () => {
    if (!userId) return;

    const today = new Date().toISOString().slice(0, 10);

    const { data } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_active_date, streak_frozen")
      .eq("user_id", userId)
      .maybeSingle();

    let current = data?.current_streak ?? 0;
    let longest = data?.longest_streak ?? 0;
    const lastDate = data?.last_active_date ?? null;
    let frozen = data?.streak_frozen ?? false;

    // Get streak_freezes from user_gamification
    const { data: gam } = await supabase
      .from("user_gamification")
      .select("streak_freezes_available")
      .eq("user_id", userId)
      .maybeSingle();
    let freezes = gam?.streak_freezes_available ?? 0;

    if (lastDate === today) {
      // Already counted today — no change
      return;
    }

    if (!lastDate) {
      current = 1;
    } else {
      const msPerDay = 86400000;
      const gap = Math.floor(
        (new Date(today).getTime() - new Date(lastDate).getTime()) / msPerDay,
      );

      if (gap === 1) {
        current += 1;
        frozen = false;
      } else if (gap === 2 && freezes > 0) {
        // Use a streak freeze
        freezes -= 1;
        frozen = true;
        current += 1; // count today, freeze covered yesterday
      } else {
        // Streak broken
        current = 1;
        frozen = false;
      }
    }

    longest = Math.max(longest, current);

    // Earn a freeze at 3-day streak
    if (current >= 3 && freezes === 0 && !frozen) {
      freezes = 1;
    }

    await supabase
      .from("streaks")
      .upsert(
        {
          user_id: userId,
          current_streak: current,
          longest_streak: longest,
          last_active_date: today,
          streak_frozen: frozen,
        },
        { onConflict: "user_id" },
      );

    // Sync freezes back to user_gamification
    await supabase
      .from("user_gamification")
      .upsert(
        {
          user_id: userId,
          streak_freezes_available: freezes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
  }, [userId]);

  const resetQuizAnswers = useCallback(() => {
    quizAnswers.current = {};
  }, []);

  return { saveCardProgress, addXpToDb, onLessonCompleteStreak, recordQuizAnswer, resetQuizAnswers };
}
