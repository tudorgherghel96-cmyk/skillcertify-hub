import {
  useState, useEffect, useRef, useCallback,
} from "react";
import {
  motion, useMotionValue, useTransform, animate, AnimatePresence,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { supabase } from "@/integrations/supabase/client";
import { getLessonMediaUrl } from "@/lib/media";
import { useAuth } from "@/contexts/AuthContext";
import { useXpProgress } from "@/hooks/useXpProgress";

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
import LevelUpToast from "@/components/gamification/LevelUpToast";

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

// ─── Segmented Progress Bar ────────────────────────────────────────────────

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
          }}
        />
      ))}
    </div>
  );
}

// ─── Card Renderer ────────────────────────────────────────────────────────────
//
// content_json field names come directly from the SQL seed. Map exactly:
//   hero          → title, subtitle, duration
//   image         → caption
//   remember_this → text
//   test_tip      → text
//   key_term      → term, definition, term2, definition2, audio
//   quick_check   → question, options[], correct, feedback_correct, feedback_wrong{}
//   scenario      → scenario, options[], correct, feedback_correct, feedback_wrong{}
//   multi_select  → question, options[], correct[] (array of indices)
//   drag_drop     → items[], targets[]
//   tap_to_reveal → panels[{label,content}]
//   split_screen  → left, right
//   speed_drill   → questions[{image,answer}], time_per_question
//   pattern_card  → pairs[{hazard,disease}]
//   lesson_complete → next_lesson, next_title

