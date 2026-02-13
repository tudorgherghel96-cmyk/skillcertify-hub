import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";
import { useEffect, useState } from "react";

export default function XpPopup() {
  const { gamification, clearPendingXpPop } = useGamification();
  const pop = gamification.pendingXpPop;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pop) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        clearPendingXpPop();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pop, clearPendingXpPop]);

  return (
    <AnimatePresence>
      {visible && pop && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.6 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <span className="text-lg font-bold">+{pop.amount} XP</span>
            <span className="text-xs opacity-80">{pop.label}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
