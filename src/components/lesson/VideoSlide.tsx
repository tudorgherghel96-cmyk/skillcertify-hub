import { useRef, useEffect, useState, useCallback } from "react";
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
  mediaUrl,
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

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = muted;
    if (isActive) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive, muted]);

  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    onTimeUpdate?.(vid.currentTime, vid.duration);
  }, [onTimeUpdate]);

  const handleRetry = () => {
    setError(false);
    const vid = videoRef.current;
    if (vid) {
      vid.load();
      vid.play().catch(() => {});
    }
  };

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
          src={mediaUrl}
          playsInline
          muted={muted}
          preload="auto"
          onLoadStart={() => { if (isActive) setLoading(true); }}
          onCanPlay={() => setLoading(false)}
          onWaiting={() => { if (isActive) setLoading(true); }}
          onPlaying={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
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
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Video unavailable</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, margin: 0, wordBreak: "break-all", maxWidth: 280, textAlign: "center" }}>{mediaUrl}</p>
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
      {!error && <MuteToggle muted={muted} onToggle={onMuteToggle} />}

      {/* Fourth-wall overlays */}
      {fourthWallEffect === "lean_in" && overlayText && (
        <LeanInCallout text={overlayText} videoRef={videoRef} />
      )}
      {fourthWallEffect === "hold_up" && overlayText && (
        <HoldUpCard text={overlayText} videoRef={videoRef} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
