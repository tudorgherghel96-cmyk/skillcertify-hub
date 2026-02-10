import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play, CheckCircle2, Brain } from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import KeyTermsBar from "@/components/lesson/KeyTermsBar";
import RememberThis from "@/components/lesson/RememberThis";
import TestTip from "@/components/lesson/TestTip";
import MiniCheck from "@/components/lesson/MiniCheck";
import KeyFactSummary from "@/components/lesson/KeyFactSummary";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MIN_TIME_SECONDS = 180;

const LessonPlayer = () => {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const lessonId = Number(lIdStr);
  const navigate = useNavigate();
  const { progress, completeLesson } = useProgress();
  const { language } = useLanguage();
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

  useEffect(() => {
    const id = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => clearInterval(id);
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
    }
  }, [hasScrolledToBottom, timeSpent, isCompleted, moduleId, lessonId, completeLesson]);

  const handleMarkComplete = () => completeLesson(moduleId, lessonId);

  const totalLessons = mod?.lessons.length ?? 0;
  const hasPrev = lessonId > 1;
  const hasNext = lessonId < totalLessons;
  const goNext = () => hasNext ? navigate(`/lesson/${moduleId}/${lessonId + 1}`) : navigate(`/module/${moduleId}`);
  const goPrev = () => hasPrev && navigate(`/lesson/${moduleId}/${lessonId - 1}`);

  if (!mod || !lesson) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link to="/dashboard" className="text-primary underline mt-2 inline-block text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  // Resolve title
  const lessonTitle = i18nContent ? t(i18nContent.title, lang) : lesson.title;
  const videoDesc = i18nContent?.videoPlaceholder ?? lesson.title;

  // Build key terms for bar (convert I18n terms to legacy format)
  const keyTermsForBar = i18nContent
    ? i18nContent.keyTerms.map((kt) => ({
        english: kt.en,
        translations: {
          ro: kt.ro ?? "", lt: kt.lt ?? "", bg: kt.bg ?? "",
          ar: kt.ar ?? "", ti: kt.ti ?? "", yo: kt.yo ?? "",
          ig: kt.ig ?? "", so: kt.so ?? "", am: kt.am ?? "",
        },
      }))
    : legacyContent?.keyTerms ?? [];

  // Render i18n content blocks
  const renderI18nBlock = (block: I18nContentBlock, i: number) => {
    switch (block.type) {
      case "paragraph":
        return <p key={i} className="text-[16px] sm:text-[17px] leading-relaxed text-foreground">{t(block.text, lang)}</p>;
      case "bold":
        return <p key={i} className="text-[16px] sm:text-[17px] font-bold text-foreground">{t(block.text, lang)}</p>;
      case "rememberThis":
        return <RememberThis key={i} text={t(block.text, lang)} />;
      case "testTip":
        return <TestTip key={i} text={t(block.text, lang)} />;
      case "image":
        return (
          <div key={i} className="aspect-video bg-muted rounded-xl flex items-center justify-center">
            <p className="text-sm text-muted-foreground px-4 text-center">{t(block.description, lang)}</p>
          </div>
        );
      case "miniCheck":
        return (
          <MiniCheck
            key={i}
            question={t(block.question, lang)}
            options={block.options.map((o) => t(o, lang))}
            correctIndex={block.correct}
            feedback={t(block.feedback, lang)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={contentRef} onScroll={handleScroll} className="max-w-2xl mx-auto h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="px-4 py-5 space-y-5">
        {/* Header */}
        <div>
          <Link to={`/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Module {moduleId}
          </Link>
          <h1 className="text-lg font-bold mt-1 text-foreground">
            Lesson {moduleId}.{lessonId}: {lessonTitle}
          </h1>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
        </div>

        {/* Closed-book reminder */}
        <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2">
          <Brain className="h-4 w-4 text-secondary shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Closed book test</span> — memorise everything. No notes allowed.
          </p>
        </div>

        {/* Video placeholder */}
        <AspectRatio ratio={16 / 9} className="bg-secondary rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
            </div>
            <p className="text-sm font-medium text-secondary-foreground/80 px-4 text-center">{videoDesc}</p>
          </div>
        </AspectRatio>

        {/* Key Terms Bar */}
        {keyTermsForBar.length > 0 && <KeyTermsBar terms={keyTermsForBar} />}

        {/* Lesson Content */}
        {i18nContent ? (
          <div className="space-y-5">
            {i18nContent.content.map(renderI18nBlock)}
            {i18nContent.keySummary.length > 0 && (
              <div className="pt-2">
                <KeyFactSummary facts={i18nContent.keySummary.map((s) => t(s, lang))} />
              </div>
            )}
          </div>
        ) : legacyContent ? (
          <div className="space-y-5">
            {legacyContent.content.map((block, i) => {
              switch (block.type) {
                case "paragraph":
                  return <p key={i} className="text-[16px] sm:text-[17px] leading-relaxed text-foreground">{block.text}</p>;
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
          <div className="border rounded-xl p-6 bg-card text-center">
            <p className="text-muted-foreground text-sm">Lesson content is being prepared. Check back soon.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-2 pb-4">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={!hasPrev}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-xs text-muted-foreground">{lessonId} / {totalLessons}</span>
          <Button size="sm" onClick={goNext}>
            {hasNext ? <>Next <ArrowRight className="ml-1 h-4 w-4" /></> : "Back to Module"}
          </Button>
        </div>
      </div>

      {/* Floating Mark Complete */}
      <AnimatePresence>
        {showMarkComplete && !isCompleted && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-20 sm:bottom-6 left-0 right-0 px-4 z-40 max-w-2xl mx-auto"
          >
            <Button onClick={handleMarkComplete} className="w-full h-12 text-base font-semibold shadow-lg">
              <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Lesson Complete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPlayer;
