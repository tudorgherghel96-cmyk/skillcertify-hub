import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

interface LessonCompleteCardProps {
  totalXp: number;
  cardsCompleted: number;
  correctAnswers: number;
  totalQuestions: number;
  streak?: number;
  nextLessonId?: string;
  nextLessonTitle?: string;
  hasWeakCards?: boolean;
  dir?: "ltr" | "rtl";
  onReviewWeak?: () => void;
  onNextLesson?: () => void;
}

/** CSS confetti — 50 multi-coloured pieces */
function ConfettiBurst() {
  const colours = ["#FFD700", "#FF6B6B", "#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#00BCD4", "#9C27B0"];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colours[i % colours.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    size: 5 + Math.random() * 9,
    rotation: Math.random() * 360,
    isCircle: Math.random() > 0.5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: "100vh", opacity: [1, 1, 0], rotate: p.rotation + 360, scale: [1, 1, 0.4] }}
          transition={{ duration: 2.4, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

/** Animated XP counter — 0 → target over 1.5s */
function XpCounter({ target }: { target: number }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const steps = 60;
    const interval = 1500 / steps;
    const step = Math.ceil(target / steps);
    ref.current = setInterval(() => {
      setDisplayed(prev => {
        if (prev + step >= target) {
          clearInterval(ref.current!);
          return target;
        }
        return prev + step;
      });
    }, interval);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target]);

  return (
    <motion.span
      className="text-5xl font-black"
      style={{ color: "#F9A825" }}
    >
      {displayed}
    </motion.span>
  );
}

export default function LessonCompleteCard({
  totalXp,
  cardsCompleted,
  correctAnswers,
  totalQuestions,
  streak,
  nextLessonId,
  nextLessonTitle,
  hasWeakCards = false,
  dir = "ltr",
  onReviewWeak,
  onNextLesson,
}: LessonCompleteCardProps) {
  const accuracy = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 100;
  const isConsecutive = streak && streak > 1;
  const isCourseComplete = !nextLessonId;

  useEffect(() => {
    setTimeout(() => {
      // Celebration haptic: [100, 50, 100, 50, 200]
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    }, 400);
  }, []);

  return (
    <div
      dir={dir}
      className="relative w-full min-h-[60vh] rounded-2xl bg-white shadow-lg border border-border overflow-hidden flex flex-col items-center justify-center"
    >
      <ConfettiBurst />

      <div className="relative z-10 flex flex-col items-center gap-5 p-8 text-center w-full">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
          className="text-6xl"
        >
          {isCourseComplete ? "🎓" : "🏆"}
        </motion.div>

        <div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
            {isCourseComplete ? "Course Complete!" : "Lesson Complete"}
          </p>
          <p className="text-2xl font-bold text-foreground">
            {isCourseComplete ? "You did it! 🎉" : "Great work!"}
          </p>
        </div>

        {/* XP earned */}
        <div className="flex flex-col items-center gap-0.5">
          <XpCounter target={totalXp + 5} />
          <p className="text-sm text-muted-foreground">XP earned this lesson</p>
        </div>

        {/* Stats row */}
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-black text-foreground">{cardsCompleted}</p>
            <p className="text-xs text-muted-foreground">Cards</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: accuracy >= 80 ? "#2E7D32" : "#EF6C00" }}>
              {accuracy}%
            </p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          {streak !== undefined && (
            <>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-black text-foreground">
                  {isConsecutive ? "🔥" : "📅"} {streak}
                </p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </>
          )}
        </div>

        {/* Streak banner */}
        {isConsecutive && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: "#FFF3E0", color: "#E65100" }}
          >
            🔥 {streak}-day streak! Keep it up!
          </motion.div>
        )}

        {/* CTAs */}
        <div className="w-full space-y-3 mt-2">
          {hasWeakCards && (
            <button
              onClick={onReviewWeak}
              className="w-full py-3 rounded-xl border-2 text-sm font-semibold transition-transform active:scale-[0.98]"
              style={{ borderColor: "#EF6C00", color: "#EF6C00" }}
            >
              Review weak spots ↑
            </button>
          )}
          <button
            onClick={onNextLesson}
            className="w-full rounded-2xl text-white font-bold transition-transform active:scale-[0.98] flex items-center justify-center"
            style={{
              height: 56,
              fontSize: 18,
              fontWeight: 700,
              background: isCourseComplete
                ? "linear-gradient(135deg, #7B1FA2, #1565C0)"
                : "linear-gradient(135deg, #f59e0b, #ef4444)",
            }}
          >
            {isCourseComplete
              ? "Back to Dashboard →"
              : nextLessonTitle
              ? `Next: ${nextLessonTitle} →`
              : "Back to lessons →"}
          </button>
        </div>
      </div>
    </div>
  );
}
