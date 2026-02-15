import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import {
  ArrowLeft, CheckCircle2, BookOpen, Bookmark, BookmarkCheck,
  Play, Pause, ArrowRight, RotateCcw, Trophy,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SlideRenderer from "./SlideRenderer";
import LessonGlossary from "./LessonGlossary";
import type { Slide } from "@/data/slidesSchema";
import { supabase } from "@/integrations/supabase/client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { triggerHaptic } from "@/lib/haptics";
import { useGamification } from "@/contexts/GamificationContext";

interface LessonFlowProps {
  slides: Slide[];
  moduleId: number;
  lessonId: number;
  lessonTitle: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onFinish: () => void;
  lang: string;
}

/* ─── helpers ─── */

const isInteractiveSlide = (slide: Slide) =>
  slide.type === "quiz" || slide.type === "keyterm";

export default function LessonFlow({
  slides,
  moduleId,
  lessonId,
  lessonTitle,
  isCompleted,
  onMarkComplete,
  onFinish,
}: LessonFlowProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [quizLocked, setQuizLocked] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [dragY, setDragY] = useState(0);

  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPlayProgress = useRef(0);
  const [autoPlayPercent, setAutoPlayPercent] = useState(0);
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const { addXp, refreshLessonStrength } = useGamification();

  const total = slides.length;
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const currentSlide = slides[index];

  const keyTerms = slides
    .filter((s): s is Extract<Slide, { type: "keyterm" }> => s.type === "keyterm")
    .map((s) => ({ term: s.term, explanation: s.explanation }));

  // XP per card swipe
  const xpAwarded = useRef<Set<number>>(new Set());

  useEffect(() => {
    setQuizLocked(currentSlide?.type === "quiz");
  }, [index, currentSlide?.type]);

  // Award +2 XP per card view
  useEffect(() => {
    if (!xpAwarded.current.has(index) && index > 0) {
      xpAwarded.current.add(index);
      addXp(2, "Card swiped");
    }
  }, [index, addXp]);

  // Safety: clear animation lock after 600ms to prevent stuck state
  useEffect(() => {
    if (!isAnimating.current) return;
    const safety = setTimeout(() => { isAnimating.current = false; }, 600);
    return () => clearTimeout(safety);
  });

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating.current) return;
      if (dir === 1 && quizLocked) return;
      const next = index + dir;
      if (next < 0) return;
      if (next >= total) {
        setShowEndScreen(true);
        return;
      }
      isAnimating.current = true;
      setDirection(dir);
      setIndex(next);
      triggerHaptic("tap");
    },
    [index, total, quizLocked]
  );

  // Jump to specific slide (story-bar tap)
  const jumpTo = useCallback(
    (target: number) => {
      if (isAnimating.current || target === index) return;
      // Can't jump forward past quiz-locked slides
      for (let i = index + 1; i <= target; i++) {
        if (slides[i]?.type === "quiz" && quizResults[i] === undefined) return;
      }
      setDirection(target > index ? 1 : -1);
      setIndex(target);
    },
    [index, slides, quizResults]
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay || isInteractiveSlide(currentSlide) || showEndScreen) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      setAutoPlayPercent(0);
      autoPlayProgress.current = 0;
      return;
    }

    autoPlayProgress.current = 0;
    setAutoPlayPercent(0);

    autoPlayTimer.current = setInterval(() => {
      autoPlayProgress.current += 2; // 2% every 100ms = 5s total
      setAutoPlayPercent(autoPlayProgress.current);
      if (autoPlayProgress.current >= 100) {
        go(1);
      }
    }, 100);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [autoPlay, index, currentSlide, go, showEndScreen]);

  const bind = useDrag(
    ({ active, last, swipe: [, sy], movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      if (active) {
        setDragY(my);
        return;
      }
      setDragY(0);
      if (!last) return;
      if (sy === -1) return go(1);
      if (sy === 1) return go(-1);
      if ((Math.abs(my) > 80 || vy > 0.3) && dy !== 0) {
        dy < 0 ? go(1) : go(-1);
      }
    },
    {
      axis: "y",
      filterTaps: true,
      threshold: 10,
      swipe: { distance: 80, velocity: 0.3 },
    }
  );

  const handleQuizAnswered = useCallback(
    async (correct: boolean, conceptSlug?: string, responseTimeMs?: number) => {
      setQuizLocked(false);
      setQuizResults((prev) => ({ ...prev, [index]: correct }));

      if (correct) {
        triggerHaptic("success");
        addXp(10, "Quick Check ✓");
      } else {
        triggerHaptic("error");
      }

      if (conceptSlug) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { data: concept } = await supabase
            .from("concepts")
            .select("id")
            .eq("slug", conceptSlug)
            .single();

          if (concept) {
            const nextReview = new Date();
            if (correct) nextReview.setDate(nextReview.getDate() + 1);
            else nextReview.setHours(nextReview.getHours() + 1);
            await supabase.from("concept_attempts").insert({
              user_id: user.id,
              concept_id: concept.id,
              is_correct: correct,
              response_time_ms: responseTimeMs ?? 0,
              next_review_at: nextReview.toISOString(),
            });
          }
        } catch {}
      }
    },
    [index, addXp]
  );

  const toggleBookmark = () => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      triggerHaptic("tap");
      return next;
    });
  };

  const handleMarkComplete = () => {
    onMarkComplete();
    addXp(50, "Lesson Complete!");
    refreshLessonStrength(moduleId, lessonId);
    triggerHaptic("success");
  };

  // Quiz stats for end screen
  const quizSlides = slides.map((s, i) => ({ slide: s, idx: i })).filter((x) => x.slide.type === "quiz");
  const correctCount = quizSlides.filter((x) => quizResults[x.idx] === true).length;
  const wrongCount = quizSlides.filter((x) => quizResults[x.idx] === false).length;
  const totalXpEarned = (correctCount * 10) + (total * 2) + (showEndScreen && !isCompleted ? 50 : 0);

  const progress = ((index + 1) / total) * 100;

  // ─── Slide transition variants with parallax ───
  const getSlideVariants = (slideType: string) => {
    if (reducedMotion) {
      return {
        enter: () => ({ opacity: 0 }),
        center: { opacity: 1 },
        exit: () => ({ opacity: 0 }),
      };
    }

    // Remember This slides come from bottom
    if (slideType === "remember") {
      return {
        enter: () => ({ y: 300, opacity: 0, scale: 0.9 }),
        center: { y: 0, opacity: 1, scale: 1 },
        exit: (dir: number) => ({ y: dir > 0 ? -100 : 300, opacity: 0, scale: 0.95 }),
      };
    }

    // Image slides with zoom
    if (slideType === "image") {
      return {
        enter: (dir: number) => ({ y: dir > 0 ? 100 : -100, opacity: 0, scale: 0.92, filter: "blur(4px)" }),
        center: { y: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
        exit: (dir: number) => ({ y: dir > 0 ? -100 : 100, opacity: 0, scale: 0.95, filter: "blur(2px)" }),
      };
    }

    // Default: parallax snap
    return {
      enter: (dir: number) => ({ y: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
      center: { y: 0, opacity: 1, scale: 1 },
      exit: (dir: number) => ({ y: dir > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
    };
  };

  const slideTransition = reducedMotion
    ? { duration: 0.15 }
    : {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      };

  // ─── End screen ───
  if (showEndScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="max-w-sm w-full text-center space-y-6"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: 2, duration: 0.5 }}
            >
              <Trophy className="h-16 w-16 text-primary mx-auto" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground font-[Poppins]">
                Lesson Complete!
              </h2>
              <p className="text-sm text-muted-foreground">
                You earned <span className="font-bold text-primary">{totalXpEarned} XP</span>
              </p>
            </div>

            {/* Quiz results */}
            {quizSlides.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Check Results</p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{correctCount}</p>
                    <p className="text-[10px] text-muted-foreground">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">{wrongCount}</p>
                    <p className="text-[10px] text-muted-foreground">Wrong</p>
                  </div>
                </div>

                {wrongCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      const firstWrong = quizSlides.find((x) => quizResults[x.idx] === false);
                      if (firstWrong) {
                        setShowEndScreen(false);
                        setIndex(firstWrong.idx);
                      }
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Review weak spots
                  </Button>
                )}
              </div>
            )}

            {/* Progress bar animation */}
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Topic {moduleId} progress updated</p>
            </div>

            <div className="space-y-2 pt-2">
              {!isCompleted ? (
                <Button onClick={handleMarkComplete} className="w-full h-12 gap-2 text-base font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Mark Complete
                </Button>
              ) : (
                <Button onClick={onFinish} className="w-full h-12 gap-2 text-base font-semibold">
                  Next Lesson <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" asChild className="w-full text-muted-foreground">
                <Link to={`/module/${moduleId}`}>Back to topic</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main lesson view ───
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden select-none"
      style={{ touchAction: "none" }}
    >
      {/* ─── Story-style progress bar ─── */}
      <div className="relative z-30 flex gap-[2px] px-2 pt-2 pb-0" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Card ${index + 1} of ${total}`}>
        {slides.map((slide, i) => {
          const isCompleted = i < index;
          const isCurrent = i === index;
          return (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className="flex-1 h-[3px] rounded-full overflow-hidden bg-muted/40 transition-colors"
              aria-label={`Go to card ${i + 1} of ${total}`}
            >
              <motion.div
                className={`h-full rounded-full ${
                  isCompleted
                    ? "bg-gradient-to-r from-primary to-blue-400"
                    : isCurrent
                    ? "bg-primary"
                    : ""
                }`}
                initial={false}
                animate={{
                  width: isCompleted ? "100%" : isCurrent ? `${autoPlay ? autoPlayPercent : 30}%` : "0%",
                  opacity: isCurrent ? [0.6, 1, 0.6] : 1,
                }}
                transition={
                  isCurrent && !autoPlay
                    ? { opacity: { repeat: Infinity, duration: 1.5 } }
                    : { duration: 0.3 }
                }
              />
            </button>
          );
        })}
      </div>

      {/* ─── Top bar ─── */}
      <div className="relative z-30 flex items-center gap-2 px-3 h-11 bg-background/80 backdrop-blur-xl">
        <Link
          to={`/module/${moduleId}`}
          className="p-1.5 -ml-1 rounded-full hover:bg-muted/60 transition-colors"
          aria-label="Back to topic"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <p className="flex-1 text-xs font-medium text-muted-foreground truncate">
          {lessonTitle}
        </p>
        <div className="flex items-center gap-1">
          {keyTerms.length > 0 && (
            <button
              onClick={() => setShowGlossary(true)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors"
              aria-label="Open glossary"
            >
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={toggleBookmark}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors"
            aria-label={bookmarked.has(index) ? "Remove bookmark" : "Bookmark this card"}
          >
            {bookmarked.has(index) ? (
              <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* ─── Slide area ─── */}
      <div
        {...bind()}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: "none", cursor: "grab" }}
        onClick={(e) => {
          // Tap-to-advance: tap bottom 60% = forward, top 25% = back
          // Ignore if target is a button/link/input
          const tag = (e.target as HTMLElement).tagName;
          if (["BUTTON", "A", "INPUT"].includes(tag)) return;
          if ((e.target as HTMLElement).closest("button, a, input")) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const pct = y / rect.height;
          if (pct > 0.4) go(1);
          else if (pct < 0.25) go(-1);
        }}
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
          onExitComplete={() => { isAnimating.current = false; }}
        >
          <motion.div
            key={index}
            custom={direction}
            variants={getSlideVariants(currentSlide?.type || "text")}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            onAnimationStart={() => { isAnimating.current = true; }}
            onAnimationComplete={() => { isAnimating.current = false; }}
            className="absolute inset-0"
            aria-roledescription="slide"
            aria-label={`Card ${index + 1} of ${total}`}
            style={{
              // Subtle drag feedback
              y: quizLocked && dragY < 0 ? 0 : undefined,
            }}
          >
            {/* Test Tip amber glow */}
            {currentSlide?.type === "tip" && (
              <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-amber-400/30 shadow-[inset_0_0_30px_rgba(245,158,11,0.08)]" />
            )}
            <SlideRenderer
              slide={currentSlide}
              isActive={true}
              onQuizAnswered={handleQuizAnswered}
            />
          </motion.div>
        </AnimatePresence>

        {/* Quiz lock overlay */}
        <AnimatePresence>
          {quizLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm"
              >
                <p className="text-[11px] font-medium text-primary">Answer to continue ↑</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bottom bar: auto-play toggle ─── */}
      {!isLast && (
        <div className="relative z-30 flex items-center justify-center py-2 bg-background/80 backdrop-blur-xl border-t border-border/20">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            {autoPlay ? (
              <Pause className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Play className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-[11px] font-medium text-muted-foreground">
              {autoPlay ? "Pause" : "Auto-play"}
            </span>
            {autoPlay && (
              <svg className="h-4 w-4 -rotate-90" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                <circle
                  cx="10" cy="10" r="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={50.26}
                  strokeDashoffset={50.26 * (1 - autoPlayPercent / 100)}
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ─── Last slide: Mark Complete ─── */}
      <AnimatePresence>
        {isLast && !showEndScreen && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-30 px-6 py-4 bg-background/80 backdrop-blur-xl border-t border-border/30"
          >
            <Button
              onClick={() => {
                if (!isCompleted) handleMarkComplete();
                setShowEndScreen(true);
              }}
              className="w-full h-12 gap-2 text-sm font-semibold rounded-xl active:scale-[0.97] transition-transform"
            >
              <CheckCircle2 className="h-4 w-4" /> {isCompleted ? "View Summary" : "Mark Complete"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Swipe/tap hint — first slide only ─── */}
      <AnimatePresence>
        {isFirst && !autoPlay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-20 left-0 right-0 flex justify-center z-20 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: 3, duration: 1.2, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: 3, duration: 1.2, ease: "easeInOut" }}
                  className="w-1 h-1.5 rounded-full bg-muted-foreground/50"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/50">Tap or swipe up</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Glossary ─── */}
      <AnimatePresence>
        {showGlossary && (
          <LessonGlossary terms={keyTerms} onClose={() => setShowGlossary(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
