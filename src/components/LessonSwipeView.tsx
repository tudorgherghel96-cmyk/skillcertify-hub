import {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";
import {
  motion, useMotionValue, useTransform, animate, AnimatePresence,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { supabase } from "@/integrations/supabase/client";

import VideoCard from "@/components/cards/VideoCard";
import HeroImageCard from "@/components/cards/HeroImageCard";
import BRollCard from "@/components/cards/BRollCard";
import ImageCard from "@/components/cards/ImageCard";
import QuickCheckCard from "@/components/cards/QuickCheckCard";
import RememberThisCard from "@/components/cards/RememberThisCard";
import TestTipCard from "@/components/cards/TestTipCard";
import KeyTermCard from "@/components/cards/KeyTermCard";
import DragDropCard from "@/components/cards/DragDropCard";
import TapToRevealCard from "@/components/cards/TapToRevealCard";
import SplitScreenCard from "@/components/cards/SplitScreenCard";
import ScenarioCard from "@/components/cards/ScenarioCard";
import MultiSelectCard from "@/components/cards/MultiSelectCard";
import SpeedDrillCard from "@/components/cards/SpeedDrillCard";
import PatternCard from "@/components/cards/PatternCard";
import LessonCompleteCard from "@/components/cards/LessonCompleteCard";

// ─── Types ──────────────────────────────────────────────────────────────────

type FourthWallEffect =
  | "point_down"
  | "lean_in"
  | "hold_up"
  | "split_screen_compare"
  | null;

export interface LessonCard {
  id: string;
  lesson_id: string;
  module_id: number;
  card_position: number;
  card_type: string;
  media_file: string | null;
  media_bucket: string | null;
  content_json: Record<string, unknown>;
  fourth_wall_effect: FourthWallEffect;
  effect_overlay_text: string | null;
  xp_value: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMediaUrl(file: string | null, bucket: string | null): string {
  if (!file || !bucket) return "";
  const { data } = supabase.storage.from(bucket).getPublicUrl(file);
  return data.publicUrl;
}

/** Cards that auto-advance — parent fires onAdvance */
const AUTO_ADVANCE_TYPES = new Set(["video", "broll", "image"]);
/** Cards that never auto-advance (user must complete/swipe) */
const INTERACTIVE_TYPES = new Set([
  "quick_check", "drag_drop", "multi_select", "speed_drill",
  "lesson_complete",
]);

// ─── Segmented Progress Bar ───────────────────────────────────────────────────

function ProgressBar({
  total,
  current,
  onJump,
}: {
  total: number;
  current: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex gap-[3px] w-full px-3 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          aria-label={`Go to card ${i + 1}`}
          className="h-[3px] flex-1 rounded-full transition-all duration-300"
          style={{
            background:
              i < current
                ? "#22c55e"
                : i === current
                ? "#3b82f6"
                : "rgba(255,255,255,0.3)",
            opacity: i === current ? 1 : 0.85,
          }}
        />
      ))}
    </div>
  );
}

// ─── Card Renderer ────────────────────────────────────────────────────────────

