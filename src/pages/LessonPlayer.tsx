import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useXpProgress } from "@/hooks/useXpProgress";
import { getLessonMediaUrl } from "@/lib/media";
import SwipeContainer from "@/components/lesson/SwipeContainer";
import NavHeader from "@/components/lesson/ui/NavHeader";
import ProgressBar from "@/components/lesson/ui/ProgressBar";

// ── types ─────────────────────────────────────────────────────────────────────

export interface LessonCard {
  id: string;
  card_position: number;
  card_type: string;
  content_json: unknown;
  fourth_wall_effect: string | null;
  effect_overlay_text: string | null;
  media_bucket: string | null;
  media_file: string | null;
  module_id: number;
  xp_value: number;
  mediaUrl?: string;
}

// ── Exit modal ─────────────────────────────────────────────────────────────────

function ExitModal({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end",
            justifyContent: "center", padding: "0 16px 32px",
          }}
          onClick={onStay}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 380, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24, padding: 24, boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
            }}
          >
            <p style={{ color: "white", fontSize: 18, fontWeight: 700, textAlign: "center", margin: "0 0 8px 0" }}>
              Leave lesson?
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", margin: "0 0 24px 0" }}>
              Your progress is saved — you can resume anytime.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onStay}
                style={{
                  flex: 1, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Keep going
              </button>
              <button
                onClick={onLeave}
                style={{
                  flex: 1, height: 52, borderRadius: 16, background: "#C62828", border: "none",
                  color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Leave
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Resume modal ───────────────────────────────────────────────────────────────

function ResumeModal({
  open,
  cardIndex,
  onResume,
  onRestart,
}: {
  open: boolean;
  cardIndex: number;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end",
            justifyContent: "center", padding: "0 16px 32px",
          }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{
              width: "100%", maxWidth: 380, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24, padding: 24,
            }}
          >
            <p style={{ color: "white", fontSize: 18, fontWeight: 700, textAlign: "center", margin: "0 0 8px 0" }}>
              Welcome back! 👋
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", margin: "0 0 24px 0" }}>
              You were on card {cardIndex + 1}. Resume?
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onRestart}
                style={{
                  flex: 1, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Start over
              </button>
              <button
                onClick={onResume}
                style={{
                  flex: 1, height: 52, borderRadius: 16, background: "#f59e0b", border: "none",
                  color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Resume
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function LessonPlayer() {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completeLesson } = useProgress();
  const { addXp, recordStudySession, refreshLessonStrength } = useGamification();
  const { trackLessonComplete } = useTelemetry();
  const { saveCardProgress, addXpToDb, onLessonCompleteStreak, recordQuizAnswer } = useXpProgress(user?.id);

  const moduleId = Number(mIdStr) || 1;
  const lessonNumStr = lIdStr || "1";
  const lessonDbId = `${moduleId}.${lessonNumStr}`;
  const lessonNum = Number(lessonNumStr) || 1;

  const [cards, setCards] = useState<LessonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialIndex, setInitialIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showExit, setShowExit] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [resumeCardIndex, setResumeCardIndex] = useState(0);

  const heroContent = cards[0]?.content_json as Record<string, unknown> | undefined;
  const lessonTitle = (heroContent?.lesson_title ?? heroContent?.title) as string || "Lesson";
  const nextLessonContent = cards
    .find((c) => c.card_type === "lesson_complete")
    ?.content_json as Record<string, unknown> | undefined;
  const nextLessonTitle = nextLessonContent?.next_lesson_title as string | undefined;
  const nextLessonId = nextLessonContent?.next_lesson as string | null | undefined;

  // Load cards + progress
  useEffect(() => {
    (async () => {
      // Always fetch cards — lesson 1/1 is public (no auth required)
      const cardsPromise = supabase
        .from("lesson_cards")
        .select("*")
        .eq("lesson_id", lessonDbId)
        .order("card_position", { ascending: true });

      // Only fetch user-specific data if logged in
      const progressPromise = user
        ? supabase
            .from("user_lesson_progress")
            .select("cards_completed")
            .eq("lesson_id", lessonDbId)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null });

      const streakPromise = user
        ? supabase
            .from("streaks")
            .select("current_streak")
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null });

      const [{ data: cardData }, { data: progressData }, { data: streakData }] =
        await Promise.all([cardsPromise, progressPromise, streakPromise]);

      if (cardData) {
        const enriched: LessonCard[] = cardData.map((c) => ({
          ...c,
          mediaUrl: getLessonMediaUrl(c.media_file, c.media_bucket),
        }));
        setCards(enriched);
      }

      if (streakData) setStreak((streakData as { current_streak: number | null }).current_streak ?? 0);

      const savedIdx = (progressData as { cards_completed?: number } | null)?.cards_completed ?? 0;
      if (savedIdx > 0 && savedIdx < (cardData?.length ?? 0)) {
        setResumeCardIndex(savedIdx);
        setShowResume(true);
      }

      setLoading(false);
    })();
  }, [user, lessonDbId]);

  // Record study session on mount
  useEffect(() => { recordStudySession(); }, []);

  const handleIndexChange = useCallback(
    async (index: number) => {
      setCurrentIndex(index);
      if (!user || cards.length === 0) return; // skip DB writes for unauthenticated
      const isComplete = cards[index]?.card_type === "lesson_complete";
      const xpSoFar = cards.slice(0, index + 1).reduce((sum, c) => sum + c.xp_value, 0);
      await saveCardProgress(lessonDbId, index, cards.length, xpSoFar, isComplete);
    },
    [user, cards, lessonDbId, saveCardProgress],
  );

  const handleAnswer = useCallback(
    (cardPosition: number, correct: boolean, selected: number) => {
      if (user) recordQuizAnswer(cardPosition, selected, correct);
      const card = cards.find((c) => c.card_position === cardPosition);
      if (card && correct) {
        setSessionXp((prev) => prev + card.xp_value);
      }
    },
    [user, cards, recordQuizAnswer],
  );

  const handleLessonComplete = useCallback(
    async (totalXp: number) => {
      completeLesson(moduleId, lessonNum);
      trackLessonComplete(moduleId, lessonNum);
      refreshLessonStrength(moduleId, lessonNum);
      if (totalXp > 0) {
        addXp(totalXp, "Lesson complete");
        await addXpToDb(totalXp);
      }
      await onLessonCompleteStreak();
    },
    [moduleId, lessonNum, completeLesson, trackLessonComplete, refreshLessonStrength, addXp, addXpToDb, onLessonCompleteStreak],
  );

  const handleNextLesson = useCallback(() => {
    if (!nextLessonId) {
      navigate("/learn");
      return;
    }
    const [nextMod, nextLes] = nextLessonId.split(".");
    navigate(`/lesson/${nextMod}/${nextLes}`);
  }, [nextLessonId, navigate]);

  const handleResume = useCallback(() => {
    setInitialIndex(resumeCardIndex);
    setCurrentIndex(resumeCardIndex);
    setShowResume(false);
  }, [resumeCardIndex]);

  const handleRestart = useCallback(() => {
    setInitialIndex(0);
    setCurrentIndex(0);
    setShowResume(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100dvh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(255,255,255,0.2)",
            borderTop: "3px solid #f59e0b",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 50 }}>
      {/* Fixed nav */}
      <NavHeader
        title={lessonTitle}
        current={currentIndex + 1}
        total={cards.length}
        onBack={() => setShowExit(true)}
      />

      {/* Progress bar */}
      <ProgressBar current={currentIndex + 1} total={cards.length} />

      {/* Main swipe container — offset top for nav header */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: "calc(55px + env(safe-area-inset-top))",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <SwipeContainer
          cards={cards}
          currentIndex={currentIndex}
          initialIndex={initialIndex}
          muted={muted}
          onMuteToggle={() => setMuted((m) => !m)}
          lessonTitle={lessonTitle}
          streak={streak}
          nextLessonTitle={nextLessonTitle}
          sessionXp={sessionXp}
          onIndexChange={handleIndexChange}
          onAnswer={handleAnswer}
          onLessonComplete={handleLessonComplete}
          onNextLesson={handleNextLesson}
        />
      </div>

      <ExitModal open={showExit} onStay={() => setShowExit(false)} onLeave={() => navigate(-1)} />
      <ResumeModal
        open={showResume}
        cardIndex={resumeCardIndex}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    </div>
  );
}
