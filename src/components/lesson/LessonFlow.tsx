import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, CheckCircle2, BookOpen, Volume2, Bookmark, BookmarkCheck, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SlideRenderer from "./SlideRenderer";
import LessonGlossary from "./LessonGlossary";
import type { Slide } from "@/data/slidesSchema";
import { supabase } from "@/integrations/supabase/client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { triggerHaptic } from "@/lib/haptics";

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
  const [showXpToast, setShowXpToast] = useState(false);
  const [xpMessage, setXpMessage] = useState("");
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const total = slides.length;
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const currentSlide = slides[index];

  // Extract key terms from slides for glossary
  const keyTerms = slides
    .filter((s): s is Extract<Slide, { type: "keyterm" }> => s.type === "keyterm")
    .map((s) => ({ term: s.term, explanation: s.explanation }));

  // Check if current slide is an unanswered quiz
  useEffect(() => {
    setQuizLocked(currentSlide?.type === "quiz");
  }, [index, currentSlide?.type]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating.current) return;
      if (dir === 1 && quizLocked) return;
      const next = index + dir;
      if (next < 0 || next >= total) {
        if (dir === 1 && isLast) onFinish();
        return;
      }
      setDirection(dir);
      setIndex(next);
    },
    [index, total, isLast, onFinish, quizLocked]
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

  const bind = useDrag(
    ({ last, swipe: [, sy], movement: [, my], velocity: [, vy], direction: [, dy] }) => {
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

      // Show XP toast
      if (correct) {
        triggerHaptic("success");
        setXpMessage("+10 XP · Nice one!");
        setShowXpToast(true);
        setTimeout(() => setShowXpToast(false), 2000);
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
            if (correct) {
              nextReview.setDate(nextReview.getDate() + 1);
            } else {
              nextReview.setHours(nextReview.getHours() + 1);
            }
            await supabase.from("concept_attempts").insert({
              user_id: user.id,
              concept_id: concept.id,
              is_correct: correct,
              response_time_ms: responseTimeMs ?? 0,
              next_review_at: nextReview.toISOString(),
            });
          }
        } catch {
          // Silently fail
        }
      }
    },
    []
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
    triggerHaptic("success");
    setXpMessage("+50 XP · Lesson Complete! 🎉");
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 3000);
  };

  const progress = ((index + 1) / total) * 100;

  const slideVariants = reducedMotion
    ? {
        enter: () => ({ opacity: 0 }),
        center: { opacity: 1 },
        exit: () => ({ opacity: 0 }),
      }
    : {
        enter: (dir: number) => ({
          y: dir > 0 ? 80 : -80,
          opacity: 0,
          scale: 0.98,
        }),
        center: { y: 0, opacity: 1, scale: 1 },
        exit: (dir: number) => ({
          y: dir > 0 ? -80 : 80,
          opacity: 0,
          scale: 0.98,
        }),
      };

  const slideTransition = reducedMotion
    ? { duration: 0.15 }
    : { duration: 0.32, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden select-none"
      style={{ touchAction: "none" }}
    >
      {/* Top bar */}
      <div className="relative z-30 flex items-center gap-2 px-3 h-12 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <Link
          to={`/module/${moduleId}`}
          className="p-1.5 -ml-1 rounded-full hover:bg-muted/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <p className="flex-1 text-xs font-medium text-muted-foreground truncate">
          {lessonTitle}
        </p>
        <div className="flex items-center gap-1">
          {/* Glossary button */}
          {keyTerms.length > 0 && (
            <button
              onClick={() => setShowGlossary(true)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors"
              aria-label="Quick Glossary"
            >
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/60 transition-colors"
            aria-label="Bookmark"
          >
            {bookmarked.has(index) ? (
              <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          {/* Slide counter */}
          <span className="text-[10px] text-muted-foreground/60 tabular-nums font-mono ml-1">
            {index + 1}/{total}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-muted/30 relative z-30">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      {/* Slide area */}
      <div
        {...bind()}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: "none", cursor: "grab" }}
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
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            onAnimationStart={() => { isAnimating.current = true; }}
            onAnimationComplete={() => { isAnimating.current = false; }}
            className="absolute inset-0"
          >
            <SlideRenderer
              slide={currentSlide}
              isActive={true}
              onQuizAnswered={handleQuizAnswered}
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav hints - bottom area */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 z-20 pointer-events-none">
          {!isFirst && !quizLocked && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="pointer-events-auto h-8 w-8 rounded-full bg-muted/60 backdrop-blur flex items-center justify-center"
              onClick={() => go(-1)}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground rotate-180" />
            </motion.button>
          )}
          {!isLast && !quizLocked && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="pointer-events-auto h-8 w-8 rounded-full bg-muted/60 backdrop-blur flex items-center justify-center"
              onClick={() => go(1)}
            >
              <ChevronUp className="h-4 w-4 text-muted-foreground rotate-180" />
            </motion.button>
          )}
        </div>

        {/* Quiz lock overlay */}
        <AnimatePresence>
          {quizLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none"
            >
              <div className="px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm">
                <p className="text-[11px] font-medium text-primary">Answer to continue</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XP Toast */}
        <AnimatePresence>
          {showXpToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-4 left-0 right-0 flex justify-center z-30 pointer-events-none"
            >
              <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
                {xpMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom — last slide */}
      <AnimatePresence>
        {isLast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-30 px-6 py-4 bg-background/80 backdrop-blur-xl border-t border-border/30"
          >
            {!isCompleted ? (
              <Button
                onClick={handleMarkComplete}
                className="w-full h-12 gap-2 text-sm font-semibold rounded-xl active:scale-[0.97] transition-transform"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark Complete
              </Button>
            ) : (
              <Button
                onClick={onFinish}
                variant="outline"
                className="w-full h-12 text-sm font-semibold rounded-xl active:scale-[0.97] transition-transform"
              >
                Continue →
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe hint — first slide only */}
      <AnimatePresence>
        {isFirst && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none"
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
              <p className="text-[10px] text-muted-foreground/50">Swipe up</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Glossary Panel */}
      <AnimatePresence>
        {showGlossary && (
          <LessonGlossary terms={keyTerms} onClose={() => setShowGlossary(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
