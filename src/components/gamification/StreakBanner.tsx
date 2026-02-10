import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBannerProps {
  streak: number;
}

const StreakBanner = ({ streak }: StreakBannerProps) => {
  if (streak < 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 px-4 py-3"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Flame className="h-5 w-5 text-orange-500" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          🔥 {streak} day{streak !== 1 ? "s" : ""} in a row!
        </p>
        <p className="text-xs text-muted-foreground">
          Your memory gets stronger every day.
        </p>
      </div>
    </motion.div>
  );
};

export default StreakBanner;
