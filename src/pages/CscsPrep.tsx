import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Brain,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  ListChecks,
  Trophy,
  Clock,
} from "lucide-react";
import { MODULES } from "@/data/courseData";
import { useProgress } from "@/contexts/ProgressContext";
import {
  getModuleProgress,
  allGqaPassed,
  isModuleComplete,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { getAllQuestions } from "@/data/quizQuestions";
import FullQuiz from "@/components/practice/FullQuiz";

const CscsPrep = () => {
  const { progress } = useProgress();
  const navigate = useNavigate();
  const { isSuperUser } = useSuperUser();
  const allPassed = allGqaPassed(progress, isSuperUser);

  const [mockStarted, setMockStarted] = useState(false);
  const [mockResult, setMockResult] = useState<{
    score: number;
    answers: { questionId: string; selectedIndex: number; correct: boolean }[];
  } | null>(null);

  const mockQuestions = useMemo(() => {
    const all = getAllQuestions();
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(25, shuffled.length));
  }, [mockStarted]);

  const handleMockComplete = useCallback(
    (score: number, answers: { questionId: string; selectedIndex: number; correct: boolean }[]) => {
      setMockResult({ score, answers });
      setMockStarted(false);
    },
    []
  );

  // Gate: must pass all 5 topics
  if (!allPassed) {
    const remaining = MODULES.filter(
      (m) => !isModuleComplete(getModuleProgress(progress, m.id))
    );

    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-3 py-8">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Get ready for your CSCS test
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Finish your topics first — pass all 5 topic tests to unlock CSCS test prep.
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-card space-y-3">
          <h2 className="font-semibold text-sm text-foreground">
            Topic progress
          </h2>
          {MODULES.map((m) => {
            const mp = getModuleProgress(progress, m.id);
            const complete = isModuleComplete(mp);
            return (
              <div
                key={m.id}
                className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  {complete ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={
                      complete ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    Topic {m.id}: {m.title}
                  </span>
                </div>
                {complete && mp.gqa.score !== null && (
                  <span className="text-xs text-primary font-medium">
                    {mp.gqa.score}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {remaining.length > 0 && (
          <Button asChild className="w-full h-12">
            <Link to="/learn">
              Go to lessons
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    );
  }

  // Mock test in progress
  if (mockStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        <div>
          <button
            onClick={() => setMockStarted(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Cancel mock test
          </button>
          <h1 className="text-lg font-bold mt-1 text-foreground">
            CSCS Mock Test
          </h1>
          <div className="flex items-center gap-2 mt-1 bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2">
            <Brain className="h-4 w-4 text-secondary shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                No notes allowed
              </span>{" "}
              — just like the real test.
            </p>
          </div>
        </div>
        <FullQuiz questions={mockQuestions} onComplete={handleMockComplete} />
      </div>
    );
  }

  // Weak areas from mock result
  const getWeakModules = () => {
    if (!mockResult) return [];
    const moduleErrors: Record<number, { wrong: number; total: number }> = {};
    const allQ = getAllQuestions();
    mockResult.answers.forEach((a) => {
      const q = allQ.find((qq) => qq.id === a.questionId);
      if (!q) return;
      if (!moduleErrors[q.moduleId])
        moduleErrors[q.moduleId] = { wrong: 0, total: 0 };
      moduleErrors[q.moduleId].total++;
      if (!a.correct) moduleErrors[q.moduleId].wrong++;
    });
    return Object.entries(moduleErrors)
      .filter(([, v]) => v.wrong > 0)
      .sort(([, a], [, b]) => b.wrong / b.total - a.wrong / a.total)
      .map(([moduleId, v]) => ({
        moduleId: Number(moduleId),
        title: MODULES.find((m) => m.id === Number(moduleId))?.title ?? "",
        wrong: v.wrong,
        total: v.total,
      }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Congratulations Banner */}
      <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-center space-y-3">
        <Trophy className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-xl font-bold text-foreground">
          🎉 All 5 topics passed!
        </h1>
        <p className="text-sm text-muted-foreground">
          Great work. Now let's get you ready for the{" "}
          <strong>CSCS Health &amp; Safety Test</strong> — your last step to the
          Green Card.
        </p>
      </div>

      {/* Topic Results Summary */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {MODULES.map((m) => {
          const mp = getModuleProgress(progress, m.id);
          return (
            <div
              key={m.id}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border border-primary/30 bg-primary/5"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-primary">
                Topic {m.id}{mp.gqa.score !== null ? ` ${mp.gqa.score}%` : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mock Test Card */}
      <Card className="border-2">
        <CardContent className="py-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">CSCS Mock Test</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Practice test with 25 questions from all 5 topics. Timed, no notes — just like the real thing.
              </p>
            </div>
          </div>

          {mockResult && (
            <div
              className={`rounded-lg p-3 text-center ${
                mockResult.score >= 80
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-destructive/10 border border-destructive/20"
              }`}
            >
              <p
                className={`text-lg font-bold ${
                  mockResult.score >= 80 ? "text-primary" : "text-destructive"
                }`}
              >
                Last mock: {mockResult.score}%
              </p>
              {mockResult.score >= 80 ? (
                <p className="text-xs text-primary">
                  Great score! You're ready.
                </p>
              ) : (
                <p className="text-xs text-destructive">
                  Keep practising — aim for 80%+
                </p>
              )}
            </div>
          )}

          <Button
            onClick={() => {
              setMockResult(null);
              setMockStarted(true);
            }}
            className="w-full h-12 text-base font-semibold"
          >
            <ListChecks className="mr-2 h-5 w-5" />
            {mockResult ? "Retake Mock Test" : "Start Mock Test"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Unlimited retakes · Instant results
          </p>
        </CardContent>
      </Card>

      {/* Quick Revision Card */}
      <Card className="border-2">
        <CardContent className="py-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Quick revision</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                5-minute sessions focusing on your weakest areas. Do it on the bus.
              </p>
            </div>
          </div>

          {mockResult && getWeakModules().length > 0 && (
            <div className="bg-accent/50 border border-accent rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Focus on these:
              </p>
              {getWeakModules()
                .slice(0, 3)
                .map((w) => (
                  <div
                    key={w.moduleId}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground">
                      Topic {w.moduleId}: {w.title}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {w.wrong}/{w.total} wrong
                    </span>
                  </div>
                ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full h-12 text-base font-semibold"
            onClick={() => navigate("/practice/1")}
          >
            <Zap className="mr-2 h-5 w-5" />
            Start 5-minute revision
          </Button>
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" /> 5 minutes · All topics · Weakest areas first
          </p>
        </CardContent>
      </Card>

      {/* CSCS Test Button */}
      <div className="pt-2 pb-4">
        <Button asChild className="w-full h-14 text-base font-bold">
          <Link to="/cscs-test">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Go to your CSCS test
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CscsPrep;