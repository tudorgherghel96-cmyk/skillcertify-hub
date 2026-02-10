import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Brain,
  Download,
  Trophy,
  Repeat,
} from "lucide-react";
import { MODULES } from "@/data/courseData";
import { useProgress } from "@/contexts/ProgressContext";
import {
  getModuleProgress,
  isModuleComplete,
  allGqaPassed,
} from "@/contexts/ProgressContext";
import { motion } from "framer-motion";

/* ─── Simple confetti effect ─── */
const ConfettiPiece = ({ delay, x }: { delay: number; x: number }) => {
  const colors = [
    "bg-primary",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-pink-400",
    "bg-sky-400",
    "bg-violet-400",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() > 0.5 ? "h-2 w-2" : "h-3 w-1.5";
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className={`absolute ${color} ${size} rounded-sm`}
      style={{ left: `${x}%`, top: -10, rotate: rotation }}
      initial={{ y: -20, opacity: 1 }}
      animate={{
        y: [0, 600 + Math.random() * 300],
        x: [0, (Math.random() - 0.5) * 120],
        rotate: rotation + Math.random() * 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 2.5 + Math.random() * 1.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

const Confetti = () => {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 1.2,
    x: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} delay={p.delay} x={p.x} />
      ))}
    </div>
  );
};

const Results = () => {
  const { progress } = useProgress();
  const cscsResult = progress.cscs;
  const allGqa = allGqaPassed(progress);
  const cscsPassed = cscsResult.passed === true;
  const cscsFailed = cscsResult.passed === false;

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (cscsPassed) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [cscsPassed]);

  // Compute weak modules for failed state
  const getWeakModules = () => {
    // In a real app this would come from the actual test answers
    // For now show modules with the lowest GQA scores
    return MODULES.map((m) => {
      const mp = getModuleProgress(progress, m.id);
      return {
        moduleId: m.id,
        title: m.title,
        score: mp.gqa.score ?? 0,
      };
    })
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {showConfetti && <Confetti />}

      {/* ─── CSCS PASSED ─── */}
      {cscsPassed && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-xl border-2 border-primary bg-primary/5 p-6 text-center space-y-4"
          >
            <Trophy className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              🎉 Congratulations!
            </h1>
            <h2 className="text-lg font-bold text-primary">
              You passed the CSCS Health &amp; Safety Test!
            </h2>
            {cscsResult.score !== null && (
              <p className="text-sm text-muted-foreground">
                Score: {cscsResult.score}%
              </p>
            )}
          </motion.div>

          {/* Green Card Process */}
          <Card className="border-2">
            <CardContent className="py-5 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <h2 className="font-bold text-foreground">
                  Your CSCS Green Labourer Card
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Approved GQA Centre
                    </p>
                    <p className="text-muted-foreground">
                      Your results are verified by the assessment centre
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Q-Card Issued
                    </p>
                    <p className="text-muted-foreground">
                      Your qualification is recorded on the GQA system
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      CSCS Green Card
                    </p>
                    <p className="text-muted-foreground">
                      Your Green Labourer Card is processed and posted to you
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualification Summary */}
          <Card>
            <CardContent className="py-5 space-y-3">
              <h2 className="font-bold text-foreground text-sm">
                Qualification Summary
              </h2>
              {MODULES.map((m) => {
                const mp = getModuleProgress(progress, m.id);
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        Module {m.id}: {m.title}
                      </span>
                    </div>
                    <span className="text-xs text-primary font-medium">
                      {mp.gqa.score ?? "—"}%
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between text-sm py-1.5 border-t-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-semibold">
                    CSCS Health &amp; Safety Test
                  </span>
                </div>
                <span className="text-xs text-primary font-bold">
                  {cscsResult.score}% PASSED
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pb-4">
            <Button variant="outline" className="w-full h-12" disabled>
              <Download className="mr-2 h-4 w-4" /> Download Qualification
              Summary (PDF)
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              PDF download coming soon
            </p>
            <Button asChild className="w-full h-12">
              <Link to="/cscs-route">
                View Career Progression{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}

      {/* ─── CSCS FAILED ─── */}
      {cscsFailed && (
        <>
          <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-5 text-center space-y-3">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-xl font-bold text-foreground">
              Not passed this time
            </h1>
            <p className="text-sm text-muted-foreground">
              Score: {cscsResult.score}%
            </p>
          </div>

          {/* GQA passes safe */}
          <div className="bg-card border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Your 5 GQA module passes are SAFE
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              You only need to retake the CSCS Health &amp; Safety test. All
              your module results remain valid.
            </p>
          </div>

          {/* Score Breakdown */}
          <Card>
            <CardContent className="py-5 space-y-3">
              <h2 className="font-bold text-sm text-foreground">
                GQA Module Scores
              </h2>
              {MODULES.map((m) => {
                const mp = getModuleProgress(progress, m.id);
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        Module {m.id}: {m.title}
                      </span>
                    </div>
                    <span className="text-xs text-primary font-medium">
                      {mp.gqa.score ?? "—"}%
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card>
            <CardContent className="py-5 space-y-3">
              <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-destructive" />
                Focus on these areas:
              </h2>
              {getWeakModules().map((w) => (
                <Link
                  key={w.moduleId}
                  to={`/practice/${w.moduleId}`}
                  className="flex items-center justify-between text-sm py-2 px-3 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-foreground">
                    Module {w.moduleId}: {w.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3 pb-4">
            <Button asChild className="w-full h-12">
              <Link to="/cscs-prep">
                <Repeat className="mr-2 h-4 w-4" /> Practice More, Then Retake
              </Link>
            </Button>
          </div>
        </>
      )}

      {/* ─── NOT ATTEMPTED ─── */}
      {cscsResult.passed === null && (
        <>
          <div className="text-center space-y-3 py-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Your Results</h1>
            <p className="text-sm text-muted-foreground">
              Track your progress across all assessments
            </p>
          </div>

          {/* GQA Results */}
          <Card>
            <CardContent className="py-4 space-y-3">
              <h2 className="font-semibold text-foreground">
                GQA Module Results
              </h2>
              {MODULES.map((m) => {
                const mp = getModuleProgress(progress, m.id);
                const complete = isModuleComplete(mp);
                return (
                  <div
                    key={m.id}
                    className="flex justify-between items-center text-sm py-1.5 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          complete
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        Module {m.id}: {m.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        complete ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {complete
                        ? `${mp.gqa.score}% PASSED`
                        : "Not attempted"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* CSCS Status */}
          <Card>
            <CardContent className="py-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">
                    CSCS Health &amp; Safety Test
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {allGqa ? "Ready" : "Locked"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Next Action */}
          {allGqa ? (
            <Button asChild className="w-full h-12">
              <Link to="/cscs-prep">
                Prepare for CSCS Test{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full h-12">
              <Link to="/dashboard">
                Continue Learning{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" className="w-full h-12">
            <Link to="/cscs-route">
              CSCS Card Pathway{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default Results;
