import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import XpBadge from "./shared/XpBadge";
import SwipeHint from "./shared/SwipeHint";
import { triggerHaptic } from "@/lib/haptics";

interface QuickCheckCardProps {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  xpValue?: number;
  dir?: "ltr" | "rtl";
  onAnswered?: (correct: boolean) => void;
}

export default function QuickCheckCard({
  question,
  options,
  correct,
  explanation,
  xpValue = 10,
  dir = "ltr",
  onAnswered,
}: QuickCheckCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAnswered = selected !== null;

  const handleSelect = (i: number) => {
    if (isAnswered) return;
    setSelected(i);
    const isCorrect = i === correct;

    if (isCorrect) {
      triggerHaptic("success");
      setShowXp(true);
    } else {
      triggerHaptic("error");
    }

    onAnswered?.(isCorrect);

    hintTimer.current = setTimeout(() => setShowHint(true), 1500);
  };

  useEffect(() => () => { if (hintTimer.current) clearTimeout(hintTimer.current); }, []);

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Blue accent top */}
      <div className="h-1 w-full" style={{ background: "#1565C0" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={xpValue} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />

        {/* Question */}
        <p className="text-[18px] font-bold text-foreground leading-snug">{question}</p>

        {/* Options */}
        <div className="space-y-2.5">
          {options.map((opt, i) => {
            const isThis = selected === i;
            const isCorrectOpt = i === correct;
            const showCorrect = isAnswered && isCorrectOpt;
            const showWrong = isAnswered && isThis && !isCorrectOpt;

            return (
              <motion.button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                animate={
                  showCorrect && isAnswered
                    ? { scale: [1, 1.05, 1] }
                    : showWrong
                    ? { x: [-5, 5, -3, 3, 0] }
                    : {}
                }
                transition={{ duration: 0.35 }}
                className="w-full text-start px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors min-h-[48px] flex items-center gap-3"
                style={{
                  borderColor: showCorrect
                    ? "#4CAF50"
                    : showWrong
                    ? "#F44336"
                    : "hsl(var(--border))",
                  background: showCorrect
                    ? "#E8F5E9"
                    : showWrong
                    ? "#FFEBEE"
                    : "white",
                  color: showCorrect
                    ? "#1B5E20"
                    : showWrong
                    ? "#B71C1C"
                    : "hsl(var(--foreground))",
                }}
              >
                {isAnswered && showCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#4CAF50" }} />}
                {isAnswered && showWrong && <XCircle className="h-4 w-4 shrink-0" style={{ color: "#F44336" }} />}
                {!isAnswered && (
                  <span className="h-6 w-6 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                )}
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation on wrong */}
        <AnimatePresence>
          {isAnswered && selected !== correct && explanation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm italic leading-relaxed"
              style={{ color: "#C62828" }}
            >
              {explanation}
            </motion.p>
          )}
        </AnimatePresence>

        <SwipeHint show={showHint} />
      </div>
    </div>
  );
}
