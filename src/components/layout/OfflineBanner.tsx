import { useState, useEffect } from "react";
import { WifiOff, CloudOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSyncQueue } from "@/lib/offlineStorage";
import { flushSyncQueue } from "@/lib/offlineSync";

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncCount, setSyncCount] = useState(0);
  const [justSynced, setJustSynced] = useState(false);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = async () => {
      setIsOffline(false);
      // Auto-sync when back online
      const queue = getSyncQueue();
      if (queue.length > 0) {
        const synced = await flushSyncQueue();
        if (synced > 0) {
          setJustSynced(true);
          setTimeout(() => setJustSynced(false), 3000);
        }
      }
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // Update pending sync count
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncCount(getSyncQueue().length);
    }, 5000);
    setSyncCount(getSyncQueue().length);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-3 flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <WifiOff className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium leading-snug">
              Offline mode — your progress will sync when you're back online.
              {syncCount > 0 && ` (${syncCount} item${syncCount !== 1 ? "s" : ""} queued)`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {justSynced && !isOffline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <Check className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium">Progress synced successfully ✓</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineBanner;
