import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  CheckCircle,
  Lock,
  Brain,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Target,
  RotateCcw,
} from "lucide-react";
import { MODULES } from "@/data/courseData";
import DownloadTopicButton from "@/components/offline/DownloadTopicButton";
import {
  useProgress,
  getModuleProgress,
  isPracticeUnlocked,
  isGqaUnlocked,
  isModuleComplete,
  canResitGqa,
  hoursUntilResit,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { useDbLessonProgress } from "@/hooks/useDbLessonProgress";

const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.015, y: -2, transition: { duration: 0.25, ease: "easeOut" as const } },
};

const GlassCard = ({ children, className = "", hoverable = true, ...props }: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  [key: string]: any;
}) => (
  <motion.div
    variants={hoverable ? cardHover : undefined}
    initial="rest"
    whileHover={hoverable ? "hover" : undefined}
    className={`glass-card rounded-xl ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

/** Quiz status badge for each lesson row */
const QuizStatusBadge = ({ score, passed }: { score: number | null; passed: boolean | null }) => {
  if (score === null) return null;
  if (passed) {
    return (
      <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] ml-auto shrink-0">
        Quiz {score}% ✓
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[10px] ml-auto shrink-0">
      Quiz {score}%
    </Badge>
  );
};

const ModuleOverview = () => {
  const { id } = useParams();
  const moduleId = Number(id) || 1;
  const mod = MODULES.find((m) => m.id === moduleId);
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const { progressMap } = useDbLessonProgress();

  if (!mod) {
    return <div className="p-4 text-center text-muted-foreground">Topic not found</div>;
  }

  const mp = getModuleProgress(progress, moduleId);
  const practiceReady = isPracticeUnlocked(mp, mod.lessons.length, isSuperUser);
  const gqaReady = isGqaUnlocked(mp, isSuperUser);
  const complete = isModuleComplete(mp);
  const failed = mp.gqa.passed === false;
  const Icon = mod.icon;

  // DB-backed lesson completion
  const isLessonDone = (lessonNum: number) =>
    !!progressMap[`${moduleId}.${lessonNum}`]?.completed;

  // Quiz gating: previous lesson must have quiz passed at 60%+ (or be superuser)
  const isQuizGated = (lessonIndex: number) => {
    if (isSuperUser || lessonIndex === 0) return false;
    const prevLesson = mod.lessons[lessonIndex - 1];
    const prevProgress = progressMap[`${moduleId}.${prevLesson.id}`];
    if (!prevProgress) return true;
    if (!prevProgress.completed) return true;
    // If prev lesson has a quiz, require 60%+
    if (prevProgress.best_quiz_score !== null && (prevProgress.best_quiz_score ?? 0) < 60) return true;
    return false;
  };

  const lessonsComplete = mod.lessons.filter((l) => isLessonDone(l.id)).length;

  return (
    <>
      <div className="aura-bg" />

      <motion.div
        className="px-4 py-6 max-w-2xl mx-auto space-y-5 pb-24 relative"
        variants={staggerChildren}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <Link
            to="/learn"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Lessons
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              complete ? "bg-primary text-primary-foreground" : "bg-primary/10"
            }`}
          >
            <Icon className={`h-6 w-6 ${complete ? "" : "text-primary"}`} />
          </div>
          <div>
            <p className="text-xs text-primary font-medium">Topic {moduleId}</p>
            <h1 className="text-lg font-bold leading-tight">{mod.title}</h1>
          </div>
        </motion.div>

        {/* Test reminder */}
        <motion.div variants={fadeUp}>
          <GlassCard hoverable={false}>
            <div className="flex items-start gap-2 p-3">
              <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs leading-snug">
                <strong>Closed book</strong> — no notes or materials allowed during the topic test.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* 📥 DOWNLOAD FOR OFFLINE */}
        <motion.div variants={fadeUp}>
          <DownloadTopicButton moduleId={moduleId} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📖</span>
            <h2 className="font-semibold text-sm">
              Lessons — {lessonsComplete} of {mod.lessons.length} done
            </h2>
          </div>
          <div className="space-y-1.5">
            {mod.lessons.map((lesson, i) => {
              const done = isLessonDone(lesson.id);
              const prevDone = i === 0 || isLessonDone(mod.lessons[i - 1].id);
              const quizGated = isQuizGated(i);
              const isLocked = !isSuperUser && (!prevDone || quizGated) && !done;
              const lessonProgress = progressMap[`${moduleId}.${lesson.id}`];

              return (
                <Link
                  key={lesson.id}
                  to={isLocked ? "#" : `/lesson/${moduleId}/${lesson.id}`}
                  className={isLocked ? "pointer-events-none" : ""}
                >
                  <GlassCard
                    hoverable={!isLocked}
                    className={`transition-colors ${
                      done
                        ? "border-primary/20"
                        : isLocked
                        ? "opacity-40"
                        : "hover:border-primary/30"
                    }`}
                  >
                    <CardContent className="flex items-center gap-3 py-3">
                      {done ? (
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-primary shrink-0" />
                      )}
                      <span className="text-sm flex-1">
                        {moduleId}.{lesson.id} — {lesson.title}
                      </span>
                      {lessonProgress && (
                        <QuizStatusBadge
                          score={lessonProgress.best_quiz_score}
                          passed={lessonProgress.quiz_passed}
                        />
                      )}
                      {!isLocked && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </CardContent>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* 🎯 PRACTICE */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🎯</span>
            <h2 className="font-semibold text-sm">Practice</h2>
          </div>
          <GlassCard hoverable={practiceReady} className={!practiceReady ? "opacity-50" : ""}>
            <CardContent className="py-4 space-y-3">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Practice until you're ready</p>
                  <p className="text-xs text-muted-foreground">
                    {practiceReady
                      ? mp.practice.attempts > 0
                        ? `${mp.practice.attempts} attempt${mp.practice.attempts !== 1 ? "s" : ""} · Best: ${mp.practice.bestScore}%`
                        : "Unlimited retakes — no score minimum to start"
                      : "Finish all lessons to unlock"}
                  </p>
                </div>
                {mp.practice.bestScore >= 80 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                    80%+ ✓
                  </Badge>
                )}
              </div>
              {practiceReady && (
                <Button asChild variant="outline" className="w-full h-11">
                  <Link to={`/practice/${moduleId}`}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {mp.practice.attempts > 0 ? "Practice again" : "Start practice"}
                  </Link>
                </Button>
              )}
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* ✅ TOPIC TEST */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✅</span>
            <h2 className="font-semibold text-sm">Topic {moduleId} Test</h2>
          </div>
          <GlassCard
            hoverable={gqaReady && !complete}
            className={`${
              complete
                ? "border-primary/40"
                : failed
                ? "border-destructive/30"
                : !gqaReady
                ? "opacity-50"
                : ""
            }`}
          >
            <CardContent className="py-4 space-y-3">
              {complete ? (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-primary">Passed — {mp.gqa.score}%</p>
                    <p className="text-xs text-muted-foreground">Topic {moduleId} done</p>
                  </div>
                </div>
              ) : failed ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        Not passed — {mp.gqa.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You only need to retake this topic. 80% needed to pass.
                      </p>
                    </div>
                  </div>
                  {canResitGqa(mp, isSuperUser) ? (
                    <Button asChild className="w-full h-11">
                      <Link to={`/gqa-test/${moduleId}`}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Retake Topic {moduleId}
                      </Link>
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted">
                      <Clock className="h-4 w-4" />
                      <span>
                        Retake available in {hoursUntilResit(mp)} hours. Review your lessons.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {gqaReady ? (
                    <ExternalLink className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {gqaReady ? "Ready to take the test" : "Locked"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {gqaReady
                        ? "Closed book · 80% to pass · 90 minutes"
                        : "Score 80%+ in practice to unlock the test"}
                    </p>
                  </div>
                </div>
              )}
              {gqaReady && !complete && !failed && (
                <Button asChild className="w-full h-11">
                  <Link to={`/gqa-test/${moduleId}`}>
                    <ExternalLink className="mr-2 h-4 w-4" /> Start test
                  </Link>
                </Button>
              )}
            </CardContent>
          </GlassCard>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ModuleOverview;
