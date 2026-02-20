import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import XpBadge from "./shared/XpBadge";
import SwipeHint from "./shared/SwipeHint";
import { triggerHaptic } from "@/lib/haptics";

interface ScenarioCardProps {
  scenario: string;
  options: string[];
  correct: number;
  explanation?: string;
  xpValue?: number;
  dir?: "ltr" | "rtl";
  onAnswered?: (correct: boolean) => void;
}

export default function ScenarioCard({
  scenario,
  options,
  correct,
  explanation,
  xpValue = 10,
  dir = "ltr",
  onAnswered,
}: ScenarioCardProps) {
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
    <div dir={dir} className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-border" style={{ background: "hsl(var(--card))" }}>
      <div className="h-1 w-full" style={{ background: "#EF6C00" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={xpValue} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />

        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#EF6C00" }}>
          🏗️ Scenario
        </p>

        {/* Scenario block */}
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: "#1e293b",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <p className="text-[15px] italic leading-relaxed text-white">{scenario}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
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
                  showCorrect ? { scale: [1, 1.02, 1] }
                  : showWrong ? { x: [-4, 4, -4, 4, 0] }
                  : {}
                }
                transition={{ duration: 0.35 }}
                className="w-full text-start px-4 rounded-xl border-2 text-sm font-medium transition-colors flex items-center gap-3"
                style={{
                  minHeight: 56,
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderColor: showCorrect ? "#10b981" : showWrong ? "#ef4444" : "hsl(var(--border))",
                  background: showCorrect ? "#065f46" : showWrong ? "#7f1d1d" : "hsl(var(--card))",
                  color: showCorrect || showWrong ? "white" : "hsl(var(--foreground))",
                }}
              >
                {isAnswered && showCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />}
                {isAnswered && showWrong && <XCircle className="h-4 w-4 shrink-0 text-red-300" />}
                {!isAnswered && (
                  <span className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                )}
                {opt}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && selected !== correct && explanation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm italic leading-relaxed text-red-400"
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
