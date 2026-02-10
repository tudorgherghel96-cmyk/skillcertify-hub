import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Sparkles, ArrowRight } from "lucide-react";
import type { SmartNudge } from "@/contexts/GamificationContext";

interface SmartNudgesProps {
  nudges: SmartNudge[];
}

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: Sparkles,
};

const colorMap = {
  warning: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
  success: "border-primary/30 bg-primary/5",
};

const iconColorMap = {
  warning: "text-amber-500",
  info: "text-blue-500",
  success: "text-primary",
};

const SmartNudges = ({ nudges }: SmartNudgesProps) => {
  if (nudges.length === 0) return null;

  return (
    <div className="space-y-2">
      {nudges.slice(0, 3).map((nudge, i) => {
        const Icon = iconMap[nudge.type];
        return (
          <motion.div
            key={nudge.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${colorMap[nudge.type]}`}
          >
            <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${iconColorMap[nudge.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-snug text-foreground">{nudge.message}</p>
              {nudge.action && nudge.actionLabel && (
                <Link
                  to={nudge.action}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-1 hover:underline"
                >
                  {nudge.actionLabel} <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SmartNudges;
