import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import type { QuizQuestion } from "@/data/quizQuestions";

interface FullQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: { questionId: string; selectedIndex: number; correct: boolean }[]) => void;
}

const FullQuiz = ({ questions, onComplete }: FullQuizProps) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number; correct: boolean }[]
  >([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  // Timer: ~1.5 min per question
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

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      finishQuiz(answers);
    }
  }, [timeLeft, finished]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const finishQuiz = useCallback(
    (finalAnswers: typeof answers) => {
      clearInterval(timerRef.current);
      setFinished(true);
      const correct = finalAnswers.filter((a) => a.correct).length;
      const score = Math.round((correct / questions.length) * 100);
      onComplete(score, finalAnswers);
    },
    [questions.length, onComplete]
  );

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const handleNext = () => {
    if (selected === null) return;
    const q = questions[current];
    const newAnswer = {
      questionId: q.id,
      selectedIndex: selected,
      correct: selected === q.correctIndex,
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 >= questions.length) {
      finishQuiz(newAnswers);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  if (finished) {
    const correct = answers.filter((a) => a.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 80;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div
            className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center ${
              passed ? "bg-primary/10" : "bg-destructive/10"
            }`}
          >
            {passed ? (
              <CheckCircle2 className="h-10 w-10 text-primary" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{score}%</h2>
          <p className="text-sm text-muted-foreground">
            {correct} of {questions.length} correct
          </p>

          {/* Pass line indicator */}
          <div className="max-w-xs mx-auto">
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  passed ? "bg-primary" : "bg-destructive"
                }`}
                style={{ width: `${score}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                style={{ left: "80%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="font-semibold">80% pass</span>
              <span>100%</span>
            </div>
          </div>

          <p
            className={`font-semibold text-sm ${
              passed ? "text-primary" : "text-destructive"
            }`}
          >
            {passed
              ? "🎉 You passed! You're ready for the GQA test."
              : "Keep practising. You need 80% to unlock the GQA test."}
          </p>
        </div>

        {/* Wrong answers review */}
        {answers.some((a) => !a.correct) && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">
              Review wrong answers:
            </h3>
            {answers
              .filter((a) => !a.correct)
              .map((a) => {
                const q = questions.find((qq) => qq.id === a.questionId)!;
                return (
                  <div
                    key={a.questionId}
                    className="border rounded-xl p-3 bg-card space-y-1"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {q.question}
                    </p>
                    <p className="text-xs text-destructive">
                      Your answer: {q.options[a.selectedIndex]}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      Correct: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="space-y-5">
      {/* Progress bar + timer */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-sm font-mono text-muted-foreground shrink-0">
          <Clock className="h-3.5 w-3.5" />
          <span className={timeLeft < 60 ? "text-destructive font-bold" : ""}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Question {current + 1} of {questions.length}
      </p>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="text-lg sm:text-xl font-bold text-foreground leading-snug">
            {q.question}
          </p>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] sm:text-base font-medium border-2 transition-all min-h-[52px] ${
                  selected === i
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      selected === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        onClick={handleNext}
        disabled={selected === null}
        className="w-full h-12 text-base font-semibold"
      >
        {current + 1 < questions.length ? (
          <>
            Next Question <ArrowRight className="ml-2 h-4 w-4" />
          </>
        ) : (
          "Submit Quiz"
        )}
      </Button>
    </div>
  );
};

export default FullQuiz;
