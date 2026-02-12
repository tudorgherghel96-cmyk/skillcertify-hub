import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, ChevronUp, X } from "lucide-react";
import { getLessonVideoUrl } from "@/lib/media";

const STORAGE_KEY = "welcome-video-seen";

export default function WelcomeVideo() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) {
      // Already seen — start minimised
      setExpanded(false);
    } else {
      // First time — show expanded
      setExpanded(true);
    }
  }, []);

  const handleLoaded = () => {
    setLoading(false);
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setExpanded(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
    if (videoRef.current) videoRef.current.pause();
  };

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleVideoEnded = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setExpanded(false);
  };

  const videoUrl = getLessonVideoUrl("welcome");

  if (dismissed || error) return null;

  return (
    <motion.div
      layout
      className="glass-card rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Welcome Video</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                  aria-label="Minimise"
                >
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Video */}
            <div className="px-3 pb-3">
              <div className="rounded-xl overflow-hidden relative" style={{ backgroundColor: "hsl(var(--secondary))" }}>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className={`w-full h-auto rounded-xl transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                  onError={() => setError(true)}
                  onLoadedMetadata={handleLoaded}
                  onEnded={handleVideoEnded}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="minimised"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleExpand}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Play className="h-4 w-4 text-primary ml-0.5" />
            </div>
            <span className="text-sm font-medium text-foreground flex-1 text-left">Watch Welcome Video</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
