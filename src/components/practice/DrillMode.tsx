import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Brain } from "lucide-react";
import type { QuizQuestion, QuestionPerformance } from "@/data/quizQuestions";
import { pickNextDrillQuestion } from "@/data/quizQuestions";

interface DrillModeProps {
  questions: QuizQuestion[];
}

const DrillMode = ({ questions }: DrillModeProps) => {
  const [performance, setPerformance] = useState<
    Record<string, QuestionPerformance>
  >({});
  const [currentQ, setCurrentQ] = useState<QuizQuestion>(() =>
    pickNextDrillQuestion(questions, {})
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  const nextQuestion = useCallback(
    (perf: Record<string, QuestionPerformance>) => {
      setSelected(null);
      setFlash(null);
      setCurrentQ(pickNextDrillQuestion(questions, perf));
    },
    [questions]
  );

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === currentQ.correctIndex;

    setSessionTotal((t) => t + 1);
    if (correct) {
      setSessionCorrect((c) => c + 1);
      setStreak((s) => s + 1);
      setFlash("correct");
    } else {
      setStreak(0);
      setFlash("wrong");
    }

    const prev = performance[currentQ.id] ?? {
      questionId: currentQ.id,
      correctCount: 0,
      wrongCount: 0,
      lastSeen: 0,
    };
    const updated = {
      ...performance,
      [currentQ.id]: {
        ...prev,
        correctCount: prev.correctCount + (correct ? 1 : 0),
        wrongCount: prev.wrongCount + (correct ? 0 : 1),
        lastSeen: Date.now(),
      },
    };
    setPerformance(updated);

    // Auto-advance after delay
    setTimeout(() => nextQuestion(updated), correct ? 1500 : 3500);
  };

  const pct =
    sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          {streak >= 3 && <Flame className="h-4 w-4 text-orange-500" />}
          <span className="font-bold text-foreground">
            {streak >= 3 ? `🔥 ${streak} streak!` : `Streak: ${streak}`}
          </span>
        </div>
        <span className="text-muted-foreground">
          {sessionCorrect}/{sessionTotal} ({pct}%)
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id + "-" + sessionTotal}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            {currentQ.question}
          </p>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectAnswer = i === currentQ.correctIndex;
              const showResult = selected !== null;

              let borderClass = "border-border bg-card text-foreground";
              if (showResult) {
                if (isCorrectAnswer)
                  borderClass =
                    "border-primary bg-primary/10 text-foreground";
                else if (isSelected)
                  borderClass =
                    "border-destructive bg-destructive/10 text-foreground";
                else borderClass = "border-border bg-muted/50 text-muted-foreground";
              } else {
                borderClass +=
                  " hover:border-primary/40";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] sm:text-base font-medium border-2 transition-all min-h-[52px] ${borderClass}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                        showResult && isCorrectAnswer
                          ? "border-primary bg-primary text-primary-foreground"
                          : showResult && isSelected
                          ? "border-destructive bg-destructive text-destructive-foreground"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {flash === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-primary font-medium"
          >
            ✓ Correct! {currentQ.explanation}
          </motion.div>
        )}
        {flash === "wrong" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-medium">
              ✗ Wrong. Correct answer:{" "}
              {currentQ.options[currentQ.correctIndex]}
            </div>
            <div className="border-2 border-destructive/40 rounded-xl p-3 bg-destructive/5 flex items-start gap-2">
              <Brain className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-0.5">
                  Remember This
                </p>
                <p className="text-sm text-foreground">
                  {currentQ.rememberText}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrillMode;
