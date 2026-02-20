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

  const handleEnded = useCallback(() => {
    if (isActive) onEnded?.();
  }, [isActive, onEnded]);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "9/16", maxHeight: "50vh" }}
    >
      {/* B-roll video */}
      <video
        ref={videoRef}
        src={mediaUrl}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
        onEnded={handleEnded}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
