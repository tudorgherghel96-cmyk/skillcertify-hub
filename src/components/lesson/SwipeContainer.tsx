import { useEffect, useRef, useCallback } from "react";
import type { LessonCard } from "@/pages/LessonPlayer";
import VideoSlide from "./VideoSlide";
import HeroSlide from "./HeroSlide";
import ImageSlide from "./ImageSlide";
import BRollSlide from "./BRollSlide";
import InteractiveSlide from "./InteractiveSlide";
import QuickCheck from "./cards/QuickCheck";
import DragDrop from "./cards/DragDrop";
import TapToReveal from "./cards/TapToReveal";
import SplitScreen from "./cards/SplitScreen";
import MultiSelect from "./cards/MultiSelect";
import SpeedDrill from "./cards/SpeedDrill";
import Scenario from "./cards/Scenario";
import PatternCard from "./cards/PatternCard";
import RememberThis from "./cards/RememberThis";
import TestTip from "./cards/TestTip";
import KeyTerm from "./cards/KeyTerm";
import LessonComplete from "./cards/LessonComplete";
import LessonQuiz from "./cards/LessonQuiz";

interface SwipeContainerProps {
  cards: LessonCard[];
  currentIndex: number;
  initialIndex: number;
  muted: boolean;
  onMuteToggle: () => void;
  lessonTitle: string;
  lessonId: string;
  streak: number;
  nextLessonTitle?: string;
  sessionXp: number;
  onIndexChange: (index: number) => void;
  onAnswer: (cardPosition: number, correct: boolean, selected: number) => void;
  onLessonComplete: (totalXp: number) => void;
  onNextLesson: () => void;
  onQuizComplete: (passed: boolean, score: number, total: number) => void;
}

