import { useRef, useEffect, useCallback } from "react";

interface BRollSlideProps {
  mediaUrl: string;
  isActive: boolean;
  muted: boolean;
  onEnded?: () => void;
}

export default function BRollSlide({ mediaUrl, isActive, muted, onEnded }: BRollSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.muted = muted;
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive, muted]);

  const handleEnded = useCallback(() => {
    if (isActive) {
      setTimeout(() => onEnded?.(), 500);
    }
  }, [isActive, onEnded]);

  const handleError = useCallback(() => {
    if (isActive) onEnded?.();
  }, [isActive, onEnded]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={mediaUrl}
        muted={muted}
        playsInline
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
          display: "block",
        }}
      />
      {/* Cinematic vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: "inset 0 -40px 60px rgba(0,0,0,0.3)",
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  );
}
