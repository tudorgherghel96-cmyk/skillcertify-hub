import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SlideRenderer from "./SlideRenderer";
import type { Slide } from "@/data/slidesSchema";

const variants = {
  enter: (dir: number) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

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
  lang,
}: LessonFlowProps) {
  const [[index, direction], setSlide] = useState([0, 0]);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isAnimating = useRef(false);

  const total = slides.length;
  const isLast = index === total - 1;
  const isFirst = index === 0;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating.current) return;
      const next = index + dir;
      if (next < 0 || next >= total) {
        if (dir === 1 && isLast) onFinish();
        return;
      }
      setSlide([next, dir]);
    },
    [index, total, isLast, onFinish]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
      // Only register vertical swipes (not horizontal)
      if (Math.abs(dy) > 60 && Math.abs(dy) > dx * 1.2) {
        if (dy > 0) go(1);  // swipe up → next
        else go(-1);         // swipe down → prev
      }
    },
    [go]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); go(-1); }
    },
    [go]
  );

  const progress = ((index + 1) / total) * 100;

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden outline-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Lesson slides"
    >
      {/* Top bar */}
      <div className="relative z-20 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
        <Link
          to={`/module/${moduleId}`}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-muted/60 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">
            Module {moduleId} · Lesson {lessonId}
          </p>
          <p className="text-sm font-semibold text-foreground truncate">{lessonTitle}</p>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{index + 1}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-muted relative z-20">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait"
          onExitComplete={() => { isAnimating.current = false; }}
        >
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onAnimationStart={() => { isAnimating.current = true; }}
            className="absolute inset-0"
          >
            <SlideRenderer slide={slides[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative z-20 px-4 py-3 bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Prev */}
          <button
            onClick={() => go(-1)}
            disabled={isFirst}
            className="p-2.5 rounded-xl bg-muted/60 hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <ChevronUp className="h-5 w-5 text-foreground" />
          </button>

          {/* Center action */}
          {isLast && !isCompleted ? (
            <Button onClick={onMarkComplete} className="h-10 px-6 gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Complete
            </Button>
          ) : isLast && isCompleted ? (
            <Button onClick={onFinish} variant="outline" className="h-10 px-6 text-sm font-semibold">
              Finish
            </Button>
          ) : (
            /* Progress dots */
            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === index
                      ? "w-5 h-1.5 bg-primary"
                      : i < index
                      ? "w-1.5 h-1.5 bg-primary/40"
                      : "w-1.5 h-1.5 bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Next */}
          <button
            onClick={() => go(1)}
            disabled={isLast}
            className="p-2.5 rounded-xl bg-muted/60 hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next slide"
          >
            <ChevronDown className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Swipe hint on first slide */}
        {isFirst && (
          <motion.p
            className="text-center text-[10px] text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Swipe up or tap ↓ to continue
          </motion.p>
        )}
      </div>
    </div>
  );
}
