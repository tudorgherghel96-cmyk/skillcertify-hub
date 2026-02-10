import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play, CheckCircle2, Brain } from "lucide-react";
import { MODULES } from "@/data/courseData";
import { getLessonContent } from "@/data/lessonContent";
import { useProgress } from "@/contexts/ProgressContext";
import { getModuleProgress } from "@/contexts/ProgressContext";
import KeyTermsBar from "@/components/lesson/KeyTermsBar";
import RememberThis from "@/components/lesson/RememberThis";
import TestTip from "@/components/lesson/TestTip";
import MiniCheck from "@/components/lesson/MiniCheck";
import KeyFactSummary from "@/components/lesson/KeyFactSummary";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MIN_TIME_SECONDS = 180; // 3 minutes

const LessonPlayer = () => {
  const { moduleId: mIdStr, lessonId: lIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const lessonId = Number(lIdStr);
  const navigate = useNavigate();
  const { progress, completeLesson } = useProgress();
  const mp = getModuleProgress(progress, moduleId);

  const mod = MODULES.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  const content = getLessonContent(moduleId, lessonId);

  const isCompleted = mp.lessons[lessonId]?.completed ?? false;

  // Scroll and time tracking for auto-complete
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showMarkComplete, setShowMarkComplete] = useState(false);

  // Time tracker
  useEffect(() => {
    const id = setInterval(() => setTimeSpent((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll tracker
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) setHasScrolledToBottom(true);
  }, []);

  // Show mark complete when conditions met
  useEffect(() => {
    if (isCompleted) {
      setShowMarkComplete(false);
      return;
    }
    if (hasScrolledToBottom || timeSpent >= MIN_TIME_SECONDS) {
      setShowMarkComplete(true);
    }
  }, [hasScrolledToBottom, timeSpent, isCompleted]);

  // Auto-complete on both conditions met
  useEffect(() => {
    if (!isCompleted && hasScrolledToBottom && timeSpent >= MIN_TIME_SECONDS) {
      completeLesson(moduleId, lessonId);
    }
  }, [hasScrolledToBottom, timeSpent, isCompleted, moduleId, lessonId, completeLesson]);

  const handleMarkComplete = () => {
    completeLesson(moduleId, lessonId);
  };

  const totalLessons = mod?.lessons.length ?? 0;
  const hasPrev = lessonId > 1;
  const hasNext = lessonId < totalLessons;

  const goNext = () => {
    if (hasNext) navigate(`/lesson/${moduleId}/${lessonId + 1}`);
    else navigate(`/module/${moduleId}`);
  };
  const goPrev = () => {
    if (hasPrev) navigate(`/lesson/${moduleId}/${lessonId - 1}`);
  };

  if (!mod || !lesson) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link to="/dashboard" className="text-primary underline mt-2 inline-block text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      onScroll={handleScroll}
      className="max-w-2xl mx-auto h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <div className="px-4 py-5 space-y-5">
        {/* Header */}
        <div>
          <Link
            to={`/module/${moduleId}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Module {moduleId}
          </Link>
          <h1 className="text-lg font-bold mt-1 text-foreground">
            Lesson {moduleId}.{lessonId}: {lesson.title}
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
            <p className="text-sm font-medium text-secondary-foreground/80">
              {lesson.title}
            </p>
          </div>
        </AspectRatio>

        {/* Key Terms Bar */}
        {content && content.keyTerms.length > 0 && (
          <KeyTermsBar terms={content.keyTerms} />
        )}

        {/* Lesson Content */}
        {content ? (
          <div className="space-y-5">
            {content.content.map((block, i) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p key={i} className="text-[16px] sm:text-[17px] leading-relaxed text-foreground">
                      {block.text}
                    </p>
                  );
                case "remember":
                  return <RememberThis key={i} text={block.text} />;
                case "testTip":
                  return <TestTip key={i} text={block.text} />;
                case "miniCheck":
                  return (
                    <MiniCheck
                      key={i}
                      question={block.question}
                      options={block.options}
                      correctIndex={block.correctIndex}
                    />
                  );
                default:
                  return null;
              }
            })}

            {/* Key Facts Summary */}
            {content.keyFacts.length > 0 && (
              <div className="pt-2">
                <KeyFactSummary facts={content.keyFacts} />
              </div>
            )}
          </div>
        ) : (
          <div className="border rounded-xl p-6 bg-card text-center">
            <p className="text-muted-foreground text-sm">
              Lesson content is being prepared. Check back soon.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-2 pb-4">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={!hasPrev}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {lessonId} / {totalLessons}
          </span>
          <Button size="sm" onClick={goNext}>
            {hasNext ? (
              <>
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              "Back to Module"
            )}
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
            <Button
              onClick={handleMarkComplete}
              className="w-full h-12 text-base font-semibold shadow-lg"
            >
              <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Lesson Complete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPlayer;
