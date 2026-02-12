import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Telemetry hook – writes lesson/practice/mock data to Supabase
 * when the user is authenticated. Fails silently otherwise.
 */
export function useTelemetry() {
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      userIdRef.current = data.user?.id ?? null;
    });
  }, []);

  const trackLessonComplete = useCallback(
    async (moduleId: number, lessonId: number) => {
      const uid = userIdRef.current;
      if (!uid) return;
      try {
        await supabase.from("progress").upsert(
          {
            user_id: uid,
            module_id: moduleId,
            lesson_id: String(lessonId),
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_id,lesson_id" }
        );
      } catch (e) {
        console.warn("[telemetry] lesson write failed", e);
      }
    },
    []
  );

  const trackPracticeAttempt = useCallback(
    async (
      moduleId: number,
      score: number,
      total: number,
      mode: string,
      answersJson?: unknown
    ) => {
      const uid = userIdRef.current;
      if (!uid) return;
      try {
        await supabase.from("practice_attempts").insert([{
          user_id: uid,
          module_id: moduleId,
          score,
          total,
          percentage: total > 0 ? Math.round((score / total) * 100) : 0,
          mode,
          answers_json: (answersJson as any) ?? null,
        }]);
      } catch (e) {
        console.warn("[telemetry] practice write failed", e);
      }
    },
    []
  );

  const trackMockAttempt = useCallback(
    async (score: number, total: number, durationSeconds?: number) => {
      const uid = userIdRef.current;
      if (!uid) return;
      try {
        await (supabase.from("mock_attempts") as any).insert({
          user_id: uid,
          score,
          total,
          duration_seconds: durationSeconds ?? null,
        });
      } catch (e) {
        console.warn("[telemetry] mock write failed", e);
      }
    },
    []
  );

  const trackConceptAttempt = useCallback(
    async (conceptId: string, isCorrect: boolean, responseTimeMs: number) => {
      const uid = userIdRef.current;
      if (!uid) return;
      try {
        await supabase.from("concept_attempts").insert({
          user_id: uid,
          concept_id: conceptId,
          is_correct: isCorrect,
          response_time_ms: responseTimeMs,
        });
      } catch (e) {
        console.warn("[telemetry] concept attempt write failed", e);
      }
    },
    []
  );

  return { trackLessonComplete, trackPracticeAttempt, trackMockAttempt, trackConceptAttempt };
}
