import { useRef, useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCardProps {
  mediaUrl: string;
  isActive: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (current: number, duration: number) => void;
  /** Controlled by parent — true once timed threshold passes */
  showEffect?: boolean;
  effectOverlayText?: string;
  fourthWallEffect?: "point_down" | "lean_in" | "hold_up" | "split_screen_compare" | null;
}

export default function VideoCard({
  mediaUrl,
  isActive,
  onEnded,
  onTimeUpdate,
  showEffect = false,
  effectOverlayText,
  fourthWallEffect,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
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
    onTimeUpdate?.(vid.currentTime, vid.duration);
  }, [onTimeUpdate]);

  const handleEnded = useCallback(() => {
    if (!isActive) return;
    advanceTimer.current = setTimeout(() => onEnded?.(), 500);
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
      style={{ aspectRatio: "9/16", maxHeight: "65vh", marginBottom: 0, paddingBottom: 0 }}
    >
      <video
        ref={videoRef}
        src={mediaUrl}
        className="absolute inset-0 w-full h-full object-cover"
        muted={muted}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Stories progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-2 pt-2">
        <div className="w-full h-[3px] rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
              width: `${progress * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ── Lean-in overlay (bottom callout) ── */}
      <AnimatePresence>
        {showEffect && fourthWallEffect === "lean_in" && effectOverlayText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute z-20"
            style={{ bottom: "18%", left: "6%", right: "6%" }}
          >
            <div
              className="rounded-lg px-4 py-3 text-sm text-foreground font-medium leading-snug"
              style={{
                background: "white",
                borderLeft: "4px solid #2E7D32",
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              }}
            >
              {effectOverlayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hold-up overlay (centred card illusion) ── */}
      <AnimatePresence>
        {showEffect && fourthWallEffect === "hold_up" && effectOverlayText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute z-20"
            style={{ top: "22%", left: "28%", width: "44%" }}
          >
            <div
              className="rounded-lg px-4 py-3 text-sm font-bold text-gray-900 text-center leading-snug"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
            >
              {effectOverlayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Point-down arrow cue ── */}
      {fourthWallEffect === "point_down" && (
        <motion.div
          className="absolute bottom-16 left-0 right-0 flex justify-center z-20 pointer-events-none"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        >
          <span className="text-white text-3xl drop-shadow-lg">↓</span>
        </motion.div>
      )}

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        onTouchEnd={toggleMute}
        className="absolute bottom-4 left-4 z-20 h-9 w-9 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
