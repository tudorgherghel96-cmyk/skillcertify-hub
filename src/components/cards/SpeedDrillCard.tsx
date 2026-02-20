import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

interface DrillQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface SpeedDrillCardProps {
  questions: DrillQuestion[];
  xpValue?: number;
  dir?: "ltr" | "rtl";
  onComplete?: (score: number, total: number, xp: number) => void;
}

const SECONDS_PER_Q = 3;

export default function SpeedDrillCard({
  questions,
  xpValue = 20,
  dir = "ltr",
  onComplete,
}: SpeedDrillCardProps) {
  const drill = questions.slice(0, 6);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(drill.length).fill(null));
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const score = answers.filter(Boolean).length;

  const advance = useCallback((wasCorrect: boolean) => {
    setAnswers(prev => {
      const n = [...prev];
      n[idx] = wasCorrect;
      return n;
    });
    if (idx + 1 >= drill.length) {
      setDone(true);
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete?.(score + (wasCorrect ? 1 : 0), drill.length, xpValue);
    } else {
      setIdx(i => i + 1);
      setTimeLeft(SECONDS_PER_Q);
      setSelected(null);
    }
  }, [idx, drill.length, score, xpValue, onComplete]);

  // Countdown timer
  useEffect(() => {
    if (done) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          advance(false); // time out = wrong
          return SECONDS_PER_Q;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [idx, done, advance]);

  const handleAnswer = (optIdx: number) => {
    if (selected !== null || done) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(optIdx);
    const isCorrect = optIdx === drill[idx].correct;
    isCorrect ? triggerHaptic("success") : triggerHaptic("error");
    setTimeout(() => advance(isCorrect), 400);
  };

  const timerPct = timeLeft / SECONDS_PER_Q;

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Red accent top */}
      <div className="h-1 w-full" style={{ background: "#C62828" }} />

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#C62828" }}>
            ⚡ Speed Drill
          </p>
          <span className="text-xs font-semibold text-muted-foreground">
            {done ? `${score}/${drill.length}` : `Q${idx + 1}/${drill.length}`}
          </span>
        </div>

        {!done ? (
          <>
            {/* Circular countdown */}
            <div className="flex justify-center">
              <div className="relative h-14 w-14">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <motion.circle
                    cx="28" cy="28" r="24"
                    fill="none"
                    stroke="#C62828"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerPct)}`}
                    transition={{ duration: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black" style={{ color: "#C62828" }}>{timeLeft}</span>
                </div>
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-[16px] font-semibold text-foreground text-center leading-snug"
              >
                {drill[idx].question}
              </motion.p>
            </AnimatePresence>

            {/* Options */}
            <div className="grid grid-cols-2 gap-2">
              {drill[idx].options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === drill[idx].correct;
                return (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                    animate={
                      isSelected && isCorrect ? { scale: [1, 1.05, 1] }
                      : isSelected && !isCorrect ? { x: [-4, 4, -3, 3, 0] }
                      : {}
                    }
                    className="min-h-[48px] px-3 py-2 rounded-xl border-2 text-sm font-medium text-center transition-colors"
                    style={{
                      borderColor: isSelected
                        ? isCorrect ? "#4CAF50" : "#F44336"
                        : "hsl(var(--border))",
                      background: isSelected
                        ? isCorrect ? "#E8F5E9" : "#FFEBEE"
                        : "white",
                    }}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-3 py-4"
          >
            <p className="text-4xl font-black" style={{ color: "#C62828" }}>
              {score}/{drill.length}
            </p>
            <p className="text-sm text-muted-foreground">
              {score === drill.length ? "🔥 Perfect run!" : score >= drill.length / 2 ? "💪 Good effort!" : "📚 Keep practising!"}
            </p>
            <div className="flex gap-1.5 justify-center">
              {answers.map((a, i) => (
                <span key={i} className={`h-3 w-3 rounded-full ${a ? "bg-green-500" : "bg-red-400"}`} />
              ))}
            </div>
            <p className="text-sm font-bold" style={{ color: "#F9A825" }}>+{xpValue} XP</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
