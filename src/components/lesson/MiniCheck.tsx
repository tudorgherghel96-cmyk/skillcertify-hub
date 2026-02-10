import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MiniCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  feedback?: string;
  onAnswer?: (correct: boolean) => void;
}

const MiniCheck = ({ question, options, correctIndex, feedback, onAnswer }: MiniCheckProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = selected !== null;
  const isCorrect = selected === correctIndex;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelected(index);
    onAnswer?.(index === correctIndex);
  };

  return (
    <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 bg-primary/5">
      <div className="flex items-start gap-2 mb-3">
        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="font-semibold text-sm text-foreground">Quick Check</p>
      </div>
      <p className="text-[15px] font-medium text-foreground mb-3">{question}</p>

      <div className="space-y-2">
        {options.map((opt, i) => {
          const isThis = selected === i;
          const showCorrect = isAnswered && i === correctIndex;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                isAnswered
                  ? showCorrect
                    ? "border-primary bg-primary/10 text-foreground"
                    : isThis
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : "border-border bg-muted/50 text-muted-foreground"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                {isAnswered && showCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                )}
                {isAnswered && isThis && !showCorrect && (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                )}
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mt-3 text-sm font-medium rounded-lg px-3 py-2 ${
              isCorrect
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {feedback
              ? (isCorrect ? "✓ " : "✗ ") + feedback
              : isCorrect
              ? "✓ Correct! Keep going."
              : `✗ The correct answer is: ${options[correctIndex]}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniCheck;
