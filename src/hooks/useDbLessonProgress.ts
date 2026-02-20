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
        };
      }
      setProgressMap(map);
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  return { progressMap, loading };
}
