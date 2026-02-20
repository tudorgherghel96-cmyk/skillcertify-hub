import { motion, AnimatePresence } from "framer-motion";

interface XpBadgeProps {
  xp: number;
  show: boolean;
  /** Position hint — defaults to top-right */
  position?: "top-right" | "top-left";
}

export default function XpBadge({ xp, show, position = "top-right" }: XpBadgeProps) {
  const posClass = position === "top-right"
    ? "top-3 right-3"
    : "top-3 left-3";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.7 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className={`absolute ${posClass} z-20 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow-md`}
        >
          +{xp} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
