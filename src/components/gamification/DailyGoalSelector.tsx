import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/contexts/GamificationContext";
import { Timer } from "lucide-react";

const GOALS = [
  { label: "Casual", minutes: "5 minutes", xp: 20 },
  { label: "Regular", minutes: "10 minutes", xp: 50 },
  { label: "Serious", minutes: "15 minutes", xp: 100 },
  { label: "Intense", minutes: "20 minutes", xp: 150 },
];

interface DailyGoalSelectorProps {
  onComplete: () => void;
}

export default function DailyGoalSelector({ onComplete }: DailyGoalSelectorProps) {
  const { setDailyGoal } = useGamification();
  const [selected, setSelected] = useState(1);

  const handleConfirm = () => {
    setDailyGoal(GOALS[selected].xp);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-5"
      >
        <div className="text-center space-y-2">
          <Timer className="h-8 w-8 text-primary mx-auto" />
          <h2 className="text-lg font-bold text-foreground font-[Poppins]">
            Set your daily goal
          </h2>
          <p className="text-xs text-muted-foreground">
            How much time do you want to learn each day?
          </p>
        </div>

        <div className="space-y-2">
          {GOALS.map((goal, i) => (
            <button
              key={goal.label}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                selected === i
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{goal.minutes}</p>
                <p className="text-xs text-muted-foreground">{goal.label}</p>
              </div>
              <span className="text-xs font-bold text-primary">{goal.xp} XP/day</span>
            </button>
          ))}
        </div>

        <Button onClick={handleConfirm} className="w-full h-12 text-base font-semibold">
          Set Goal
        </Button>
      </motion.div>
    </motion.div>
  );
}
