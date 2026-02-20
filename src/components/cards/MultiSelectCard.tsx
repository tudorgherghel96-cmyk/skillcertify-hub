import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import XpBadge from "./shared/XpBadge";
import SwipeHint from "./shared/SwipeHint";
import { triggerHaptic } from "@/lib/haptics";

interface MultiSelectCardProps {
  question: string;
  options: string[];
  correctIndices: number[];
  xpPerCorrect?: number;
  dir?: "ltr" | "rtl";
  onAnswered?: (score: number, total: number) => void;
}

export default function MultiSelectCard({
  question,
  options,
  correctIndices,
  xpPerCorrect = 5,
  dir = "ltr",
  onAnswered,
}: MultiSelectCardProps) {
  const [toggled, setToggled] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (i: number) => {
    if (submitted) return;
    setToggled(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const handleSubmit = () => {
    if (toggled.size === 0 || submitted) return;
    setSubmitted(true);

    let correct = 0;
    toggled.forEach(i => {
      if (correctIndices.includes(i)) correct++;
    });

    const xp = correct * xpPerCorrect;
    setTotalXp(xp);
    if (xp > 0) {
      setShowXp(true);
      triggerHaptic("success");
    } else {
      triggerHaptic("error");
    }
    onAnswered?.(correct, correctIndices.length);
    hintTimer.current = setTimeout(() => setShowHint(true), 1500);
  };

  useEffect(() => () => { if (hintTimer.current) clearTimeout(hintTimer.current); }, []);

  const correctCount = Array.from(toggled).filter(i => correctIndices.includes(i)).length;

  return (
    <div dir={dir} className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-border" style={{ background: "hsl(var(--card))" }}>
      <div className="h-1 w-full" style={{ background: "#1565C0" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={totalXp} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />

        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#1565C0" }}>
            ☑ Select All That Apply
          </p>
          <p className="text-[18px] font-bold text-foreground leading-snug">{question}</p>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => {
            const isToggled = toggled.has(i);
            const isCorrect = correctIndices.includes(i);
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isToggled && !isCorrect;
            const showMissed = submitted && !isToggled && isCorrect;

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => toggle(i)}
                className="w-full text-start px-4 rounded-xl border-2 text-sm font-medium transition-colors flex items-center gap-3"
                style={{
                  minHeight: 56,
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderColor: showCorrect || showMissed
                    ? "#10b981"
                    : showWrong
                    ? "#ef4444"
                    : isToggled
                    ? "#1565C0"
                    : "hsl(var(--border))",
                  background: showCorrect
                    ? "#065f46"
                    : showWrong
                    ? "#7f1d1d"
                    : showMissed
                    ? "#064e3b"
                    : isToggled
                    ? "rgba(21,101,192,0.15)"
                    : "hsl(var(--card))",
                  color: showCorrect || showWrong || showMissed ? "white" : "hsl(var(--foreground))",
                }}
              >
                <span
                  className="h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: showCorrect || showMissed ? "#10b981" : showWrong ? "#ef4444" : isToggled ? "#1565C0" : "hsl(var(--border))",
                    background: (isToggled && !submitted) ? "#1565C0" : showCorrect || showMissed ? "#10b981" : "transparent",
                  }}
                >
                  {(isToggled || showCorrect || showMissed) && <CheckCircle2 className="h-3 w-3 text-white" />}
                  {showWrong && <XCircle className="h-3 w-3 text-red-300" />}
                </span>
                <span>
                  {opt}
                  {showMissed && <span className="text-xs ml-1 font-normal opacity-70">(missed)</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Score after submission */}
        <AnimatePresence>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm font-bold"
              style={{ color: correctCount === correctIndices.length ? "#10b981" : "#f59e0b" }}
            >
              {correctCount}/{correctIndices.length} correct
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <AnimatePresence>
          {!submitted && toggled.size > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-transform active:scale-[0.98]"
              style={{ background: "#1565C0" }}
            >
              Check Answer
            </motion.button>
          )}
        </AnimatePresence>

        <SwipeHint show={showHint} />
      </div>
    </div>
  );
}
