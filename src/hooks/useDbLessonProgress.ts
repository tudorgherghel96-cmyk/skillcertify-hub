/**
 * useDbLessonProgress
 * Fetches user_lesson_progress from Supabase for all lessons.
 * Returns a map of lesson_id -> { completed, xp_earned, cards_completed, total_cards }
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LessonProgressRecord {
  completed: boolean;
  xp_earned: number;
  cards_completed: number;
  total_cards: number;
  best_quiz_score: number | null;
  quiz_passed: boolean | null;
}

export type LessonProgressMap = Record<string, LessonProgressRecord>;

export function useDbLessonProgress() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<LessonProgressMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgressMap({});
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed_at, xp_earned, cards_completed, total_cards")
        .eq("user_id", user.id);

      if (error) {
        console.error("useDbLessonProgress error:", error);
        setLoading(false);
        return;
      }

      const map: LessonProgressMap = {};
      for (const row of data ?? []) {
        map[row.lesson_id] = {
          completed: !!row.completed_at,
          xp_earned: row.xp_earned ?? 0,
          cards_completed: row.cards_completed ?? 0,
          total_cards: row.total_cards ?? 0,
          best_quiz_score: null,
          quiz_passed: null,
        };
      }

      // Fetch best quiz scores per lesson
      const { data: quizData } = await supabase
        .from("lesson_quiz_attempts")
        .select("lesson_id, score, total, passed")
        .eq("user_id", user.id);

      for (const row of quizData ?? []) {
        const pct = row.total > 0 ? Math.round((row.score / row.total) * 100) : 0;
        const existing = map[row.lesson_id];
        if (existing) {
          if (existing.best_quiz_score === null || pct > existing.best_quiz_score) {
            existing.best_quiz_score = pct;
            existing.quiz_passed = row.passed;
          }
        } else {
          map[row.lesson_id] = {
            completed: false,
            xp_earned: 0,
            cards_completed: 0,
            total_cards: 0,
            best_quiz_score: pct,
            quiz_passed: row.passed,
          };
        }
      }

      setProgressMap(map);
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  return { progressMap, loading };
}