function RenderCard({
  card,
  isActive,
  isSplitEntranceNext,
  onAdvance,
  onTimeUpdate,
  showEffect,
  onXp,
  onWrong,
  sessionXp,
  sessionCards,
  sessionCorrect,
  sessionTotal,
  streak,
  nextCard,
  dir,
}: {
  card: LessonCard;
  isActive: boolean;
  isSplitEntranceNext: boolean;
  onAdvance: () => void;
  onTimeUpdate: (t: number, d: number) => void;
  showEffect: boolean;
  onXp: (xp: number) => void;
  onWrong: () => void;
  sessionXp: number;
  sessionCards: number;
  sessionCorrect: number;
  sessionTotal: number;
  streak?: number;
  nextCard?: LessonCard;
  dir: "ltr" | "rtl";
}) {
  const c = card.content_json as Record<string, unknown>;
  const mediaUrl = getMediaUrl(card.media_file, card.media_bucket);
  const type = card.card_type;

  if (type === "video" || type === "broll") {
    const CardComp = type === "video" ? VideoCard : BRollCard;
    if (type === "video") {
      return (
        <VideoCard
          mediaUrl={mediaUrl}
          isActive={isActive}
          onEnded={onAdvance}
          onTimeUpdate={onTimeUpdate}
          showEffect={showEffect}
          effectOverlayText={card.effect_overlay_text ?? undefined}
          fourthWallEffect={card.fourth_wall_effect}
        />
      );
    }
    return (
      <BRollCard
        mediaUrl={mediaUrl}
        isActive={isActive}
        onEnded={onAdvance}
      />
    );
  }

  if (type === "hero") {
    return (
      <HeroImageCard
        src={mediaUrl}
        lessonTitle={String(c.title ?? "")}
        moduleNumber={card.module_id}
        durationLabel={c.durationLabel ? String(c.durationLabel) : undefined}
      />
    );
  }

  if (type === "image") {
    return (
      <ImageCard
        src={mediaUrl}
        alt={String(c.alt ?? "")}
        caption={c.caption ? String(c.caption) : undefined}
        isActive={isActive}
        onAutoAdvance={onAdvance}
      />
    );
  }

  if (type === "remember_this") {
    return (
      <RememberThisCard
        content={String(c.content ?? "")}
        xpValue={card.xp_value || 5}
        dir={dir}
      />
    );
  }

  if (type === "test_tip") {
    return (
      <TestTipCard
        tipText={String(c.tipText ?? "")}
        trapWarnings={Array.isArray(c.trapWarnings) ? (c.trapWarnings as string[]) : []}
        xpValue={card.xp_value || 5}
        dir={dir}
      />
    );
  }

  if (type === "key_term") {
    return (
      <KeyTermCard
        term={String(c.term ?? "")}
        definition={String(c.definition ?? "")}
        translation={c.translation ? String(c.translation) : undefined}
        translationLanguage={c.translationLanguage ? String(c.translationLanguage) : undefined}
        xpValue={card.xp_value || 3}
        dir={dir}
      />
    );
  }

  if (type === "quick_check") {
    return (
      <QuickCheckCard
        question={String(c.question ?? "")}
        options={Array.isArray(c.options) ? (c.options as string[]) : []}
        correct={Number(c.correct ?? 0)}
        explanation={c.explanation ? String(c.explanation) : undefined}
        xpValue={card.xp_value || 10}
        dir={dir}
        onAnswered={(correct) => {
          onXp(card.xp_value || 10);
          if (!correct) onWrong();
        }}
      />
    );
  }

  if (type === "scenario") {
    return (
      <ScenarioCard
        scenario={String(c.scenario ?? "")}
        options={Array.isArray(c.options) ? (c.options as string[]) : []}
        correct={Number(c.correct ?? 0)}
        explanation={c.explanation ? String(c.explanation) : undefined}
        xpValue={card.xp_value || 10}
        dir={dir}
        onAnswered={(correct) => {
          onXp(card.xp_value || 10);
          if (!correct) onWrong();
        }}
      />
    );
  }

  if (type === "multi_select") {
    return (
      <MultiSelectCard
        question={String(c.question ?? "")}
        options={Array.isArray(c.options) ? (c.options as string[]) : []}
        correctIndices={Array.isArray(c.correctIndices) ? (c.correctIndices as number[]) : []}
        xpPerCorrect={5}
        dir={dir}
        onAnswered={(score) => {
          onXp(score * 5);
          if (score === 0) onWrong();
        }}
      />
    );
  }

  if (type === "drag_drop") {
    return (
      <DragDropCard
        items={Array.isArray(c.items) ? (c.items as { id: string; label: string }[]) : []}
        targets={Array.isArray(c.targets) ? (c.targets as { id: string; label: string; acceptsItemId: string }[]) : []}
        xpValue={card.xp_value || 5}
        dir={dir}
        onComplete={(bonus) => onXp(bonus)}
      />
    );
  }

  if (type === "tap_to_reveal") {
    return (
      <TapToRevealCard
        panels={Array.isArray(c.panels) ? (c.panels as { id: string; front: string; back: string }[]) : []}
        layout={(c.layout as "2x2" | "1x4") ?? "2x2"}
        xpValue={card.xp_value || 3}
        dir={dir}
        onComplete={(xp) => onXp(xp)}
      />
    );
  }

  if (type === "split_screen") {
    return (
      <SplitScreenCard
        wrongLabel={String(c.wrongLabel ?? "Wrong")}
        correctLabel={String(c.correctLabel ?? "Correct")}
        wrongDescription={String(c.wrongDescription ?? "")}
        correctDescription={String(c.correctDescription ?? "")}
        xpValue={card.xp_value || 5}
        dir={dir}
        splitEntrance={isSplitEntranceNext}
        onViewed={() => onXp(card.xp_value || 5)}
      />
    );
  }

  if (type === "speed_drill") {
    return (
      <SpeedDrillCard
        questions={Array.isArray(c.questions) ? (c.questions as { question: string; options: string[]; correct: number }[]) : []}
        xpValue={card.xp_value || 20}
        dir={dir}
        onComplete={(score, total, xp) => {
          onXp(xp);
          if (score < total / 2) onWrong();
        }}
      />
    );
  }

  if (type === "pattern_card") {
    return (
      <PatternCard
        pairs={Array.isArray(c.pairs) ? (c.pairs as { id: string; hazard: string; disease: string }[]) : []}
        xpValue={card.xp_value || 10}
        dir={dir}
        onComplete={() => onXp(card.xp_value || 10)}
      />
    );
  }

  if (type === "lesson_complete") {
    return (
      <LessonCompleteCard
        totalXp={sessionXp}
        cardsCompleted={sessionCards}
        correctAnswers={sessionCorrect}
        totalQuestions={sessionTotal}
        streak={streak}
        nextLessonId={c.nextLessonId ? String(c.nextLessonId) : undefined}
        nextLessonTitle={c.nextLessonTitle ? String(c.nextLessonTitle) : undefined}
        dir={dir}
      />
    );
  }

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface LessonSwipeViewProps {
  lessonId: string;
  moduleId?: number;
  streak?: number;
  dir?: "ltr" | "rtl";
  onLessonComplete?: (totalXp: number) => void;
}

export default function LessonSwipeView({
  lessonId,
  moduleId,
  streak,
  dir = "ltr",
  onLessonComplete,
}: LessonSwipeViewProps) {
  // ── Data ──
  const [cards, setCards] = useState<LessonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("lesson_cards")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("card_position")
      .then(({ data }) => {
        if (data) setCards(data as LessonCard[]);
        setLoading(false);
      });
  }, [lessonId]);

  // ── Navigation state ──
  const [idx, setIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerH = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current)
        containerH.current = containerRef.current.getBoundingClientRect().height;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Motion values ──
  const yOffset = useMotionValue(0);      // live drag offset in px
  const peekPx = useMotionValue(0);       // how far the next card peeks up (for point_down)

  // Derived y positions for the three visible slots
  const prevY = useTransform(yOffset, (v) => v - containerH.current);
  const currY = yOffset;
  // Next card: base = containerH; subtract peekPx for point_down effect
  const nextY = useTransform(
    [yOffset, peekPx] as [typeof yOffset, typeof peekPx],
    ([drag, peek]: number[]) => drag + containerH.current - peek,
  );
  // Next card blur: 2px → 0 as peek grows
  const nextBlur = useTransform(peekPx, [0, containerH.current * 0.15], [2, 0]);
  const nextScale = useTransform(peekPx, [0, containerH.current * 0.15], [0.97, 1]);

  // ── Session XP & tracking ──
  const [sessionXp, setSessionXp] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const handleXp = useCallback((xp: number) => setSessionXp((p) => p + xp), []);
  const handleWrong = useCallback(() => {
    setWrongCount((p) => p + 1);
    setTotalQuestions((p) => p + 1);
  }, []);

  // ── Video timing (for effects) ──
  const [videoTime, setVideoTime] = useState<{ t: number; d: number } | null>(null);
  const [showEffect, setShowEffect] = useState(false);
  const pointDownFired = useRef(false);

  const handleTimeUpdate = useCallback((t: number, d: number) => {
    setVideoTime({ t, d });
  }, []);

  // Reset on card change
  useEffect(() => {
    setVideoTime(null);
    setShowEffect(false);
    pointDownFired.current = false;
    animate(peekPx, 0, { duration: 0.2 });
  }, [idx, peekPx]);

  const currentCard = cards[idx] ?? null;
  const nextCard = cards[idx + 1] ?? null;

  // ── Effect timing ──
  useEffect(() => {
    if (!currentCard || !videoTime) return;
    const { t, d } = videoTime;
    const effect = currentCard.fourth_wall_effect;

    // Lean-in at 2s
    if (effect === "lean_in" && t >= 2 && !showEffect) setShowEffect(true);
    // Hold-up at 1.5s
    if (effect === "hold_up" && t >= 1.5 && !showEffect) setShowEffect(true);

    // Point-down: last 2 seconds → peek next card
    if (effect === "point_down" && d > 0) {
      const remaining = d - t;
      if (remaining <= 2 && remaining >= 0) {
        if (!pointDownFired.current) {
          pointDownFired.current = true;
          navigator.vibrate?.(30);
        }
        // Animate peek: 0 → 15% of container height
        const targetPeek = containerH.current * 0.15;
        animate(peekPx, targetPeek, { duration: 0.6, ease: "easeOut" });
      }
    }

    // Split-screen compare: no special timing needed (handled on advance)
  }, [videoTime, currentCard, showEffect, peekPx]);

  // ── Navigation ──
  const go = useCallback(
    (direction: 1 | -1) => {
      if (isAnimating) return;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= cards.length) {
        animate(yOffset, 0, { type: "spring", stiffness: 400, damping: 35 });
        return;
      }

      setIsAnimating(true);

      // Check if next card is a split_screen after split_screen_compare video
      const isSplitTransition =
        direction === 1 &&
        currentCard?.fourth_wall_effect === "split_screen_compare" &&
        nextCard?.card_type === "split_screen";

      const duration = isSplitTransition ? 0.4 : 0.6;

      animate(yOffset, -direction * containerH.current, {
        type: "spring",
        stiffness: isSplitTransition ? 380 : 280,
        damping: isSplitTransition ? 32 : 28,
        duration,
        onComplete: () => {
          setIdx(newIdx);
          yOffset.set(0);
          peekPx.set(0);
          setIsAnimating(false);
        },
      });

      if (newIdx === cards.length - 1) {
        onLessonComplete?.(sessionXp);
      }
    },
    [
      isAnimating, idx, cards.length, yOffset, peekPx,
      currentCard, nextCard, sessionXp, onLessonComplete,
    ],
  );

  const jumpTo = useCallback(
    (i: number) => {
      if (isAnimating || i === idx) return;
      setIdx(i);
      yOffset.set(0);
      peekPx.set(0);
    },
    [isAnimating, idx, yOffset, peekPx],
  );

  // ── Auto-advance for non-interactive cards ──
  // (Video/BRoll auto-advance via onEnded → go(1), Image via onAutoAdvance)
  // Text cards show swipe hint but never auto-advance

  // ── Gesture ──
  const bind = useDrag(
    ({ active, movement: [, my], velocity: [, vy], last, cancel }) => {
      if (isAnimating) { cancel?.(); return; }
      // Ignore if target is a button/input
      if (active) yOffset.set(my);

      if (last) {
        const h = containerH.current || 600;
        const threshold = h * 0.3;
        if (Math.abs(my) > threshold || Math.abs(vy) > 0.5) {
          go(my < 0 ? 1 : -1);
        } else {
          animate(yOffset, 0, { type: "spring", stiffness: 400, damping: 35 });
        }
      }
    },
    { axis: "y", filterTaps: true, pointer: { touch: true } },
  );

  // ── Track whether next card should get split entrance ──
  const [splitEntranceActive, setSplitEntranceActive] = useState(false);
  useEffect(() => {
    const prev = cards[idx - 1];
    setSplitEntranceActive(
      !!prev &&
        prev.fourth_wall_effect === "split_screen_compare" &&
        currentCard?.card_type === "split_screen",
    );
  }, [idx, cards, currentCard]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No cards found for lesson {lessonId}.
      </div>
    );
  }

  const prevCard = cards[idx - 1] ?? null;

  // ── Determine point-down margin on next card ──
  const isPointDownActive = currentCard?.fourth_wall_effect === "point_down";

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden select-none">
      {/* ── Progress bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-transparent">
        <ProgressBar total={cards.length} current={idx} onJump={jumpTo} />
      </div>

      {/* ── Swipeable card stack ── */}
      <div
        ref={containerRef}
        {...bind()}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {/* Previous card */}
        {prevCard && (
          <motion.div
            style={{ y: prevY }}
            className="absolute inset-0 flex items-start justify-center pt-8 px-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg py-4">
              <RenderCard
                card={prevCard}
                isActive={false}
                isSplitEntranceNext={false}
                onAdvance={() => {}}
                onTimeUpdate={() => {}}
                showEffect={false}
                onXp={() => {}}
                onWrong={() => {}}
                sessionXp={0}
                sessionCards={0}
                sessionCorrect={0}
                sessionTotal={0}
                dir={dir}
              />
            </div>
          </motion.div>
        )}

        {/* Current card */}
        <motion.div
          style={{ y: currY }}
          className="absolute inset-0 flex items-start justify-center pt-8 px-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg py-4">
            {currentCard && (
              <RenderCard
                card={currentCard}
                isActive={true}
                isSplitEntranceNext={splitEntranceActive}
                onAdvance={() => go(1)}
                onTimeUpdate={handleTimeUpdate}
                showEffect={showEffect}
                onXp={handleXp}
                onWrong={handleWrong}
                sessionXp={sessionXp}
                sessionCards={idx + 1}
                sessionCorrect={idx + 1 - wrongCount}
                sessionTotal={totalQuestions}
                streak={streak}
                nextCard={nextCard ?? undefined}
                dir={dir}
              />
            )}
          </div>
        </motion.div>

        {/* Next card — with point_down peek transform */}
        {nextCard && (
          <motion.div
            style={{
              y: nextY,
              scale: isPointDownActive ? nextScale : 1,
              filter: isPointDownActive
                ? useTransform(nextBlur, (b) => `blur(${b}px)`)
                : undefined,
              marginTop: isPointDownActive ? -8 : 0,
            }}
            className="absolute inset-0 flex items-start justify-center pt-8 px-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg py-4">
              <RenderCard
                card={nextCard}
                isActive={false}
                isSplitEntranceNext={
                  currentCard?.fourth_wall_effect === "split_screen_compare" &&
                  nextCard.card_type === "split_screen"
                }
                onAdvance={() => {}}
                onTimeUpdate={() => {}}
                showEffect={false}
                onXp={() => {}}
                onWrong={() => {}}
                sessionXp={0}
                sessionCards={0}
                sessionCorrect={0}
                sessionTotal={0}
                dir={dir}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Card counter pill ── */}
      <AnimatePresence>
        {idx < cards.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 right-4 z-30 bg-black/40 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none"
          >
            {idx + 1} / {cards.length}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
