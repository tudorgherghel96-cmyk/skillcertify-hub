import { motion } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";

export default function DailyGoalRing() {
  const { gamification } = useGamification();
  const { dailyXp, dailyGoal, dailyGoalSet } = gamification;

  if (!dailyGoalSet) return null;

  const progress = Math.min(dailyXp / dailyGoal, 1);
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference * (1 - progress);
  const completed = progress >= 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r="42"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          <motion.circle
            cx="48" cy="48" r="42"
            fill="none"
            stroke={completed ? "hsl(var(--primary))" : "hsl(205 91% 43%)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground">{dailyXp}</span>
          <span className="text-[10px] text-muted-foreground">/ {dailyGoal} XP</span>
        </div>
      </div>
      {completed && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-semibold text-primary"
        >
          🔥 Goal smashed!
        </motion.p>
      )}
    </div>
  );
}
