import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  ArrowRight,
  Lock,
  ChevronRight,
  CheckCircle,
  Clock,
  BookOpen,
  Target,
  ClipboardCheck,
  Trophy,
} from "lucide-react";
import { MODULES } from "@/data/courseData";
import {
  useProgress,
  getModuleProgress,
  getLessonsCompleted,
  isPracticeUnlocked,
  isGqaUnlocked,
  isModuleComplete,
  isModuleUnlocked,
  allGqaPassed,
  getOverallProgress,
  getNextAction,
  canResitGqa,
  hoursUntilResit,
} from "@/contexts/ProgressContext";

const Dashboard = () => {
  const { progress } = useProgress();
  const overall = getOverallProgress(progress);
  const nextAction = getNextAction(progress);
  const showCscs = allGqaPassed(progress);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          Welcome back. <span className="text-primary">Your fastest route to the CSCS card.</span>
        </h1>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="pt-5 pb-4 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-sm">
              Module {overall.modulesComplete} of 5 complete
            </span>
            <span className="text-xs text-muted-foreground">{overall.percentage}%</span>
          </div>
          <Progress value={overall.percentage} className="h-2.5" />

          {/* Next action CTA */}
          {nextAction && (
            <Button asChild className="w-full h-12 mt-1">
              <Link
                to={
                  nextAction.moduleId === 0
                    ? "/cscs-prep"
                    : nextAction.lessonId
                    ? `/lesson/${nextAction.moduleId}/${nextAction.lessonId}`
                    : isGqaUnlocked(getModuleProgress(progress, nextAction.moduleId))
                    ? `/gqa-test/${nextAction.moduleId}`
                    : `/practice/${nextAction.moduleId}`
                }
              >
                {nextAction.label} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Closed-book reminder */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm leading-snug">
          <span className="font-semibold">Both tests are CLOSED BOOK</span> — no notes allowed.
          This course will get it all into your head.
        </p>
      </div>

      {/* Module cards */}
      <div className="space-y-3">
        {MODULES.map((mod) => {
          const mp = getModuleProgress(progress, mod.id);
          const unlocked = isModuleUnlocked(progress, mod.id);
          const lessonsComplete = getLessonsCompleted(mp, mod.lessons.length);
          const practiceReady = isPracticeUnlocked(mp, mod.lessons.length);
          const gqaReady = isGqaUnlocked(mp);
          const complete = isModuleComplete(mp);
          const Icon = mod.icon;
          const failed = mp.gqa.passed === false;

          return (
            <Link
              key={mod.id}
              to={unlocked ? `/module/${mod.id}` : "#"}
              className={!unlocked ? "pointer-events-none" : ""}
            >
              <Card
                className={`transition-all ${
                  complete
                    ? "border-primary/40 bg-primary/5"
                    : !unlocked
                    ? "opacity-50"
                    : "hover:border-primary/30"
                }`}
              >
                <CardContent className="py-4 space-y-3">
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        complete ? "bg-primary text-primary-foreground" : "bg-primary/10"
                      }`}
                    >
                      {!unlocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : complete ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        Module {mod.id}: {mod.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mod.lessons.length} lessons • {mod.topics.length} topics
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1">
                    {mod.topics.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                        {t}
                      </Badge>
                    ))}
                  </div>

                  {/* Three-stage progress row */}
                  {unlocked && (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {/* Learn */}
                      <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/50">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-medium">LEARN</span>
                        <span
                          className={`text-[10px] ${
                            lessonsComplete === mod.lessons.length
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {lessonsComplete}/{mod.lessons.length}
                        </span>
                      </div>

                      {/* Practice */}
                      <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/50">
                        <Target className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-medium">PRACTICE</span>
                        <span
                          className={`text-[10px] ${
                            mp.practice.bestScore >= 80
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {practiceReady
                            ? mp.practice.attempts > 0
                              ? `Best ${mp.practice.bestScore}%`
                              : "Ready"
                            : "🔒"}
                        </span>
                      </div>

                      {/* GQA */}
                      <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/50">
                        <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-medium">GQA</span>
                        <span
                          className={`text-[10px] ${
                            complete
                              ? "text-primary font-semibold"
                              : failed
                              ? "text-destructive font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {complete
                            ? `✅ ${mp.gqa.score}%`
                            : failed
                            ? canResitGqa(mp)
                              ? "Resit ready"
                              : `⏳ ${hoursUntilResit(mp)}h`
                            : gqaReady
                            ? "Ready"
                            : "🔒"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* CSCS Card */}
      {showCscs ? (
        <Card className="border-primary bg-primary/5">
          <CardContent className="py-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-sm">All 5 GQA Modules Complete! 🎉</h3>
                <p className="text-xs text-muted-foreground">
                  Now prepare for your CSCS Health &amp; Safety Test
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="h-11">
                <Link to="/cscs-prep">
                  <Brain className="mr-2 h-4 w-4" /> CSCS Mock Test
                </Link>
              </Button>
              <Button asChild className="h-11">
                <Link to="/cscs-test">
                  Take CSCS Test <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="opacity-50">
          <CardContent className="py-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold text-sm">CSCS Health &amp; Safety Test</h3>
              <p className="text-xs text-muted-foreground">
                Available after all 5 GQA modules passed
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
