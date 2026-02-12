import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Brain } from "lucide-react";
import { MODULES } from "@/data/courseData";
import { getLessonContent } from "@/data/lessonContent";
import { getModule1Lesson, t } from "@/data/module1Content";
import { getModule2Lesson } from "@/data/module2Content";
import { getModule3Lesson } from "@/data/module3Content";
import { getModule4Lesson } from "@/data/module4Content";
import { getModule5Lesson } from "@/data/module5Content";
import type { I18nLessonContent, I18nContentBlock } from "@/data/module1Content";
import { useProgress } from "@/contexts/ProgressContext";
import { getModuleProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import KeyTermsPanel from "@/components/lesson/KeyTermsPanel";
import type { KeyTermEntry } from "@/components/lesson/KeyTermsPanel";
import { ui } from "@/i18n/translations";
import RememberThis from "@/components/lesson/RememberThis";
import TestTip from "@/components/lesson/TestTip";
import MiniCheck from "@/components/lesson/MiniCheck";
import KeyFactSummary from "@/components/lesson/KeyFactSummary";
import { LessonHeroMedia, getDistributedImages, MediaImage } from "@/components/lesson/LessonMedia";
import { useTelemetry } from "@/hooks/useTelemetry";

const MIN_TIME_SECONDS = 180;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const LessonPlayer = () => {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const lessonId = Number(lIdStr);
  const navigate = useNavigate();
  const { progress, completeLesson } = useProgress();
  const { addStudyMinutes, recordStudySession } = useGamification();
  const { language } = useLanguage();
  const { trackLessonComplete } = useTelemetry();
  const lang = language.code;
  const mp = getModuleProgress(progress, moduleId);

  const mod = MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);

  // Try multilingual content first, fall back to legacy
  const i18nContent: I18nLessonContent | undefined =
    moduleId === 1 ? getModule1Lesson(lessonId) :
    moduleId === 2 ? getModule2Lesson(lessonId) :
    moduleId === 3 ? getModule3Lesson(lessonId) :
    moduleId === 4 ? getModule4Lesson(lessonId) :
    moduleId === 5 ? getModule5Lesson(lessonId) : undefined;
  const legacyContent = !i18nContent ? getLessonContent(moduleId, lessonId) : undefined;

  const isCompleted = mp.lessons[lessonId]?.completed ?? false;

  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showMarkComplete, setShowMarkComplete] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [moduleId, lessonId]);

  useEffect(() => {
    recordStudySession();
    const id = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => {
      clearInterval(id);
      addStudyMinutes(timeSpent / 60);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) setHasScrolledToBottom(true);
  }, []);

  useEffect(() => {
    if (isCompleted) { setShowMarkComplete(false); return; }
    if (hasScrolledToBottom || timeSpent >= MIN_TIME_SECONDS) setShowMarkComplete(true);
  }, [hasScrolledToBottom, timeSpent, isCompleted]);

  useEffect(() => {
    if (!isCompleted && hasScrolledToBottom && timeSpent >= MIN_TIME_SECONDS) {
      completeLesson(moduleId, lessonId);
      trackLessonComplete(moduleId, lessonId);
    }
  }, [hasScrolledToBottom, timeSpent, isCompleted, moduleId, lessonId, completeLesson, trackLessonComplete]);

  const handleMarkComplete = () => {
    completeLesson(moduleId, lessonId);
    trackLessonComplete(moduleId, lessonId);
  };

  const totalLessons = mod?.lessons.length ?? 0;
  const hasPrev = lessonId > 1;
  const hasNext = lessonId < totalLessons;
  const goNext = () => {
    if (hasNext) navigate(`/lesson/${moduleId}/${lessonId + 1}`);
    else navigate(`/module/${moduleId}`);
    contentRef.current?.scrollTo(0, 0);
  };
  const goPrev = () => {
    if (hasPrev) navigate(`/lesson/${moduleId}/${lessonId - 1}`);
    contentRef.current?.scrollTo(0, 0);
  };

  // Swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && hasNext) goNext();
      if (dx > 0 && hasPrev) goPrev();
    }
    if (dy < -120 && isCompleted && hasNext) {
      const el = contentRef.current;
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
        goNext();
      }
    }
  }, [hasNext, hasPrev, isCompleted, goNext, goPrev]);

  if (!mod || !lesson) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link to="/dashboard" className="text-primary underline mt-2 inline-block text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const lessonTitle = i18nContent ? t(i18nContent.title, lang) : lesson.title;
  const videoDesc = i18nContent?.videoPlaceholder ?? lesson.title;

  const keyTermsForPanel: KeyTermEntry[] = i18nContent
    ? i18nContent.keyTerms.map((kt) => ({
        english: kt.en,
        translations: {
          ro: kt.ro ?? "", lt: kt.lt ?? "", bg: kt.bg ?? "",
          ar: kt.ar ?? "", ti: kt.ti ?? "", yo: kt.yo ?? "",
          ig: kt.ig ?? "", so: kt.so ?? "", am: kt.am ?? "",
        },
      }))
    : (legacyContent?.keyTerms ?? []).map((kt) => ({
        english: kt.english,
        translations: kt.translations,
      }));

  const distributedImages = getDistributedImages(moduleId, lessonId);

  const renderI18nBlock = (block: I18nContentBlock, i: number) => {
    const imageIndex = Math.floor(i / 3);
    const showImage = i > 0 && i % 3 === 2 && imageIndex < distributedImages.length;
    const img = showImage ? distributedImages[imageIndex] : null;

    const blockEl = (() => {
      switch (block.type) {
        case "paragraph":
          return <p key={`b-${i}`} className="text-[18px] sm:text-[19px] leading-relaxed text-foreground">{t(block.text, lang)}</p>;
        case "bold":
          return <p key={`b-${i}`} className="text-[18px] sm:text-[19px] font-bold text-foreground">{t(block.text, lang)}</p>;
        case "rememberThis":
          return <RememberThis key={`b-${i}`} text={t(block.text, lang)} />;
        case "testTip":
          return <TestTip key={`b-${i}`} text={t(block.text, lang)} />;
        case "image":
          return (
            <div key={`b-${i}`} className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              <p className="text-sm text-muted-foreground px-4 text-center">{t(block.description, lang)}</p>
            </div>
          );
        case "miniCheck":
          return (
            <MiniCheck
              key={`b-${i}`}
              question={t(block.question, lang)}
              options={block.options.map((o) => t(o, lang))}
              correctIndex={block.correct}
              feedback={t(block.feedback, lang)}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <motion.div key={`wrap-${i}`} variants={fadeUp}>
        {blockEl}
        {img && <MediaImage src={img.src} alt={img.alt} />}
      </motion.div>
    );
  };

  return (
    <>
      <div className="aura-bg" />

      <div
        ref={contentRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="max-w-2xl mx-auto h-[calc(100vh-8rem)] overflow-y-auto relative"
      >
        <motion.div
          className="px-3 sm:px-4 py-5 space-y-5"
          variants={staggerChildren}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <Link to={`/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> {ui("module", lang)} {moduleId}
            </Link>
            <h1 className="text-lg font-bold mt-1 text-foreground">
              {ui("lesson", lang)} {moduleId}.{lessonId}: {lessonTitle}
            </h1>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> {ui("completed", lang)}
              </span>
            )}
          </motion.div>

          {/* Closed-book reminder */}
          <motion.div variants={fadeUp}>
            <div className="glass-card rounded-xl flex items-center gap-2 px-3 py-2">
              <Brain className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{ui("closed_book_title", lang)}</span> — {ui("memorise_everything", lang)}
              </p>
            </div>
          </motion.div>

          {/* Hero Media */}
          <motion.div variants={fadeUp}>
            <LessonHeroMedia moduleId={moduleId} lessonId={lessonId} videoDesc={videoDesc} />
          </motion.div>

          {/* Key Terms Bar */}
          {keyTermsForPanel.length > 0 && (
            <motion.div variants={fadeUp}>
              <KeyTermsPanel terms={keyTermsForPanel} />
            </motion.div>
          )}

          {/* Lesson Content */}
          {i18nContent ? (
            <motion.div className="space-y-5" variants={staggerChildren} initial="hidden" animate="show">
              {i18nContent.content.map(renderI18nBlock)}
              {i18nContent.keySummary.length > 0 && (
                <motion.div variants={fadeUp} className="pt-2">
                  <KeyFactSummary facts={i18nContent.keySummary.map((s) => t(s, lang))} />
                </motion.div>
              )}
            </motion.div>
          ) : legacyContent ? (
            <div className="space-y-5">
              {legacyContent.content.map((block, i) => {
                switch (block.type) {
                  case "paragraph":
                    return <p key={i} className="text-[18px] sm:text-[19px] leading-relaxed text-foreground">{block.text}</p>;
                  case "remember":
                    return <RememberThis key={i} text={block.text} />;
                  case "testTip":
                    return <TestTip key={i} text={block.text} />;
                  case "miniCheck":
                    return <MiniCheck key={i} question={block.question} options={block.options} correctIndex={block.correctIndex} />;
                  default:
                    return null;
                }
              })}
              {legacyContent.keyFacts.length > 0 && (
                <div className="pt-2"><KeyFactSummary facts={legacyContent.keyFacts} /></div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-muted-foreground text-sm">Lesson content is being prepared. Check back soon.</p>
            </div>
          )}

          {/* Navigation */}
          <motion.div variants={fadeUp} className="flex justify-between items-center pt-2 pb-28">
            <Button variant="outline" size="sm" onClick={goPrev} disabled={!hasPrev} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> {ui("previous", lang)}
            </Button>
            <span className="text-xs text-muted-foreground">{lessonId} / {totalLessons}</span>
            <Button size="sm" onClick={goNext} className="gap-1">
              {hasNext ? <>{ui("next", lang)} <ArrowRight className="h-4 w-4" /></> : ui("back_to_module", lang)}
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Mark Complete — above bottom nav */}
        <AnimatePresence>
          {showMarkComplete && !isCompleted && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-24 left-0 right-0 px-4 z-40 max-w-2xl mx-auto"
            >
              <Button onClick={handleMarkComplete} className="w-full h-12 text-base font-semibold shadow-lg gap-2">
                <CheckCircle2 className="h-5 w-5" /> {ui("mark_complete", lang)}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LessonPlayer;
