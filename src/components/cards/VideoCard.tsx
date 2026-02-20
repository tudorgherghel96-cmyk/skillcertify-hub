import { useRef, useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCardProps {
  mediaUrl: string;
  isActive: boolean;
  onEnded?: () => void;
  /** fourth-wall effect overlay text (for lean_in / hold_up effects) */
  effectOverlayText?: string;
  fourthWallEffect?: "point_down" | "lean_in" | "hold_up" | "split_screen_compare" | null;
}

export default function VideoCard({
  mediaUrl,
  isActive,
  onEnded,
  effectOverlayText,
  fourthWallEffect,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play/pause based on active state
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      vid.play().catch(() => {/* autoplay blocked */});
    } else {
      vid.pause();
      vid.currentTime = 0;
      setProgress(0);
    }
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [isActive]);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress(vid.currentTime / vid.duration);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const vid = videoRef.current;
    if (vid) setDuration(vid.duration);
  }, []);

  const handleEnded = useCallback(() => {
    if (!isActive) return;
    advanceTimer.current = setTimeout(() => {
      onEnded?.();
    }, 500);
  }, [isActive, onEnded]);

  const toggleMute = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        aspectRatio: "9/16",
        maxHeight: "65vh",
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={mediaUrl}
        className="absolute inset-0 w-full h-full object-cover"
        muted={muted}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Instagram-style progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-2 pt-2">
        <div className="w-full h-[3px] rounded-full bg-white/25 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #22c55e, #16a34a)",
              width: `${progress * 100}%`,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Fourth-wall overlay text (lean_in / hold_up) */}
      <AnimatePresence>
        {effectOverlayText && (fourthWallEffect === "lean_in" || fourthWallEffect === "hold_up") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 left-0 right-0 flex justify-center z-20 px-4"
          >
            <div className="bg-black/60 text-white text-sm font-semibold px-4 py-2 rounded-2xl text-center max-w-[80%]">
              {effectOverlayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Point-down arrow cue */}
      {fourthWallEffect === "point_down" && (
        <motion.div
          className="absolute bottom-16 left-0 right-0 flex justify-center z-20 pointer-events-none"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <span className="text-white text-3xl drop-shadow-lg">↓</span>
        </motion.div>
      )}

      {/* Mute/unmute — bottom left only */}
      <button
        onClick={toggleMute}
        onTouchEnd={toggleMute}
        className="absolute bottom-4 left-4 z-20 h-9 w-9 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