function CardRenderer({
  card,
  isActive,
  muted,
  onMuteToggle,
  streak,
  nextLessonTitle,
  sessionXp,
  lessonId,
  isLastLesson,
  onAnswer,
  onLessonComplete,
  onNextLesson,
  onBRollEnd,
  onQuizComplete,
}: {
  card: LessonCard;
  isActive: boolean;
  muted: boolean;
  onMuteToggle: () => void;
  streak: number;
  nextLessonTitle?: string;
  sessionXp: number;
  lessonId: string;
  isLastLesson: boolean;
  onAnswer: (correct: boolean, selected: number) => void;
  onLessonComplete: (totalXp: number) => void;
  onNextLesson: () => void;
  onBRollEnd: () => void;
  onQuizComplete: (passed: boolean, score: number, total: number) => void;
}) {
  const content = card.content_json as Record<string, unknown>;

  switch (card.card_type) {
    case "hero":
      return (
        <HeroSlide
          src={card.mediaUrl || ""}
          lessonTitle={(content.lesson_title as string) || ""}
          moduleNumber={card.module_id}
          durationLabel={content.duration_label as string | undefined}
          isActive={isActive}
        />
      );

    case "video":
      return (
        <VideoSlide
          mediaUrl={card.mediaUrl || ""}
          isActive={isActive}
          muted={muted}
          onMuteToggle={onMuteToggle}
          fourthWallEffect={card.fourth_wall_effect}
          overlayText={card.effect_overlay_text}
        />
      );

    case "broll":
      return (
        <BRollSlide
          mediaUrl={card.mediaUrl || ""}
          isActive={isActive}
          muted={muted}
          onEnded={onBRollEnd}
        />
      );

    case "image":
      return (
        <ImageSlide
          src={card.mediaUrl || ""}
          alt={(content.alt as string) || ""}
          caption={content.caption as string | undefined}
          isActive={isActive}
        />
      );

    case "quick_check": {
      const rawOpts = (content.options as string[] | { text: string }[] | undefined) || [];
      const normOpts = rawOpts.map((o) => (typeof o === "string" ? { text: o } : o));
      const correctIdx = (content.correct_index as number) ?? (content.correct as number) ?? 0;
      const rawFbWrong = content.feedback_wrong;
      const normFbWrong: string[] = Array.isArray(rawFbWrong)
        ? (rawFbWrong as string[])
        : Object.values((rawFbWrong as Record<string, string>) || {});
      return (
        <InteractiveSlide>
          <QuickCheck
            question={(content.question as string) || ""}
            options={normOpts}
            correct_index={correctIdx}
            feedback_correct={(content.feedback_correct as string) || "Correct!"}
            feedback_wrong={normFbWrong}
            xp_value={card.xp_value}
            onAnswer={(correct, sel) => onAnswer(correct, sel)}
          />
        </InteractiveSlide>
      );
    }

    case "scenario": {
      const rawSOpts = (content.options as string[] | { text: string }[] | undefined) || [];
      const normSOpts = rawSOpts.map((o) => (typeof o === "string" ? { text: o } : o));
      const correctSIdx = (content.correct_index as number) ?? (content.correct as number) ?? 0;
      const rawSFbWrong = content.feedback_wrong;
      const normSFbWrong: string[] = Array.isArray(rawSFbWrong)
        ? (rawSFbWrong as string[])
        : Object.values((rawSFbWrong as Record<string, string>) || {});
      return (
        <InteractiveSlide>
          <Scenario
            scenario={(content.scenario as string) || ""}
            question={(content.question as string) || ""}
            options={normSOpts}
            correct_index={correctSIdx}
            feedback_correct={(content.feedback_correct as string) || "Correct!"}
            feedback_wrong={normSFbWrong}
            xp_value={card.xp_value}
            onAnswer={(correct, sel) => onAnswer(correct, sel)}
          />
        </InteractiveSlide>
      );
    }

    case "drag_drop":
      return (
        <InteractiveSlide>
          <DragDrop
            items={(content.items as { id: string; text: string }[]) || []}
            targets={(content.targets as { id: string; text: string }[]) || []}
            correct_pairs={(content.correct_pairs as Record<string, string>) || {}}
            xp_value={card.xp_value}
          />
        </InteractiveSlide>
      );

    case "tap_to_reveal":
      return (
        <InteractiveSlide>
          <TapToReveal
            panels={(content.panels as { front: string; back: string }[]) || []}
            xp_value={card.xp_value}
          />
        </InteractiveSlide>
      );

    case "split_screen":
      return (
        <InteractiveSlide>
          <SplitScreen
            left_text={content.left_text as string}
            right_text={content.right_text as string}
            left_label={content.left_label as string | undefined}
            right_label={content.right_label as string | undefined}
          />
        </InteractiveSlide>
      );

    case "multi_select":
      return (
        <InteractiveSlide>
          <MultiSelect
            question={content.question as string}
            options={(content.options as { text: string }[]) || []}
            correct_indices={(content.correct_indices as number[]) || []}
            xp_value={card.xp_value}
          />
        </InteractiveSlide>
      );

    case "speed_drill":
      return (
        <InteractiveSlide>
          <SpeedDrill
            questions={(content.questions as { question: string; options: string[]; correct_index: number }[]) || []}
            xp_value={card.xp_value}
          />
        </InteractiveSlide>
      );

    case "pattern_card":
      return (
        <InteractiveSlide>
          <PatternCard
            hazards={(content.hazards as { id: string; text: string }[]) || []}
            diseases={(content.diseases as { id: string; text: string }[]) || []}
            correct_pairs={(content.correct_pairs as Record<string, string>) || {}}
            xp_value={card.xp_value}
          />
        </InteractiveSlide>
      );

    case "remember_this":
      return (
        <InteractiveSlide>
          <RememberThis content={(content.text as string) || (content.content as string) || ""} />
        </InteractiveSlide>
      );

    case "test_tip":
      return (
        <InteractiveSlide>
          <TestTip content={(content.text as string) || (content.content as string) || ""} />
        </InteractiveSlide>
      );

    case "key_term":
      return (
        <InteractiveSlide>
          <KeyTerm
            term={content.term as string}
            definition={content.definition as string}
            term2={content.term2 as string | undefined}
            definition2={content.definition2 as string | undefined}
          />
        </InteractiveSlide>
      );

    case "quiz_card": {
      const quizContent = content as {
        title?: string;
        subtitle?: string;
        pass_threshold?: number;
        questions?: { id: string; question: string; options: { id: string; text: string }[]; correct: string; explanation: string; test_tip?: string; ac_reference?: string }[];
      };
      return (
        <LessonQuiz
          title={quizContent.title || "Lesson Quiz"}
          subtitle={quizContent.subtitle}
          pass_threshold={quizContent.pass_threshold ?? 0.6}
          questions={quizContent.questions || []}
          lessonId={lessonId}
          onQuizComplete={onQuizComplete}
        />
      );
    }

    case "lesson_complete":
      return (
        <LessonComplete
          totalXp={sessionXp}
          streak={streak}
          nextLessonTitle={(content.next_title as string) || nextLessonTitle}
          onNext={onNextLesson}
          isLastLesson={!content.next_lesson}
        />
      );

    default:
      return null;
  }
}

