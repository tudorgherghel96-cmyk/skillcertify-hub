import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  useProgress,
  getModuleProgress,
  getLessonsCompleted,
  isPracticeUnlocked,
  isGqaUnlocked,
  isModuleComplete,
  canResitGqa,
  hoursUntilResit,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";

const ModuleOverview = () => {
  const { id } = useParams();
  const moduleId = Number(id) || 1;
  const mod = MODULES.find((m) => m.id === moduleId);
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();

  if (!mod) {
    return <div className="p-4 text-center text-muted-foreground">Module not found</div>;
  }

  const mp = getModuleProgress(progress, moduleId);
  const lessonsComplete = getLessonsCompleted(mp, mod.lessons.length);
  const practiceReady = isPracticeUnlocked(mp, mod.lessons.length, isSuperUser);
  const gqaReady = isGqaUnlocked(mp, isSuperUser);
  const complete = isModuleComplete(mp);
  const failed = mp.gqa.passed === false;
  const Icon = mod.icon;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            complete ? "bg-primary text-primary-foreground" : "bg-primary/10"
          }`}
        >
          <Icon className={`h-6 w-6 ${complete ? "" : "text-primary"}`} />
        </div>
        <div>
          <p className="text-xs text-primary font-medium">Module {moduleId}</p>
          <h1 className="text-lg font-bold leading-tight">{mod.title}</h1>
        </div>
      </div>

      {/* Closed-book reminder */}
      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs leading-snug">
          <span className="font-semibold">Memorise everything.</span> The GQA test is closed-book — no notes.
        </p>
      </div>

      {/* 📖 LESSONS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📖</span>
          <h2 className="font-semibold text-sm">
            Lessons — {lessonsComplete}/{mod.lessons.length} complete
          </h2>
        </div>
        <div className="space-y-1.5">
          {mod.lessons.map((lesson, i) => {
            const done = mp.lessons[lesson.id]?.completed;
            // Unlock: first lesson always, or previous completed
            const prevDone = i === 0 || mp.lessons[mod.lessons[i - 1].id]?.completed;
            const isLocked = !isSuperUser && !prevDone && !done;

            return (
              <Link
                key={lesson.id}
                to={isLocked ? "#" : `/lesson/${moduleId}/${lesson.id}`}
                className={isLocked ? "pointer-events-none" : ""}
              >
                <Card
                  className={`transition-colors ${
                    done
                      ? "border-primary/20 bg-primary/5"
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
                    {!isLocked && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 🎯 PRACTICE QUIZ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎯</span>
          <h2 className="font-semibold text-sm">Practice Quiz</h2>
        </div>
        <Card className={!practiceReady ? "opacity-50" : ""}>
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Drill until confident</p>
                <p className="text-xs text-muted-foreground">
                  {practiceReady
                    ? mp.practice.attempts > 0
                      ? `${mp.practice.attempts} attempt${mp.practice.attempts !== 1 ? "s" : ""} • Best score: ${mp.practice.bestScore}%`
                      : "Unlimited retakes — no score minimum to start"
                    : "Complete all lessons to unlock"}
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
                  {mp.practice.attempts > 0 ? "Practice Again" : "Start Practice"}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ✅ GQA MODULE TEST */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">✅</span>
          <h2 className="font-semibold text-sm">GQA Module {moduleId} Test</h2>
        </div>
        <Card
          className={`${
            complete
              ? "border-primary/40 bg-primary/5"
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
                  <p className="text-xs text-muted-foreground">Module {moduleId} complete</p>
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
                      You only need to resit this module. 80% required to pass.
                    </p>
                  </div>
                </div>
                {canResitGqa(mp, isSuperUser) ? (
                  <Button asChild className="w-full h-11">
                    <Link to={`/gqa-test/${moduleId}`}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Resit Module {moduleId}
                    </Link>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted">
                    <Clock className="h-4 w-4" />
                    <span>
                      Resit available in {hoursUntilResit(mp)} hours. Review your lessons before then.
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
                      ? "Closed-book • 80% pass mark • 90 minutes"
                      : "Score 80%+ on practice quiz to unlock"}
                  </p>
                </div>
              </div>
            )}
            {gqaReady && !complete && !failed && (
              <Button asChild className="w-full h-11">
                <Link to={`/gqa-test/${moduleId}`}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Open GQA Test
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleOverview;