function RenderCard({
  card,
  isActive,
  isSplitEntranceNext,
  onAdvance,
  onTimeUpdate,
  showEffect,
  onXp,
  onWrong,
  onRecordQuizAnswer,
  sessionXp,
  sessionCards,
  sessionCorrect,
  sessionTotal,
  streak,
  nextCard,
  dir,
  onNextLesson,
}: {
  card: LessonCard;
  isActive: boolean;
  isSplitEntranceNext: boolean;
  onAdvance: () => void;
  onTimeUpdate: (t: number, d: number) => void;
  showEffect: boolean;
  onXp: (xp: number) => void;
  onWrong: () => void;
  onRecordQuizAnswer?: (pos: number, selected: number, correct: boolean) => void;
  sessionXp: number;
  sessionCards: number;
  sessionCorrect: number;
  sessionTotal: number;
  streak?: number;
  nextCard?: LessonCard;
  dir: "ltr" | "rtl";
  onNextLesson: (nextId: string | null) => void;
}) {
  const c = card.content_json as Record<string, unknown>;
  const mediaUrl = getLessonMediaUrl(card.media_file, card.media_bucket);
  const type = card.card_type;

  // ── Video ──
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

  // ── B-roll ──
  if (type === "broll") {
    return (
      <BRollCard
        mediaUrl={mediaUrl}
        isActive={isActive}
        onEnded={onAdvance}
      />
    );
  }

  // ── Hero image ──
  if (type === "hero") {
    return (
      <HeroImageCard
        src={mediaUrl}
        lessonTitle={String(c.title ?? "")}
        moduleNumber={card.module_id}
        durationLabel={c.duration ? String(c.duration) : undefined}
      />
    );
  }

  // ── Image (old-content / supplementary) ──
  if (type === "image") {
    return (
      <ImageCard
        src={mediaUrl}
        alt={String(c.caption ?? "")}
        caption={c.caption ? String(c.caption) : undefined}
        isActive={isActive}
        onAutoAdvance={onAdvance}
      />
    );
  }

  // ── Remember This ──
  if (type === "remember_this") {
    return (
      <RememberThisCard
        content={String(c.text ?? "")}
        xpValue={card.xp_value || 5}
        dir={dir}
      />
    );
  }

  // ── Test Tip ──
  if (type === "test_tip") {
    return (
      <TestTipCard
        tipText={String(c.text ?? "")}
        trapWarnings={[]}
        xpValue={card.xp_value || 5}
        dir={dir}
      />
    );
  }

  // ── Key Term ──
  if (type === "key_term") {
    // Supports single term or dual-term (term + term2)
    const termDisplay = c.term2
      ? `${String(c.term ?? "")} / ${String(c.term2 ?? "")}`
      : String(c.term ?? "");
    const defDisplay = c.definition2
      ? `${String(c.definition ?? "")} | ${String(c.definition2 ?? "")}`
      : String(c.definition ?? "");
    return (
      <KeyTermCard
        term={termDisplay}
        definition={defDisplay}
        xpValue={card.xp_value || 3}
        dir={dir}
      />
    );
  }

  // ── Quick Check ──
  if (type === "quick_check") {
    const feedbackWrong = c.feedback_wrong as Record<string, string> | undefined;
    // Build per-option explanations from feedback_wrong object
    const options = Array.isArray(c.options) ? (c.options as string[]) : [];
    const explanation = feedbackWrong
      ? options
          .map((_, i) =>
            i !== Number(c.correct ?? 0) ? feedbackWrong[String(i)] ?? "" : "",
          )
          .find(Boolean) ?? (c.feedback_correct ? String(c.feedback_correct) : undefined)
      : c.feedback_correct
      ? String(c.feedback_correct)
      : undefined;

    return (
      <QuickCheckCard
        question={String(c.question ?? "")}
        options={options}
        correct={Number(c.correct ?? 0)}
        explanation={explanation}
        xpValue={card.xp_value || 10}
        dir={dir}
        onAnswered={(correct) => {
          onXp(card.xp_value || 10);
          if (!correct) onWrong();
          onRecordQuizAnswer?.(card.card_position, -1, correct);
        }}
      />
    );
  }

  // ── Scenario ──
  if (type === "scenario") {
    return (
      <ScenarioCard
        scenario={String(c.scenario ?? "")}
        options={Array.isArray(c.options) ? (c.options as string[]) : []}
        correct={Number(c.correct ?? 0)}
        explanation={c.feedback_correct ? String(c.feedback_correct) : undefined}
        xpValue={card.xp_value || 10}
        dir={dir}
        onAnswered={(correct) => {
          onXp(card.xp_value || 10);
          if (!correct) onWrong();
        }}
      />
    );
  }

  // ── Multi-select ──
  if (type === "multi_select") {
    const correctIndices = Array.isArray(c.correct)
      ? (c.correct as number[])
      : [];
    return (
      <MultiSelectCard
        question={String(c.question ?? "")}
        options={Array.isArray(c.options) ? (c.options as string[]) : []}
        correctIndices={correctIndices}
        xpPerCorrect={5}
        dir={dir}
        onAnswered={(score) => {
          onXp(score * 5);
          if (score === 0) onWrong();
        }}
      />
    );
  }

  // ── Drag & Drop ──
  // DB schema: items[] (strings), targets[] (strings) — parallel arrays
  if (type === "drag_drop") {
    const rawItems = Array.isArray(c.items) ? (c.items as string[]) : [];
    const rawTargets = Array.isArray(c.targets) ? (c.targets as string[]) : [];
    const items = rawItems.map((label, i) => ({ id: String(i), label }));
    const targets = rawTargets.map((label, i) => ({
      id: String(i),
      label,
      acceptsItemId: String(i),
    }));
    return (
      <DragDropCard
        items={items}
        targets={targets}
        xpValue={card.xp_value || 20}
        dir={dir}
        onComplete={(bonus) => onXp(bonus)}
      />
    );
  }

  // ── Tap to Reveal ──
  // DB schema: panels[{label, content}]
  if (type === "tap_to_reveal") {
    const rawPanels = Array.isArray(c.panels)
      ? (c.panels as { label: string; content: string }[])
      : [];
    const panels = rawPanels.map((p, i) => ({
      id: String(i),
      front: p.label,
      back: p.content,
    }));
    return (
      <TapToRevealCard
        panels={panels}
        layout="2x2"
        xpValue={card.xp_value || 12}
        dir={dir}
        onComplete={(xp) => onXp(xp)}
      />
    );
  }

  // ── Split Screen ──
  // DB schema: left, right (plain strings)
  if (type === "split_screen") {
    return (
      <SplitScreenCard
        wrongLabel="Without protection"
        correctLabel="With protection"
        wrongDescription={String(c.left ?? "")}
        correctDescription={String(c.right ?? "")}
        xpValue={card.xp_value || 5}
        dir={dir}
        splitEntrance={isSplitEntranceNext}
        onViewed={() => onXp(card.xp_value || 5)}
      />
    );
  }

  // ── Speed Drill ──
  // DB schema: questions[{image, answer}], time_per_question
  if (type === "speed_drill") {
    const rawQ = Array.isArray(c.questions)
      ? (c.questions as { image: string; answer: string }[])
      : [];
    // Convert to QuickCheck-style questions for SpeedDrillCard
    const questions = rawQ.map((q) => ({
      question: q.image,
      options: [q.answer, "Wrong A", "Wrong B", "Wrong C"],
      correct: 0,
    }));
    return (
      <SpeedDrillCard
        questions={questions}
        xpValue={card.xp_value || 20}
        dir={dir}
        onComplete={(score, total, xp) => {
          onXp(xp);
          if (score < total / 2) onWrong();
        }}
      />
    );
  }

  // ── Pattern Card ──
  // DB schema: pairs[{hazard, disease}]
  if (type === "pattern_card") {
    const rawPairs = Array.isArray(c.pairs)
      ? (c.pairs as { hazard: string; disease: string }[])
      : [];
    const pairs = rawPairs.map((p, i) => ({ id: String(i), ...p }));
    return (
      <PatternCard
        pairs={pairs}
        xpValue={card.xp_value || 10}
        dir={dir}
        onComplete={() => onXp(card.xp_value || 10)}
      />
    );
  }

  // ── Lesson Complete ──
  // DB schema: next_lesson (string | null), next_title (string)
  if (type === "lesson_complete") {
    return (
      <LessonCompleteCard
        totalXp={sessionXp}
        cardsCompleted={sessionCards}
        correctAnswers={sessionCorrect}
        totalQuestions={sessionTotal}
        streak={streak}
        nextLessonId={c.next_lesson ? String(c.next_lesson) : undefined}
        nextLessonTitle={c.next_title ? String(c.next_title) : undefined}
        dir={dir}
        onNextLesson={() =>
          onNextLesson(c.next_lesson ? String(c.next_lesson) : null)
        }
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
  initialCardIndex?: number;
  onLessonComplete?: (totalXp: number, nextLesson: string | null) => void;
  onNextLesson?: (nextId: string | null) => void;
  onExitRequest?: () => void;
}

export default function LessonSwipeView({
  lessonId,
  moduleId,
  streak,
  dir = "ltr",
  initialCardIndex,
  onLessonComplete,
  onNextLesson,
  onExitRequest,
}: LessonSwipeViewProps) {
  const { user } = useAuth();
  const { saveCardProgress, addXpToDb, onLessonCompleteStreak, recordQuizAnswer, resetQuizAnswers } =
    useXpProgress(user?.id);

  // ── Data ──
  const [cards, setCards] = useState<LessonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
  const [idx, setIdx] = useState(initialCardIndex ?? 0);
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
  const yOffset = useMotionValue(0);
  const peekPx = useMotionValue(0);

  const prevY = useTransform(yOffset, (v) => v - containerH.current);
  const currY = yOffset;
  const nextY = useTransform(
    [yOffset, peekPx] as [typeof yOffset, typeof peekPx],
    ([drag, peek]: number[]) => drag + containerH.current - peek,
  );
  const nextBlur = useTransform(peekPx, [0, containerH.current * 0.15], [2, 0]);
  const nextBlurFilter = useTransform(nextBlur, (b: number) => `blur(${b}px)`);
  const nextScale = useTransform(peekPx, [0, containerH.current * 0.15], [0.97, 1]);

  // ── Session XP & tracking ──
  const [sessionXp, setSessionXp] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [levelUpPending, setLevelUpPending] = useState<number | null>(null);

  const handleXp = useCallback(
    (xp: number) => {
      setSessionXp((p) => p + xp);
      // Fire-and-forget: update DB totals and check for level-up
      addXpToDb(xp).then(({ newLevel }) => {
        if (newLevel) setLevelUpPending(newLevel);
      });
    },
    [addXpToDb],
  );

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

    if (effect === "lean_in" && t >= 2 && !showEffect) setShowEffect(true);
    if (effect === "hold_up" && t >= 1.5 && !showEffect) setShowEffect(true);

    if (effect === "point_down" && d > 0) {
      const remaining = d - t;
      if (remaining <= 2 && remaining >= 0) {
        if (!pointDownFired.current) {
          pointDownFired.current = true;
          navigator.vibrate?.(30);
        }
        const targetPeek = containerH.current * 0.15;
        animate(peekPx, targetPeek, { duration: 0.6, ease: "easeOut" });
      }
    }
  }, [videoTime, currentCard, showEffect, peekPx]);

  // ── Navigation ──
  const go = useCallback(
    (direction: 1 | -1) => {
      if (isAnimating) return;
      const newIdx = idx + direction;
      if (newIdx < 0) {
        if (direction === -1 && idx === 0) {
          animate(yOffset, 0, { type: "spring", stiffness: 400, damping: 35 });
          onExitRequest?.();
          return;
        }
        animate(yOffset, 0, { type: "spring", stiffness: 400, damping: 35 });
        return;
      }
      if (newIdx >= cards.length) {
        animate(yOffset, 0, { type: "spring", stiffness: 400, damping: 35 });
        return;
      }

      setIsAnimating(true);

      const isSplitTransition =
        direction === 1 &&
        currentCard?.fourth_wall_effect === "split_screen_compare" &&
        nextCard?.card_type === "split_screen";

      const duration = isSplitTransition ? 0.4 : 0.6;
      const isCompleting = newIdx === cards.length - 1;

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
          // Persist progress to user_lesson_progress and legacy progress table
          const card = cards[newIdx];
          if (card) {
            saveCardProgress(lessonId, newIdx, cards.length, sessionXp, isCompleting);
            // Legacy progress table sync
            if (user) {
              supabase.from("progress").upsert(
                {
                  user_id: user.id,
                  lesson_id: lessonId,
                  module_id: moduleId ?? card.module_id,
                  completed: isCompleting,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id,lesson_id" },
              );
            }
          }
        },
      });

      // Fire lesson complete callback + streak when arriving at last card
      if (isCompleting) {
        const completeCard = cards[cards.length - 1];
        const nextLessonId =
          completeCard?.content_json?.next_lesson != null
            ? String(completeCard.content_json.next_lesson)
            : null;
        onLessonComplete?.(sessionXp, nextLessonId);
        // Update streak in DB
        onLessonCompleteStreak();
        resetQuizAnswers();
      }
    },
    [
      isAnimating, idx, cards, yOffset, peekPx,
      currentCard, nextCard, sessionXp,
      onLessonComplete, onExitRequest,
      saveCardProgress, onLessonCompleteStreak, resetQuizAnswers,
      lessonId, moduleId, user,
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

  // ── Gesture (swipe) ──
  const bind = useDrag(
    ({ active, movement: [mx, my], velocity: [vx, vy], last, cancel }) => {
      if (isAnimating) { cancel?.(); return; }

      // Right swipe (positive mx) from card 0 → exit
      if (active && mx > 60 && Math.abs(mx) > Math.abs(my) && idx === 0) {
        cancel?.();
        onExitRequest?.();
        return;
      }

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

  // ── Split entrance tracking ──
  const [splitEntranceActive, setSplitEntranceActive] = useState(false);
  useEffect(() => {
    const prev = cards[idx - 1];
    setSplitEntranceActive(
      !!prev &&
        prev.fourth_wall_effect === "split_screen_compare" &&
        currentCard?.card_type === "split_screen",
    );
  }, [idx, cards, currentCard]);

  // ── Loading ──
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
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm px-4 text-center">
        No cards found for lesson {lessonId}. Check the lesson_cards table.
      </div>
    );
  }

  const prevCard = cards[idx - 1] ?? null;
  const isPointDownActive = currentCard?.fourth_wall_effect === "point_down";

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden select-none">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-transparent">
        <ProgressBar total={cards.length} current={idx} onJump={jumpTo} />
      </div>

      {/* Swipeable card stack */}
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
                onNextLesson={() => {}}
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
                onRecordQuizAnswer={recordQuizAnswer}
                sessionXp={sessionXp}
                sessionCards={idx + 1}
                sessionCorrect={idx + 1 - wrongCount}
                sessionTotal={totalQuestions}
                streak={streak}
                nextCard={nextCard ?? undefined}
                dir={dir}
                onNextLesson={onNextLesson ?? (() => {})}
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
              filter: isPointDownActive ? nextBlurFilter : undefined,
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
                onNextLesson={() => {}}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Card counter pill */}
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

      {/* Level-up toast */}
      <LevelUpToast level={levelUpPending} onDone={() => setLevelUpPending(null)} />
    </div>
  );
}
