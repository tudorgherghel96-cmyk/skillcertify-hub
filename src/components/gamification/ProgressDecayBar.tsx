import { motion } from "framer-motion";
import {
  calculateDecayedStrength,
  getStrengthColor,
  getStrengthLabel,
} from "@/contexts/GamificationContext";

interface ProgressDecayBarProps {
  lastReviewed: string;
  onReview?: () => void;
}

export default function ProgressDecayBar({ lastReviewed, onReview }: ProgressDecayBarProps) {
  const strength = calculateDecayedStrength(lastReviewed);
  const color = getStrengthColor(strength);
  const label = getStrengthLabel(strength);

  return (
    <div className="space-y-1">
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {label && (
        <button
          onClick={onReview}
          className="text-[10px] font-semibold text-destructive hover:underline"
        >
          ⚠ {label}
        </button>
      )}
    </div>
  );
}
