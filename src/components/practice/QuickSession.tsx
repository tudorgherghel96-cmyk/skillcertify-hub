import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, XCircle, RotateCcw, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getQuestionsForModule, type QuizQuestion } from "@/data/quizQuestions";
import { MODULES } from "@/data/courseData";
import { useProgress, getModuleProgress } from "@/contexts/ProgressContext";
import { triggerHaptic } from "@/lib/haptics";

interface QuickSessionProps {
  mode: "drill" | "blitz";
  onClose: () => void;
}

const QuickSession = ({ mode, onClose }: QuickSessionProps) => {
  const { progress } = useProgress();

  const weakestModuleId = useMemo(() => {
    let worst = 1;
    let worstScore = Infinity;
    MODULES.forEach((m) => {
      const mp = getModuleProgress(progress, m.id);
      const score = mp.practice.attempts > 0 ? mp.practice.bestScore : 50;
      if (score < worstScore) { worstScore = score; worst = m.id; }
    });
    return worst;
  }, [progress]);

  const allQuestions = useMemo(() => {
    const q: QuizQuestion[] = [];
    MODULES.forEach((m) => q.push(...getQuestionsForModule(m.id)));
    return q;
  }, []);

  const questions = useMemo(() => {
    const weakQ = getQuestionsForModule(weakestModuleId);
    const otherQ = allQuestions.filter((q) => !weakQ.includes(q));
    const shuffled = [...weakQ.sort(() => Math.random() - 0.5).slice(0, 3), ...otherQ.sort(() => Math.random() - 0.5).slice(0, 2)];
    return shuffled.sort(() => Math.random() - 0.5).slice(0, 5);
  }, [weakestModuleId, allQuestions]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    const correct = index === q.correctIndex;
    triggerHaptic(correct ? "success" : "error");
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card className="border-primary/30 overflow-hidden">
        <CardContent className="py-8 text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center ${score >= 4 ? "bg-primary/10" : "bg-amber-100 dark:bg-amber-900/30"}`}
          >
            {score >= 4 ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <RotateCcw className="h-8 w-8 text-amber-500" />}
          </motion.div>
          <p className="text-2xl font-bold text-foreground">{score}/{questions.length}</p>
          <p className="text-sm text-muted-foreground">
            {score >= 4
              ? "Nice. Your accuracy is improving!"
              : "Keep practising — repetition builds memory."}
          </p>
          {/* Readiness impact */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <TrendingUp className="h-3 w-3" />
            Readiness +{Math.max(1, Math.round(pct / 20))}%
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 min-h-[52px] active:scale-[0.97] transition-transform">
              Done
            </Button>
            <Button onClick={() => { setCurrent(0); setSelected(null); setShowFeedback(false); setScore(0); setFinished(false); }} className="flex-1 min-h-[52px] active:scale-[0.97] transition-transform">
              <RotateCcw className="mr-2 h-4 w-4" /> Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardContent className="py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              {mode === "blitz" ? "2-Minute Blitz" : "Quick Drill"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{current + 1}/{questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-muted"}`}
              animate={{ backgroundColor: i < current ? "hsl(var(--primary))" : undefined }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <p className="text-lg font-bold text-foreground leading-snug">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                let btnClass = "border-border bg-card text-foreground";
                if (showFeedback) {
                  if (i === q.correctIndex) btnClass = "border-primary bg-primary/10 text-foreground";
                  else if (i === selected) btnClass = "border-destructive bg-destructive/10 text-foreground";
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={!showFeedback ? { scale: 0.97 } : undefined}
                    onClick={() => handleSelect(i)}
                    disabled={showFeedback}
                    className={`w-full text-left px-4 py-4 rounded-xl text-sm font-medium border-2 transition-all min-h-[56px] ${btnClass}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 ${
                        showFeedback && i === q.correctIndex ? "border-primary bg-primary text-primary-foreground" :
                        showFeedback && i === selected ? "border-destructive bg-destructive text-white" :
                        "border-muted-foreground/30"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            {showFeedback && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm font-medium px-3 py-2 rounded-lg ${
                  selected === q.correctIndex
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {selected === q.correctIndex
                  ? `✓ ${q.explanation}`
                  : `Not quite — ${q.explanation}`}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <Button variant="ghost" size="sm" onClick={onClose} className="w-full min-h-[48px]">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickSession;
