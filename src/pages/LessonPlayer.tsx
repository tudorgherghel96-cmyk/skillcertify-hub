import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import LessonSwipeView from "@/components/LessonSwipeView";
import { useProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTelemetry } from "@/hooks/useTelemetry";
import { ArrowLeft } from "lucide-react";

// ─── Exit confirmation modal ─────────────────────────────────────────────────
function ExitModal({
  open,
  onStay,
  onLeave,
}: {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm pb-8 px-4"
          onClick={onStay}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 space-y-4 shadow-2xl"
          >
            <p className="text-lg font-bold text-foreground text-center">Exit lesson?</p>
            <p className="text-sm text-muted-foreground text-center">
              Your progress is saved — you can resume from where you left off.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onStay}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground active:scale-95 transition-transform"
              >
                Keep going
              </button>
              <button
                onClick={onLeave}
                className="flex-1 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-transform"
                style={{ background: "#C62828", color: "white" }}
              >
                Exit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function LessonPlayer() {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeLesson } = useProgress();
  const { addXp, recordStudySession, refreshLessonStrength } = useGamification();
  const { language } = useLanguage();
  const { trackLessonComplete } = useTelemetry();

  const moduleId = Number(mIdStr) || 1;
  // lessonId for Supabase is the "M.L" string format e.g. "1.1", "2.3"
  // The URL params are moduleId=1, lessonId=1 → lesson_id="1.1"
  const lessonNumStr = lIdStr || "1";
  const lessonDbId = `${moduleId}.${lessonNumStr}`; // e.g. "1.1"
  const lessonNum = Number(lessonNumStr) || 1;

  const [showExit, setShowExit] = useState(false);
  const [resumeCard, setResumeCard] = useState<number | undefined>(undefined);
  const [currentStreak, setCurrentStreak] = useState<number | undefined>(undefined);

  // Hide bottom nav during lesson
  useEffect(() => {
    const bottomNav = document.querySelector("nav.fixed.bottom-0");
    if (bottomNav) (bottomNav as HTMLElement).style.display = "none";
    return () => {
      if (bottomNav) (bottomNav as HTMLElement).style.display = "";
    };
  }, []);

  // Load streak
  useEffect(() => {
    if (!user) return;
    supabase
      .from("streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCurrentStreak(data.current_streak ?? 0);
      });
  }, [user]);

  // Record study session on mount
  useEffect(() => {
    recordStudySession();
  }, []);

  // Handle exit: left-edge swipe triggers this
  const handleExitRequest = useCallback(() => setShowExit(true), []);

  const handleLeave = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Called by LessonSwipeView when the lesson_complete card is reached
  const handleLessonComplete = useCallback(
    (totalXp: number, nextLesson: string | null) => {
      // Mark progress
      completeLesson(moduleId, lessonNum);
      trackLessonComplete(moduleId, lessonNum);
      refreshLessonStrength(moduleId, lessonNum);
      // Award XP
      if (totalXp > 0) addXp(totalXp, "Lesson complete");
    },
    [moduleId, lessonNum, completeLesson, trackLessonComplete, refreshLessonStrength, addXp],
  );

  // Navigate to next lesson — called from LessonCompleteCard button
  const handleNextLesson = useCallback(
    (nextLessonId: string | null) => {
      if (!nextLessonId) {
        // Course complete — go to learn hub
        navigate("/learn");
        return;
      }
      // nextLessonId is e.g. "1.2" or "2.1"
      const [nextMod, nextLes] = nextLessonId.split(".");
      navigate(`/lesson/${nextMod}/${nextLes}`);
    },
    [navigate],
  );

  const dir = (language.code === "ar" ? "rtl" : "ltr") as "ltr" | "rtl";

  return (
    <div className="fixed inset-0 z-40 bg-background flex flex-col">
      {/* Back button — absolute, over content */}
      <button
        onClick={handleExitRequest}
        aria-label="Exit lesson"
        className="absolute top-3 left-3 z-50 h-9 w-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white active:scale-90 transition-transform"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {/* Full-screen swipe view */}
      <div className="flex-1 overflow-hidden">
        <LessonSwipeView
          lessonId={lessonDbId}
          moduleId={moduleId}
          streak={currentStreak}
          dir={dir}
          initialCardIndex={resumeCard}
          onLessonComplete={handleLessonComplete}
          onNextLesson={handleNextLesson}
          onExitRequest={handleExitRequest}
        />
      </div>

      {/* Exit confirmation modal */}
      <ExitModal
        open={showExit}
        onStay={() => setShowExit(false)}
        onLeave={handleLeave}
      />
    </div>
  );
}