export default function SwipeContainer({
  cards,
  currentIndex,
  initialIndex,
  muted,
  onMuteToggle,
  lessonTitle,
  lessonId,
  streak,
  nextLessonTitle,
  sessionXp,
  onIndexChange,
  onAnswer,
  onLessonComplete,
  onNextLesson,
  onQuizComplete,
}: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const didScrollRef = useRef(false);

  // Reset scroll flag when cards change (new lesson loaded)
  useEffect(() => {
    didScrollRef.current = false;
  }, [cards]);

  // Set up IntersectionObserver for active card detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(idx)) onIndexChange(idx);
          }
        });
      },
      { root: container, threshold: 0.5 },
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [cards.length, onIndexChange]);

  // Scroll to initial position once on mount
  useEffect(() => {
    if (didScrollRef.current || !containerRef.current) return;
    if (initialIndex > 0) {
      containerRef.current.scrollTo({ top: initialIndex * containerRef.current.clientHeight, behavior: "instant" as ScrollBehavior });
    }
    didScrollRef.current = true;
  }, [initialIndex]);

  const handleBRollEnd = useCallback(
    (cardIndex: number) => {
      const next = cardIndex + 1;
      if (next < cards.length && containerRef.current) {
        containerRef.current.scrollTo({ top: next * containerRef.current.clientHeight, behavior: "smooth" });
      }
    },
    [cards.length],
  );

  // Determine last lesson (lesson_complete card present = last)
  const isLastLesson = !cards.find(
    (c) => c.card_type === "lesson_complete" && (c.content_json as Record<string, unknown>).next_lesson,
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
        background: "#000",
        position: "relative",
      } as React.CSSProperties}
    >
      {cards.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => { slideRefs.current[i] = el; }}
          data-index={i}
          style={{
            height: "100%",
            width: "100%",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            overflow: "hidden",
            position: "relative",
            background: "#000",
            flexShrink: 0,
          } as React.CSSProperties}
        >
          <CardRenderer
            card={card}
            isActive={i === currentIndex}
            muted={muted}
            onMuteToggle={onMuteToggle}
            streak={streak}
            nextLessonTitle={nextLessonTitle}
            sessionXp={sessionXp}
            lessonId={lessonId}
            isLastLesson={isLastLesson}
            onAnswer={(correct, sel) => onAnswer(card.card_position, correct, sel)}
            onLessonComplete={onLessonComplete}
            onNextLesson={onNextLesson}
            onBRollEnd={() => handleBRollEnd(i)}
            onQuizComplete={onQuizComplete}
          />
        </div>
      ))}
    </div>
  );
}
