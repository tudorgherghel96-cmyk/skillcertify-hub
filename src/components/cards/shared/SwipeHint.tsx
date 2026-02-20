import { motion, AnimatePresence } from "framer-motion";

export default function SwipeHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-xs text-muted-foreground/60 mt-4 select-none"
        >
          Swipe up to continue ↑
        </motion.p>
      )}
    </AnimatePresence>
  );
}
