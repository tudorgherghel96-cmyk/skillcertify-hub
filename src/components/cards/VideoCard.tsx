import { useRef, useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCardProps {
  mediaUrl: string;
  isActive: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (current: number, duration: number) => void;
  showEffect?: boolean;
  effectOverlayText?: string;
  fourthWallEffect?: "point_down" | "lean_in" | "hold_up" | "split_screen_compare" | null;
  /** Shared mute state across cards */
  muted?: boolean;
  onMuteChange?: (muted: boolean) => void;
}

export default function VideoCard({
  mediaUrl,
  isActive,
  onEnded,
  onTimeUpdate,
  showEffect = false,
  effectOverlayText,
  fourthWallEffect,
  muted: externalMuted,
  onMuteChange,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(externalMuted ?? true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external mute state
  useEffect(() => {
    if (externalMuted !== undefined) setMuted(externalMuted);
  }, [externalMuted]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      setHasError(false);
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

  const handleWaiting = useCallback(() => setIsBuffering(true), []);
  const handlePlaying = useCallback(() => setIsBuffering(false), []);
  const handleError = useCallback(() => setHasError(true), []);

  const toggleMute = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    const next = !vid.muted;
    vid.muted = next;
    setMuted(next);
    onMuteChange?.(next);
  }, [onMuteChange]);

  const handleRetry = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    setHasError(false);
    vid.load();
    vid.play().catch(() => {});
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        aspectRatio: "9/16",
        maxHeight: "65vh",
        marginBottom: 0,
        paddingBottom: 0,
        borderRadius: 0,
      }}
    >
      {!hasError ? (
        <>
          <video
            ref={videoRef}
            src={mediaUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted={muted}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onError={handleError}
            style={{ display: "block" }}
          />

          {/* Buffering spinner */}
          <AnimatePresence>
            {isBuffering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              >
                <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* Lean-in overlay */}
          <AnimatePresence>
            {showEffect && fourthWallEffect === "lean_in" && effectOverlayText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute z-20"
                style={{ bottom: "20%", left: "10%", right: "10%" }}
              >
                <div
                  className="rounded-xl px-5 py-4 text-base font-semibold text-white text-center leading-snug"
                  style={{
                    background: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 12,
                  }}
                >
                  {effectOverlayText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hold-up overlay */}
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
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: 8,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
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
              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            >
              <span className="text-white text-3xl drop-shadow-lg">↓</span>
            </motion.div>
          )}

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            onTouchEnd={toggleMute}
            className="absolute bottom-4 left-4 z-20 h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </>
      ) : (
        /* Error state */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <p className="text-white/60 text-sm">Video unavailable</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold active:scale-95 transition-transform"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
