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

const CscsTest = () => {
  const { progress } = useProgress();
  const allPassed = allGqaPassed(progress);
  const cscsResult = progress.cscs;

  // Gate: must pass all 5 GQA modules
  if (!allPassed) {
    return (
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <Link
          to="/cscs-prep"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Prep
        </Link>
        <div className="text-center space-y-3 py-8">
          <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            CSCS Test Locked
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Complete all 5 GQA modular assessments first.
          </p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to Dashboard</Link>
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
          <ArrowLeft className="h-4 w-4" /> Back to Prep
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground">
          CSCS Health &amp; Safety Test
        </h1>
        <p className="text-sm text-muted-foreground">
          Your final step to the Green Labourer Card
        </p>
      </div>

      {/* GQA Module Pass Tracker */}
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
                M{m.id} {mp.gqa.score}%
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
              View Your Results <ShieldCheck className="ml-1.5 h-4 w-4" />
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
                This is the REAL CSCS Health &amp; Safety Test
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>
                  <strong>CLOSED BOOK</strong> — No notes, no phone, no
                  materials allowed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">📝</span>
                <span>
                  Multiple choice questions covering all 5 modules
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
                  This test will be <strong>invigilated</strong> (watched) —
                  follow all instructions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">✅</span>
                <span>
                  Your 5 GQA module passes are{" "}
                  <strong>SAFE</strong> — if you don't pass, you only retake this
                  test
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">🎯</span>
                <span>
                  This is SEPARATE from the GQA modular assessments — it's the
                  final step to your Green Card
                </span>
              </li>
            </ul>
          </div>

          {/* Tips Panel */}
          <div className="border rounded-xl p-4 bg-card space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h2 className="font-semibold text-sm text-foreground">
                Exam Tips
              </h2>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Read the WHOLE question before looking at answers</li>
              <li>• Eliminate obviously wrong answers first</li>
              <li>• If unsure, go with your first instinct</li>
              <li>
                • Don't spend too long on one question — move on and come back
              </li>
              <li>
                • This test covers ALL 5 modules — especially Health Risks
                (Module 4)
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
                  ✓ Your 5 GQA module passes are SAFE
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You only need to retake the CSCS test, not the GQA modules.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/cscs-prep">
                  <Brain className="mr-1.5 h-4 w-4" /> Practice More
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
