import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/data/quizQuestions";
import { triggerHaptic } from "@/lib/haptics";

interface SpeedChallengeProps {
  questions: QuizQuestion[];
  onClose: () => void;
  onConceptAttempt?: (conceptSlug: string, isCorrect: boolean, responseTimeMs: number) => void;
}

const DURATION = 60; // seconds
const FREEZE_PENALTY = 3; // seconds

const SpeedChallenge = ({ questions, onClose, onConceptAttempt }: SpeedChallengeProps) => {
  const [phase, setPhase] = useState<"countdown" | "playing" | "done">("countdown");
  const [countdownNum, setCountdownNum] = useState(3);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("sc_speed_best") || "0", 10);
    } catch {
      return 0;
    }
  });
  const questionStartRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const shuffledRef = useRef<QuizQuestion[]>([]);

  // Shuffle questions once
  useEffect(() => {
    shuffledRef.current = [...questions].sort(() => Math.random() - 0.5);
  }, [questions]);

  // Countdown phase
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownNum <= 0) {
      setPhase("playing");
      questionStartRef.current = Date.now();
      return;
    }
    const t = setTimeout(() => setCountdownNum((n) => n - 1), 800);
    return () => clearTimeout(t);
  }, [phase, countdownNum]);

  // Game timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Save best on finish
  useEffect(() => {
    if (phase === "done" && score > bestScore) {
      setBestScore(score);
      localStorage.setItem("sc_speed_best", String(score));
    }
  }, [phase, score, bestScore]);

  const q = shuffledRef.current[currentIdx % Math.max(1, shuffledRef.current.length)];

  const handleSelect = (index: number) => {
    if (frozen || phase !== "playing" || !q) return;
    const isCorrect = index === q.correctIndex;
    const responseTime = Date.now() - questionStartRef.current;
    onConceptAttempt?.(q.conceptSlug, isCorrect, responseTime);

    if (isCorrect) {
      setScore((s) => s + 1);
      setFlash("correct");
      triggerHaptic("success");
      setTimeout(() => {
        setFlash(null);
        setCurrentIdx((i) => i + 1);
        questionStartRef.current = Date.now();
      }, 300);
    } else {
      setFlash("wrong");
      triggerHaptic("error");
      setFrozen(true);
      // Penalty freeze
      setTimeout(() => {
        setFrozen(false);
        setFlash(null);
        setCurrentIdx((i) => i + 1);
        questionStartRef.current = Date.now();
      }, FREEZE_PENALTY * 1000);
    }
  };

  const restart = () => {
    shuffledRef.current = [...questions].sort(() => Math.random() - 0.5);
    setPhase("countdown");
    setCountdownNum(3);
    setTimeLeft(DURATION);
    setScore(0);
    setCurrentIdx(0);
    setFrozen(false);
    setFlash(null);
  };

  // Countdown screen
  if (phase === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Zap className="h-10 w-10 text-primary" />
        <motion.span
          key={countdownNum}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="text-6xl font-black text-foreground"
        >
          {countdownNum || "GO!"}
        </motion.span>
        <p className="text-sm text-muted-foreground">Answer as many as you can in 60 seconds</p>
      </div>
    );
  }

  // Done screen
  if (phase === "done") {
    const isNewBest = score >= bestScore && score > 0;
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-5 py-8"
      >
        <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <div>
          <p className="text-4xl font-black text-foreground">{score}</p>
          <p className="text-sm text-muted-foreground">correct in 60 seconds</p>
        </div>
        {isNewBest && (
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-primary font-bold text-sm"
          >
            🎉 New personal best!
          </motion.p>
        )}
        <p className="text-xs text-muted-foreground">
          Your best: {bestScore} · Beat it next time!
        </p>
        <div className="flex gap-2 max-w-xs mx-auto">
          <Button variant="outline" onClick={onClose} className="flex-1 min-h-[52px]">
            Done
          </Button>
          <Button onClick={restart} className="flex-1 min-h-[52px]">
            <RotateCcw className="mr-2 h-4 w-4" /> Again
          </Button>
        </div>
      </motion.div>
    );
  }

  // Playing screen
  if (!q) return null;

  const pct = timeLeft / DURATION;

  return (
    <div className="space-y-4">
      {/* Timer bar + score */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
        <span className={`text-sm font-mono font-bold shrink-0 ${timeLeft < 10 ? "text-destructive" : "text-muted-foreground"}`}>
          {timeLeft}s
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-2xl font-black text-foreground">{score}</span>
        </div>
        {frozen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold text-destructive"
          >
            ❌ {FREEZE_PENALTY}s penalty
          </motion.span>
        )}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          <p className="text-lg font-bold text-foreground leading-snug">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let bg = "border-border bg-card text-foreground";
              if (flash === "correct" && i === q.correctIndex) bg = "border-primary bg-primary/10 text-foreground";
              if (flash === "wrong" && i === q.correctIndex) bg = "border-primary bg-primary/10 text-foreground";

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={frozen}
                  whileTap={!frozen ? { scale: 0.97 } : undefined}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border-2 transition-colors min-h-[48px] ${bg} ${frozen ? "opacity-50" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <Button variant="ghost" size="sm" onClick={onClose} className="w-full min-h-[44px]">
        Quit
      </Button>
    </div>
  );
};

export default SpeedChallenge;
