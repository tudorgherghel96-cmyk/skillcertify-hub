import { useRef, useEffect, useState, useCallback } from "react";
import { getFallbackUrl, getBaseNameFromUrl, getPosterUrl } from "@/utils/mediaUtils";
import LeanInCallout from "./overlays/LeanInCallout";
import HoldUpCard from "./overlays/HoldUpCard";

interface VideoSlideProps {
  mediaUrl: string;
  isActive: boolean;
  muted: boolean;
  onMuteToggle: () => void;
  fourthWallEffect?: string | null;
  overlayText?: string | null;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export default function VideoSlide({
  mediaUrl: initialUrl,
  isActive,
  muted,
  onMuteToggle,
  fourthWallEffect,
  overlayText,
  onTimeUpdate,
}: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [tapForSound, setTapForSound] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_RETRIES = 2;

  // Reset state when the source URL changes (new card)
  useEffect(() => {
    setCurrentSrc(initialUrl);
    setError(false);
    setTriedFallback(false);
    setRetryCount(0);
    setTapForSound(false);
    setShowControls(false);
  }, [initialUrl]);

  // Autoplay logic — start muted for browser policy, unmute on onPlaying
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      // Start muted to satisfy autoplay policy, then unmute in onPlaying
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Even muted autoplay blocked — rare but handle it
          setTapForSound(true);
        });
      }
    } else {
      vid.pause();
      setShowControls(false);
    }
  }, [isActive, currentSrc]);

  // Once video starts playing, try to unmute (sound ON by default like TikTok)
  const handlePlaying = useCallback(() => {
    setLoading(false);
    const vid = videoRef.current;
    if (!vid) return;

    if (!muted) {
      // Try to unmute — if browser blocks, keep muted and show tap-for-sound
      vid.muted = false;
      // Some browsers will pause if unmuting isn't allowed — check after a tick
      setTimeout(() => {
        if (vid.paused && isActive) {
          vid.muted = true;
          vid.play().catch(() => {});
          setTapForSound(true);
        }
      }, 50);
    } else {
      vid.muted = true;
    }
  }, [muted, isActive]);

  // Sync muted prop changes (from parent toggle)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !isActive) return;
    vid.muted = muted;
    if (!muted) setTapForSound(false);
  }, [muted, isActive]);

  // When user taps the "tap for sound" indicator, unmute via parent
  const handleTapForSound = useCallback(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.play().catch(() => {});
    }
    setTapForSound(false);
    if (muted) onMuteToggle();
  }, [muted, onMuteToggle]);

  // Tap video to toggle play/pause and show controls briefly
  const handleVideoTap = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }

    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    onTimeUpdate?.(vid.currentTime, vid.duration);
  }, [onTimeUpdate]);

  const handleError = useCallback(() => {
    // Try 480p fallback first
    if (!triedFallback) {
      const fallback = getFallbackUrl(currentSrc);
      if (fallback) {
        setTriedFallback(true);
        setCurrentSrc(fallback);
        return;
      }
    }
    // Auto-retry before giving up (handles transient mobile network issues)
    if (retryCount < MAX_RETRIES) {
      setRetryCount((c) => c + 1);
      const vid = videoRef.current;
      if (vid) {
        setTimeout(() => {
          vid.load();
          vid.muted = true;
          vid.play().catch(() => {});
        }, 500 * (retryCount + 1));
      }
      return;
    }
    setError(true);
    setLoading(false);
  }, [currentSrc, triedFallback, retryCount]);

  const handleRetry = () => {
    setError(false);
    setTriedFallback(false);
    setCurrentSrc(initialUrl);
    setTimeout(() => {
      const vid = videoRef.current;
      if (vid) {
        vid.load();
        vid.muted = true;
        vid.play().catch(() => {});
      }
    }, 50);
  };

  const baseName = getBaseNameFromUrl(currentSrc);
  const posterSrc = baseName ? getPosterUrl(baseName) : undefined;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!error && (
        <video
          ref={videoRef}
          src={currentSrc}
          poster={posterSrc}
          autoPlay
          playsInline
          muted
          crossOrigin="anonymous"
          preload="auto"
          onLoadStart={() => { if (isActive) setLoading(true); }}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => { if (isActive) setLoading(true); }}
          onPlaying={handlePlaying}
          onError={handleError}
          onTimeUpdate={handleTimeUpdate}
          onClick={handleVideoTap}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "#000",
            display: "block",
            cursor: "pointer",
          }}
        />
      )}

      {/* Tap for sound indicator */}
      {tapForSound && !error && (
        <button
          onClick={handleTapForSound}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 20,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            animation: "tapPulse 2s ease-in-out infinite",
          }}
        >
          🔊 Tap for sound
        </button>
      )}

      {/* Mute toggle */}
      {!error && !tapForSound && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 20,
            opacity: showControls ? 1 : 0.6,
            transition: "opacity 0.3s",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 18,
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      )}

      {/* Loading spinner */}
      {loading && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid rgba(255,255,255,0.2)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {posterSrc && (
            <img
              src={posterSrc}
              alt=""
              style={{ maxWidth: "80%", maxHeight: "60%", objectFit: "contain", borderRadius: 8, marginBottom: 8 }}
            />
          )}
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Video unavailable</p>
          <button
            onClick={handleRetry}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "10px 24px",
              borderRadius: 12,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Tap to retry
          </button>
        </div>
      )}

      {/* Fourth-wall overlays */}
      {fourthWallEffect === "lean_in" && overlayText && (
        <LeanInCallout text={overlayText} videoRef={videoRef} />
      )}
      {fourthWallEffect === "hold_up" && overlayText && (
        <HoldUpCard text={overlayText} videoRef={videoRef} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tapPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}
