import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Brain,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { MODULES } from "@/data/courseData";
import { useProgress } from "@/contexts/ProgressContext";
import {
  getModuleProgress,
  allGqaPassed,
  isModuleComplete,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";

const CscsTest = () => {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const allPassed = allGqaPassed(progress, isSuperUser);
  const cscsResult = progress.cscs;

  if (!allPassed) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <Link
          to="/cscs-prep"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="text-center space-y-3 py-8">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            CSCS Test Locked
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Pass all 5 topic tests first to unlock this.
          </p>
          <Button asChild variant="outline">
            <Link to="/learn">Go to lessons</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <Link
          to="/cscs-prep"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground">
          CSCS Health &amp; Safety Test
        </h1>
        <p className="text-sm text-muted-foreground">
          Your last step to the Green Card
        </p>
      </div>

      {/* Topic Pass Summary */}
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
                Topic {m.id}{mp.gqa.score !== null ? ` ${mp.gqa.score}%` : " ✓"}
              </span>
            </div>
          );
        })}
      </div>

      {/* CSCS already passed */}
      {cscsResult.passed === true && (
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground">
            🎉 CSCS Test PASSED!
          </h2>
          <p className="text-sm text-muted-foreground">
            Score: {cscsResult.score}%
          </p>
          <Button asChild className="h-11">
            <Link to="/results">
              View your results <ShieldCheck className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Pre-Test Briefing */}
      {cscsResult.passed !== true && (
        <>
          <div className="border-2 border-destructive/30 rounded-xl p-4 bg-destructive/5 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <h2 className="font-bold text-sm text-foreground">
                About the CSCS test
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>No notes allowed</strong> — no phone, no materials
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">📝</span>
                <span>
                  Multiple choice questions covering all 5 topics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">⏱</span>
                <span>
                  Time limit applies — answer at a steady pace
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">👁</span>
                <span>
                  This test is <strong>watched</strong> — follow all instructions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">✅</span>
                <span>
                  Don't worry — if you fail, you only retake this test. Your other passes are safe.
                </span>
              </li>
            </ul>
          </div>

          {/* Tips Panel */}
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

          {/* Failed state */}
          {cscsResult.passed === false && (
            <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-5 space-y-3 text-center">
              <p className="text-sm font-medium text-destructive">
                Previous attempt: {cscsResult.score}% — not passed
              </p>
              <div className="bg-card border rounded-lg p-3">
                <p className="text-sm font-medium text-foreground">
                  ✓ Your 5 topic passes are safe
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You only need to retake the CSCS test.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/cscs-prep">
                  <Brain className="mr-1.5 h-4 w-4" /> Practice more
                </Link>
              </Button>
            </div>
          )}

          {/* Start Button */}
          <div className="text-center space-y-3 pt-2 pb-4">
            <Button
              disabled
              className="w-full h-14 text-base font-bold"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Start CSCS Health &amp; Safety Test
            </Button>
            <p className="text-xs text-muted-foreground">
              Coming soon — your trainer will provide access to this test
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CscsTest;