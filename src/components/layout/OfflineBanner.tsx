import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-3 flex items-center gap-3"
        >
          <WifiOff className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium leading-snug">
            📴 You're offline — lessons and flashcards still work! Quiz scores
            will sync when you reconnect.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
