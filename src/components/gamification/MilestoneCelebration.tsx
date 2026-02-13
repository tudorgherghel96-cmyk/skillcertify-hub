import { motion, AnimatePresence } from "framer-motion";
import { useGamification, MILESTONES } from "@/contexts/GamificationContext";
import { triggerHaptic } from "@/lib/haptics";
import { useEffect } from "react";

export default function MilestoneCelebration() {
  const { gamification, clearPendingMilestone } = useGamification();
  const milestoneId = gamification.pendingMilestone;
  const milestone = milestoneId ? MILESTONES[milestoneId] : null;

  useEffect(() => {
    if (milestone) {
      triggerHaptic("success");
    }
  }, [milestone]);

  if (!milestone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={clearPendingMilestone}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="bg-card rounded-2xl border border-border p-8 max-w-sm w-full text-center shadow-xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: 2, duration: 0.5 }}
            className="text-6xl"
          >
            {milestone.emoji}
          </motion.div>

          <h2 className="text-xl font-bold text-foreground font-[Poppins]">
            {milestone.title}
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {milestone.message}
          </p>

          {/* Confetti dots */}
          <div className="relative h-8 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(205 91% 43%)", "#f59e0b", "#10b981"][i % 5],
                  left: `${(i / 12) * 100}%`,
                }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: [-20, 30], opacity: [1, 0] }}
                transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </div>

          <button
            onClick={clearPendingMilestone}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
