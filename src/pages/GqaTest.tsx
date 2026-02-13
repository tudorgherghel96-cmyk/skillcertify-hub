import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  Brain,
  Lightbulb,
  ArrowRight,
  Repeat,
} from "lucide-react";
import { MODULES } from "@/data/courseData";
import { useProgress } from "@/contexts/ProgressContext";
import {
  getModuleProgress,
  areAllLessonsComplete,
  getLessonsCompleted,
  isGqaUnlocked,
  isModuleComplete,
  isModuleUnlocked,
  canResitGqa,
  hoursUntilResit,
} from "@/contexts/ProgressContext";

/** Real-time countdown for 24-hour resit lockout */
const ResitCountdown = ({ failedAt, moduleId }: { failedAt: string | null; moduleId: number }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!failedAt) return null;

  const unlockAt = new Date(failedAt).getTime() + 24 * 60 * 60 * 1000;
  const diff = Math.max(0, unlockAt - now);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (diff <= 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-primary font-medium">You can retake it now.</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-xl">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground font-mono">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        You can retake this test in {hours}h {minutes}m
      </p>
      <Button asChild variant="outline" size="sm">
        <Link to={`/practice/${moduleId}`}>
          <Repeat className="mr-1.5 h-4 w-4" /> Practice while you wait
        </Link>
      </Button>
    </div>
  );
};

const GqaTest = () => {
  const { moduleId: mIdStr } = useParams();
  const moduleId = Number(mIdStr);
  const { progress } = useProgress();
  const mp = getModuleProgress(progress, moduleId);
  const mod = MODULES.find((m) => m.id === moduleId);

  if (!mod) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Topic not found.</p>
        <Link to="/learn" className="text-primary underline text-sm">
          Back to lessons
        </Link>
      </div>
    );
  }

  const totalLessons = mod.lessons.length;
  const doneLessons = getLessonsCompleted(mp, totalLessons);
  const lessonsComplete = areAllLessonsComplete(mp, totalLessons);
  const practiceReady = isGqaUnlocked(mp);
  const passed = mp.gqa.passed === true;
  const failed = mp.gqa.passed === false;
  const canResit = canResitGqa(mp);
  const resitHours = hoursUntilResit(mp);

  const isReady = lessonsComplete && practiceReady;
  const nextModuleId = moduleId + 1;
  const hasNextModule = MODULES.some((m) => m.id === nextModuleId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <Link
          to={`/module/${moduleId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Topic {moduleId}
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground">
          Topic {moduleId} Test
        </h1>
        <p className="text-sm text-muted-foreground">{mod.title}</p>
      </div>

      {/* Topic Pass Tracker */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {MODULES.map((m) => {
          const mmp = getModuleProgress(progress, m.id);
          const unlocked = isModuleUnlocked(progress, m.id);
          const complete = isModuleComplete(mmp);
          const isCurrent = m.id === moduleId;

          return (
            <div
              key={m.id}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-colors ${
                isCurrent
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {complete ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
              ) : !unlocked ? (
                <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              )}
              <span className={complete ? "text-primary" : unlocked ? "text-foreground" : "text-muted-foreground"}>
                T{m.id}
                {complete && mmp.gqa.score !== null && ` ${mmp.gqa.score}%`}
              </span>
            </div>
          );
        })}
      </div>

      {/* PASSED state */}
      {passed && (
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground">
            🎉 Topic {moduleId} passed!
          </h2>
          <p className="text-sm text-muted-foreground">
            Score: {mp.gqa.score}% — Well done!
          </p>
          {hasNextModule ? (
            <Button asChild className="h-11">
              <Link to={`/module/${nextModuleId}`}>
                Next: Topic {nextModuleId} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="h-11">
              <Link to="/cscs-prep">
                Prepare for CSCS test <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* FAILED state */}
      {failed && (
        <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-5 space-y-4">
          <div className="text-center space-y-2">
            <XCircle className="h-10 w-10 text-destructive mx-auto" />
            <h2 className="text-lg font-bold text-foreground">
              Topic {moduleId} — not passed this time
            </h2>
            <p className="text-sm text-muted-foreground">
              Score: {mp.gqa.score}%. You need 80% to pass.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium text-foreground">
              ✓ Your other topic passes are safe
            </p>
            <p className="text-sm text-muted-foreground">
              Don't worry — if you fail, you only retake this one topic. Your other passes are safe.
            </p>
          </div>

          {canResit ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-primary font-medium">
                You can retake it now.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to={`/practice/${moduleId}`}>
                  <Repeat className="mr-1.5 h-4 w-4" /> Practice first
                </Link>
              </Button>
            </div>
          ) : (
            <ResitCountdown failedAt={mp.gqa.failedAt} moduleId={moduleId} />
          )}
        </div>
      )}

      {/* Readiness Check */}
      {!passed && (
        <div className="border rounded-xl p-4 bg-card space-y-3">
          <h2 className="font-semibold text-sm text-foreground">
            Are you ready?
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              {lessonsComplete ? (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span className={`text-sm ${lessonsComplete ? "text-foreground" : "text-muted-foreground"}`}>
                {lessonsComplete
                  ? `All ${totalLessons} lessons done`
                  : `${doneLessons} of ${totalLessons} lessons done — finish the rest first`}
              </span>
              {!lessonsComplete && (
                <Link
                  to={`/module/${moduleId}`}
                  className="text-xs text-primary underline ml-auto"
                >
                  Go to lessons
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {practiceReady ? (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span className={`text-sm ${practiceReady ? "text-foreground" : "text-muted-foreground"}`}>
                Practice score 80%+
              </span>
              {!practiceReady && lessonsComplete && (
                <Link
                  to={`/practice/${moduleId}`}
                  className="text-xs text-primary underline ml-auto"
                >
                  Practice now
                </Link>
              )}
            </div>
          </div>
          {isReady && (
            <p className="text-sm text-primary font-semibold">
              ✓ Best practice score: {mp.practice.bestScore}% — You're ready!
            </p>
          )}
        </div>
      )}

      {/* Pre-Test Briefing */}
      {!passed && (
        <div className="border-2 border-destructive/30 rounded-xl p-4 bg-destructive/5 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <h2 className="font-bold text-sm text-foreground">
              Topic {moduleId} Test
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Open book</strong> — use your own handwritten notes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-0.5">🎯</span>
              <span>
                <strong>80% needed</strong> to pass
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-0.5">⏱</span>
              <span>
                90 minutes total
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-0.5">🔁</span>
              <span>
                24-hour wait before resit if you don't pass
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-0.5">✅</span>
              <span>
                You only retake topics you didn't pass
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Tips Panel */}
      {!passed && (
        <div className="border rounded-xl p-4 bg-card space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold text-sm text-foreground">
              Tips
            </h2>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Read the WHOLE question before looking at answers</li>
            <li>• Cross out obviously wrong answers first</li>
            <li>• If unsure, go with your first instinct</li>
            <li>
              • Don't spend too long on one question — move on and come back
            </li>
          </ul>
        </div>
      )}

      {/* Start Button */}
      {!passed && (
        <div className="text-center space-y-3 pt-2 pb-4">
          <Button
            disabled={!isReady || (failed && !canResit)}
            className="w-full h-14 text-base font-bold"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            {failed
              ? canResit
                ? `Retake Topic ${moduleId} Test`
                : `Retake available in ${resitHours}h`
              : `Start Topic ${moduleId} Test`}
          </Button>
          <p className="text-xs text-muted-foreground">
            Coming soon — your assessor will provide access to this test
          </p>
        </div>
      )}
    </div>
  );
};

export default GqaTest;