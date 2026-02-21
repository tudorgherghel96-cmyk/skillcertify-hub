import { useRef, useEffect, useState, useCallback } from "react";
import { getFallbackUrl, getBaseNameFromUrl, getPosterUrl } from "@/utils/mediaUtils";
import MuteToggle from "./ui/MuteToggle";
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
  const [tapForSound, setTapForSound] = useState(false);

  // Reset state when the source URL changes (new card)
  useEffect(() => {
    setCurrentSrc(initialUrl);
    setError(false);
    setTriedFallback(false);
    setTapForSound(false);
  }, [initialUrl]);

  // Autoplay logic — play with sound, fallback to muted if blocked
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      vid.muted = muted;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === "NotAllowedError") {
            // Browser blocked unmuted autoplay — mute and retry
            vid.muted = true;
            vid.play().catch(() => {});
            setTapForSound(true);
          }
        });
      }
    } else {
      vid.pause();
    }
  }, [isActive, muted, currentSrc]);

  // When user taps the "tap for sound" overlay, unmute
  const handleTapForSound = useCallback(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.play().catch(() => {});
    }
    setTapForSound(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    onTimeUpdate?.(vid.currentTime, vid.duration);
  }, [onTimeUpdate]);

  const handleError = useCallback(() => {
    if (!triedFallback) {
      const fallback = getFallbackUrl(currentSrc);
      if (fallback) {
        setTriedFallback(true);
        setCurrentSrc(fallback);
        return;
      }
    }
    setError(true);
    setLoading(false);
  }, [currentSrc, triedFallback]);

  const handleRetry = () => {
    setError(false);
    setTriedFallback(false);
    setCurrentSrc(initialUrl);
    setTimeout(() => {
      const vid = videoRef.current;
      if (vid) {
        vid.load();
        vid.play().catch(() => {});
      }
    }, 50);
  };

  // Derive poster URL from the video base name
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
          controls
          muted={muted}
          crossOrigin="anonymous"
          preload="auto"
          onLoadStart={() => { if (isActive) setLoading(true); }}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => { if (isActive) setLoading(true); }}
          onPlaying={() => setLoading(false)}
          onError={handleError}
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "#000",
            display: "block",
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

      {/* Error state — show poster if available */}
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

      {/* Mute toggle */}
      {!error && !tapForSound && <MuteToggle muted={muted} onToggle={onMuteToggle} />}

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
