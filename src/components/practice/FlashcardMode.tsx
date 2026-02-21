import { useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import type { Flashcard } from "@/data/quizQuestions";

interface FlashcardModeProps {
  cards: Flashcard[];
}

const FlashcardMode = ({ cards }: FlashcardModeProps) => {
  const [deck, setDeck] = useState<Flashcard[]>(() => [...cards]);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const current = deck[0];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const rightOpacity = useTransform(x, [0, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipe = info.offset.x;
    if (Math.abs(swipe) < 80) return;

    if (swipe > 0) {
      // Know it
      setDirection("right");
      setMastered((prev) => new Set(prev).add(current.id));
    } else {
      // Need review
      setDirection("left");
    }

    setTimeout(() => {
      setFlipped(false);
      setDirection(null);
      setDeck((prev) => {
        const [first, ...rest] = prev;
        if (swipe > 0) {
          // mastered — move to end with lower priority
          return [...rest, first];
        } else {
          // needs review — put back sooner (position 3 or end if small deck)
          const insertAt = Math.min(3, rest.length);
          return [...rest.slice(0, insertAt), first, ...rest.slice(insertAt)];
        }
      });
    }, 200);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No flashcards available for this module yet. Complete more lessons to generate flashcards.
        </p>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Mastered: {mastered.size} / {cards.length}
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5" /> Swipe left = review
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Swipe right = know it
          </span>
        </div>
      </div>

      {/* Mastery bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{
            width: `${(mastered.size / cards.length) * 100}%`,
          }}
        />
      </div>

      {/* Card */}
      <div className="relative h-[320px] sm:h-[280px]">
        <AnimatePresence>
          <motion.div
            key={current.id + "-" + deck.length}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            style={{ x, rotate }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            whileTap={{ scale: 0.98 }}
          >
            {/* Swipe indicators */}
            <motion.div
              style={{ opacity: rightOpacity }}
              className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold z-10"
            >
              ✓ Know it
            </motion.div>
            <motion.div
              style={{ opacity: leftOpacity }}
              className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold z-10"
            >
              Review
            </motion.div>

             <div
              onClick={(e) => { e.stopPropagation(); setFlipped((f) => !f); }}
              className={`h-full w-full rounded-2xl border-2 p-6 flex flex-col items-center justify-center text-center transition-colors ${
                flipped
                  ? "bg-card border-primary/30"
                  : "bg-secondary border-secondary"
              }`}
            >
              <AnimatePresence mode="wait">
                {!flipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        current.type === "remember"
                          ? "text-destructive"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {current.type === "remember"
                        ? "Remember This"
                        : "Test Tip"}
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                      {current.front}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tap to reveal answer
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <RotateCcw className="h-4 w-4 text-primary mx-auto" />
                    <p className="text-[15px] sm:text-base text-foreground leading-relaxed font-medium">
                      {current.back}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Swipe right if you know it, left to review again
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual buttons for non-touch users */}
      <div className="flex gap-3">
         <button
          onClick={(e) => {
            e.stopPropagation();
            setFlipped(false);
            setDeck((prev) => {
              const [first, ...rest] = prev;
              const insertAt = Math.min(3, rest.length);
              return [...rest.slice(0, insertAt), first, ...rest.slice(insertAt)];
            });
          }}
          className="flex-1 h-12 rounded-xl border-2 border-destructive/30 text-destructive font-semibold text-sm hover:bg-destructive/5 transition-colors"
        >
          <XCircle className="inline h-4 w-4 mr-1.5 -mt-0.5" />
          Need to review
        </button>
         <button
          onClick={(e) => {
            e.stopPropagation();
            setFlipped(false);
            setMastered((prev) => new Set(prev).add(current.id));
            setDeck((prev) => {
              const [first, ...rest] = prev;
              return [...rest, first];
            });
          }}
          className="flex-1 h-12 rounded-xl border-2 border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
        >
          <CheckCircle2 className="inline h-4 w-4 mr-1.5 -mt-0.5" />
          I know this
        </button>
      </div>
    </div>
  );
};

export default FlashcardMode;
