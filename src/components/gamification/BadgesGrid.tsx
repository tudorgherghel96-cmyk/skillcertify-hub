import { motion } from "framer-motion";
import type { Badge } from "@/contexts/GamificationContext";

interface BadgesGridProps {
  badges: Badge[];
}

const BadgesGrid = ({ badges }: BadgesGridProps) => {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-sm">Badges</h2>
        <span className="text-xs text-muted-foreground">
          {earned.length}/{badges.length} earned
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center ${
              badge.earned
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/30 opacity-40"
            }`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="text-[9px] font-semibold leading-tight line-clamp-2">
              {badge.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BadgesGrid;
