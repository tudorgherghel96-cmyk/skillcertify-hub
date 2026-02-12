import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SlideRenderer from "./SlideRenderer";
import type { Slide } from "@/data/slidesSchema";
import { supabase } from "@/integrations/supabase/client";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const total = slides.length;
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const currentSlide = slides[index];

  // Check if current slide is an unanswered quiz
  useEffect(() => {
    setQuizLocked(currentSlide?.type === "quiz");
  }, [index, currentSlide?.type]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating.current) return;
      // Block forward swipe on locked quiz
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

  // @use-gesture/react drag handler with swipe config
  const bind = useDrag(
    ({ swipe: [, sy], movement: [, my], velocity: [, vy] }) => {
      if (sy === -1 || my < -80 || vy > 0.3) go(1);   // swiped up → next
      if (sy === 1 || my > 80 || vy > 0.3) go(-1);     // swiped down → prev
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

      // Track concept attempt with spaced recall scheduling
      if (conceptSlug) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Find concept by slug
          const { data: concept } = await supabase
            .from("concepts")
            .select("id")
            .eq("slug", conceptSlug)
            .single();

          if (concept) {
            const nextReview = new Date();
            if (correct) {
              nextReview.setDate(nextReview.getDate() + 1); // 1 day
            } else {
              nextReview.setHours(nextReview.getHours() + 1); // 1 hour
            }

            await supabase.from("concept_attempts").insert({
              user_id: user.id,
              concept_id: concept.id,
              is_correct: correct,
              response_time_ms: responseTimeMs ?? 0,
              next_review_at: nextReview.toISOString(),
            });
          }
        } catch (e) {
          // Silently fail — don't block UX
        }
      }
    },
    []
  );

  const progress = ((index + 1) / total) * 100;

  // Material-style ~300ms ease; reduced motion = instant opacity crossfade
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
        center: {
          y: 0,
          opacity: 1,
          scale: 1,
        },
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
      {/* Minimal top bar */}
      <div className="relative z-30 flex items-center gap-3 px-4 h-12 bg-background/60 backdrop-blur-xl">
        <Link
          to={`/module/${moduleId}`}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-muted/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <p className="flex-1 text-xs font-medium text-muted-foreground truncate">
          {lessonTitle}
        </p>
        <span className="text-[10px] text-muted-foreground/60 tabular-nums font-mono">
          {index + 1}/{total}
        </span>
      </div>

      {/* Progress bar — thin, clean */}
      <div className="h-[2px] bg-muted/30 relative z-30">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      {/* Slide area with drag */}
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

        {/* Quiz lock overlay hint */}
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
      </div>

      {/* Bottom — only shows on last slide */}
      <AnimatePresence>
        {isLast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-30 px-6 py-4 bg-background/60 backdrop-blur-xl"
          >
            {!isCompleted ? (
              <Button onClick={onMarkComplete} className="w-full h-12 gap-2 text-sm font-semibold rounded-xl">
                <CheckCircle2 className="h-4 w-4" /> Mark Complete
              </Button>
            ) : (
              <Button onClick={onFinish} variant="outline" className="w-full h-12 text-sm font-semibold rounded-xl">
                Continue →
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe hint — only first slide, fades out */}
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
    </div>
  );
}
