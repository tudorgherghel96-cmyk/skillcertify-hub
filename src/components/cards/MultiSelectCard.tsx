import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import XpBadge from "./shared/XpBadge";
import SwipeHint from "./shared/SwipeHint";
import { triggerHaptic } from "@/lib/haptics";

interface MultiSelectCardProps {
  question: string;
  options: string[];
  /** Indices of all correct answers */
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

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Blue accent (same family as QuickCheck) */}
      <div className="h-1 w-full" style={{ background: "#1565C0" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={totalXp} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />

        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#1565C0" }}>
            ☑ Select All That Apply
          </p>
          <p className="text-[18px] font-bold text-foreground leading-snug">{question}</p>
        </div>

        <div className="space-y-2.5">
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
                className="w-full text-start px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors min-h-[48px] flex items-center gap-3"
                style={{
                  borderColor: showCorrect || showMissed
                    ? "#4CAF50"
                    : showWrong
                    ? "#F44336"
                    : isToggled
                    ? "#1565C0"
                    : "hsl(var(--border))",
                  background: showCorrect
                    ? "#E8F5E9"
                    : showWrong
                    ? "#FFEBEE"
                    : showMissed
                    ? "#F1F8E9"
                    : isToggled
                    ? "rgba(21,101,192,0.07)"
                    : "white",
                }}
              >
                {/* Checkbox */}
                <span
                  className="h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: showCorrect || showMissed
                      ? "#4CAF50"
                      : showWrong
                      ? "#F44336"
                      : isToggled
                      ? "#1565C0"
                      : "hsl(var(--border))",
                    background: isToggled && !submitted
                      ? "#1565C0"
                      : showCorrect
                      ? "#4CAF50"
                      : "transparent",
                  }}
                >
                  {(isToggled || showCorrect) && (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  )}
                  {showWrong && <XCircle className="h-3 w-3" style={{ color: "#F44336" }} />}
                </span>
                <span style={{ color: showWrong ? "#B71C1C" : showMissed ? "#2E7D32" : "hsl(var(--foreground))" }}>
                  {opt}
                  {showMissed && <span className="text-xs ml-1 font-normal opacity-70">(missed)</span>}
                </span>
              </button>
            );
          })}
        </div>

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
              Submit Answers
            </motion.button>
          )}
        </AnimatePresence>

        <SwipeHint show={showHint} />
      </div>
    </div>
  );
}
