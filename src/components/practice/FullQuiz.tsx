import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Clock } from "lucide-react";
import type { QuizQuestion } from "@/data/quizQuestions";
import { triggerHaptic } from "@/lib/haptics";

interface FullQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: { questionId: string; selectedIndex: number; correct: boolean }[]) => void;
  onConceptAttempt?: (conceptSlug: string, isCorrect: boolean, responseTimeMs: number) => void;
}

/* ── Stories-style progress bar ── */
const StoryBar = ({
  total,
  current,
  onTap,
}: {
  total: number;
  current: number;
  onTap: (i: number) => void;
}) => (
  <div className="flex gap-[3px] w-full">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onTap(i)}
        className="flex-1 h-[3px] rounded-full overflow-hidden bg-muted/60"
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: i < current
              ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.7))"
              : "transparent",
          }}
          initial={false}
          animate={{
            width: i < current ? "100%" : i === current ? "100%" : "0%",
            opacity: i === current ? [0.5, 1, 0.5] : 1,
          }}
          transition={
            i === current
              ? { opacity: { repeat: Infinity, duration: 1.5 } }
              : { duration: 0.3 }
          }
        />
      </button>
    ))}
  </div>
);

/* ── Countdown ring ── */
const CountdownRing = ({ timeLeft, total }: { timeLeft: number; total: number }) => {
  const pct = timeLeft / total;
  const r = 16;
  const circ = 2 * Math.PI * r;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft < 60;

  return (
    <div className="relative h-10 w-10 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="2.5" className="stroke-muted/30" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          className={isLow ? "stroke-destructive" : "stroke-primary"}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span className={`text-[10px] font-mono font-bold ${isLow ? "text-destructive" : "text-muted-foreground"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

const FullQuiz = ({ questions, onComplete, onConceptAttempt }: FullQuizProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number; correct: boolean }[]
  >([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const questionStartRef = useRef(Date.now());

  // Timer
  const totalSeconds = Math.ceil(questions.length * 93);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      finishQuiz(answers);
    }
  }, [timeLeft, finished]);

  const finishQuiz = useCallback(
    (finalAnswers: typeof answers) => {
      clearInterval(timerRef.current);
      setFinished(true);
      const correct = finalAnswers.filter((a) => a.correct).length;
      const score = Math.round((correct / questions.length) * 100);
      triggerHaptic("success");
      onComplete(score, finalAnswers);
    },
    [questions.length, onComplete]
  );

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);

    const q = questions[current];
    const isCorrect = index === q.correctIndex;
    const responseTime = Date.now() - questionStartRef.current;
    triggerHaptic(isCorrect ? "success" : "error");
    onConceptAttempt?.(q.conceptSlug, isCorrect, responseTime);

    const newAnswer = { questionId: q.id, selectedIndex: index, correct: isCorrect };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // Auto-advance after feedback
    const delay = isCorrect ? 1200 : 3500;
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        finishQuiz(newAnswers);
      } else {
        questionStartRef.current = Date.now();
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, delay);
  };

  const handleBarTap = (i: number) => {
    // Only allow jumping to already answered questions (review)
    if (i < answers.length) {
      // Don't actually jump in quiz mode — just visual feedback
    }
  };

  if (finished) {
    return <QuizResults questions={questions} answers={answers} />;
  }

  const q = questions[current];

  return (
    <div className="space-y-4">
      {/* Stories bar + timer */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <StoryBar total={questions.length} current={current} onTap={handleBarTap} />
        </div>
        <CountdownRing timeLeft={timeLeft} total={totalSeconds} />
      </div>

      <p className="text-xs text-muted-foreground">
        {current + 1} of {questions.length}
      </p>

      {/* Question with slide transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-4"
        >
          <p className="text-xl sm:text-[22px] font-bold text-foreground leading-snug">
            {q.question}
          </p>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrectAnswer = i === q.correctIndex;
              const isSelected = selected === i;

              let borderClass = "border-border bg-card text-foreground hover:border-primary/40";
              let animateProps: Record<string, any> = {};

              if (showFeedback) {
                if (isCorrectAnswer) {
                  borderClass = "border-primary bg-primary/10 text-foreground";
                  animateProps = { scale: [1, 1.02, 1] };
                } else if (isSelected) {
                  borderClass = "border-destructive bg-destructive/10 text-foreground";
                  animateProps = { x: [0, -6, 6, -4, 4, 0] };
                } else {
                  borderClass = "border-border bg-muted/50 text-muted-foreground";
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showFeedback}
                  animate={animateProps}
                  transition={{ duration: 0.4 }}
                  className={`w-full text-left px-5 py-4 rounded-xl text-base sm:text-lg font-medium border-2 transition-colors min-h-[60px] active:scale-[0.98] ${borderClass}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        showFeedback && isCorrectAnswer
                          ? "border-primary bg-primary text-primary-foreground"
                          : showFeedback && isSelected
                          ? "border-destructive bg-destructive text-destructive-foreground"
                          : selected === i
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {showFeedback && isCorrectAnswer
                        ? "✓"
                        : showFeedback && isSelected
                        ? "✗"
                        : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explain-on-wrong mini-lesson card */}
      <AnimatePresence>
        {showFeedback && selected !== null && selected !== q.correctIndex && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-medium">
              ✗ Not quite — the answer is: {q.options[q.correctIndex]}
            </div>
            <div className="border-2 border-primary/30 rounded-xl p-3 bg-primary/5 flex items-start gap-2">
              <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">
                  Remember This
                </p>
                <p className="text-sm text-foreground">
                  {q.rememberText}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {showFeedback && selected !== null && selected === q.correctIndex && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-primary font-medium"
          >
            ✓ Correct! {q.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Results breakdown component ─── */
import { MODULES } from "@/data/courseData";
import { Link } from "react-router-dom";

const QuizResults = ({
  questions,
  answers,
}: {
  questions: QuizQuestion[];
  answers: { questionId: string; selectedIndex: number; correct: boolean }[];
}) => {
  const correct = answers.filter((a) => a.correct).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= 80;

  // Group by conceptSlug
  const conceptMap: Record<string, { name: string; total: number; correct: number; moduleId: number; lessonId: number }> = {};
  for (const a of answers) {
    const q = questions.find((qq) => qq.id === a.questionId)!;
    if (!conceptMap[q.conceptSlug]) {
      conceptMap[q.conceptSlug] = {
        name: q.conceptSlug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        total: 0,
        correct: 0,
        moduleId: q.moduleId,
        lessonId: q.lessonId,
      };
    }
    conceptMap[q.conceptSlug].total++;
    if (a.correct) conceptMap[q.conceptSlug].correct++;
  }

  const concepts = Object.entries(conceptMap).sort(
    ([, a], [, b]) => a.correct / a.total - b.correct / b.total
  );

  const motivational =
    score >= 80
      ? "Assessment ready! 🔥"
      : score >= 60
      ? "Almost there — review your weak spots"
      : "Keep practising — you've got this 💪";

  return (
    <div className="space-y-6">
      {/* Score header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="text-center space-y-3"
      >
        <div
          className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center ${
            passed ? "bg-primary/10" : "bg-destructive/10"
          }`}
        >
          <span className="text-3xl font-black">{score}%</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {correct} of {questions.length} correct
        </p>

        {/* Pass bar */}
        <div className="max-w-xs mx-auto">
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${passed ? "bg-primary" : "bg-destructive"}`}
            />
            <div className="absolute top-0 bottom-0 w-0.5 bg-foreground" style={{ left: "80%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span className="font-semibold">80% pass</span>
            <span>100%</span>
          </div>
        </div>

        <p className={`font-semibold text-sm ${passed ? "text-primary" : score >= 60 ? "text-amber-500" : "text-destructive"}`}>
          {motivational}
        </p>
      </motion.div>

      {/* Concept breakdown */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-foreground">Breakdown by concept:</h3>
        {concepts.map(([slug, data]) => {
          const pct = Math.round((data.correct / data.total) * 100);
          const isWeak = pct < 80;
          const mod = MODULES.find((m) => m.id === data.moduleId);
          const lessonTitle = mod?.lessons.find((l) => l.id === data.lessonId)?.title;

          return (
            <motion.div
              key={slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border rounded-xl p-3 bg-card space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{data.name}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    pct === 100
                      ? "bg-primary/10 text-primary"
                      : pct >= 80
                      ? "bg-primary/10 text-primary"
                      : pct >= 50
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {data.correct}/{data.total} {pct === 100 ? "✓" : ""}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    pct >= 80 ? "bg-primary" : pct >= 50 ? "bg-amber-500" : "bg-destructive"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {isWeak && lessonTitle && (
                <Link
                  to={`/lesson/${data.moduleId}/${data.lessonId}`}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  Review: {lessonTitle} →
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Wrong answers detail */}
      {answers.some((a) => !a.correct) && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Review wrong answers:</h3>
          {answers
            .filter((a) => !a.correct)
            .map((a) => {
              const q = questions.find((qq) => qq.id === a.questionId)!;
              return (
                <div key={a.questionId} className="border rounded-xl p-3 bg-card space-y-1">
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  <p className="text-xs text-destructive">Your answer: {q.options[a.selectedIndex]}</p>
                  <p className="text-xs text-primary font-medium">Correct: {q.options[q.correctIndex]}</p>
                  <p className="text-xs text-muted-foreground italic">{q.explanation}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default FullQuiz;
