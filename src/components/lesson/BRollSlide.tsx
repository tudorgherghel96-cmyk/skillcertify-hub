import { useRef, useEffect, useState, useCallback } from "react";
import { getFallbackUrl, getBaseNameFromUrl, getPosterUrl } from "@/utils/mediaUtils";

interface BRollSlideProps {
  mediaUrl: string;
  isActive: boolean;
  muted: boolean;
  onEnded?: () => void;
}

export default function BRollSlide({ mediaUrl: initialUrl, isActive, muted, onEnded }: BRollSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSrc, setCurrentSrc] = useState(initialUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [error, setError] = useState(false);

  // Reset on new source
  useEffect(() => {
    setCurrentSrc(initialUrl);
    setError(false);
    setTriedFallback(false);
  }, [initialUrl]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || error) return;
    if (isActive) {
      vid.muted = muted;
      vid.currentTime = 0;
      const p = vid.play();
      if (p !== undefined) {
        p.catch((err) => {
          if (err.name === "NotAllowedError") {
            vid.muted = true;
            vid.play().catch(() => {});
          }
        });
      }
    } else {
      vid.pause();
    }
  }, [isActive, muted, currentSrc, error]);

  const handleEnded = useCallback(() => {
    if (isActive) {
      setTimeout(() => onEnded?.(), 500);
    }
  }, [isActive, onEnded]);

  const handleError = useCallback(() => {
    if (!triedFallback) {
      const fallback = getFallbackUrl(currentSrc);
      if (fallback) {
        setTriedFallback(true);
        setCurrentSrc(fallback);
        return;
      }
    }
    // Both failed — auto-advance
    setError(true);
    if (isActive) onEnded?.();
  }, [currentSrc, triedFallback, isActive, onEnded]);

  const baseName = getBaseNameFromUrl(currentSrc);
  const posterSrc = baseName ? getPosterUrl(baseName) : undefined;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000", overflow: "hidden" }}>
      {!error && (
        <video
          ref={videoRef}
          src={currentSrc}
          poster={posterSrc}
          autoPlay
          muted={muted}
          playsInline
          crossOrigin="anonymous"
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
      )}
      {error && posterSrc && (
        <img
          src={posterSrc}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
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
