import { useRef, useEffect, useCallback } from "react";

interface BRollCardProps {
  mediaUrl: string;
  isActive: boolean;
  onEnded?: () => void;
}

export default function BRollCard({ mediaUrl, isActive, onEnded }: BRollCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [isActive]);

  // Auto-advance immediately on end (no delay for B-roll)
  const handleEnded = useCallback(() => {
    if (isActive) onEnded?.();
  }, [isActive, onEnded]);

  const handleError = useCallback(() => {
    // On error, skip this card immediately
    if (isActive) onEnded?.();
  }, [isActive, onEnded]);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{
        aspectRatio: "9/16",
        maxHeight: "50vh",
        borderRadius: 12,
      }}
    >
      <video
        ref={videoRef}
        src={mediaUrl}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        style={{ display: "block" }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 -40px 60px rgba(0,0,0,0.3)",
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  );
}
