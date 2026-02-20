import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface LevelUpToastProps {
  level: number | null;
  onDone: () => void;
}

export default function LevelUpToast({ level, onDone }: LevelUpToastProps) {
  useEffect(() => {
    if (!level) return;
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [level, onDone]);

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          key={level}
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="fixed inset-x-4 bottom-24 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="flex items-center gap-3 bg-primary text-primary-foreground rounded-2xl px-6 py-4 shadow-2xl shadow-primary/40">
            <Star className="h-7 w-7 fill-current shrink-0 opacity-70" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Level up!</p>
              <p className="text-2xl font-extrabold leading-tight">Level {level}</p>
            </div>
            <Star className="h-7 w-7 fill-current shrink-0 opacity-70" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
