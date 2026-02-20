import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ImageCardProps {
  src: string;
  alt?: string;
  caption?: string;
  isActive: boolean;
  onAutoAdvance?: () => void;
}

const AUTO_ADVANCE_MS = 4000;

export default function ImageCard({
  src,
  alt = "",
  caption,
  isActive,
  onAutoAdvance,
}: ImageCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState(false);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(0);
      return;
    }

    startTime.current = Date.now();
    setProgress(0);

    const tick = () => {
      const elapsed = Date.now() - (startTime.current ?? Date.now());
      const pct = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
      setProgress(pct);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => {
      onAutoAdvance?.();
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, onAutoAdvance]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "9/16",
        maxHeight: "55vh",
        borderRadius: 12,
        background: imgError ? "#1e293b" : "#111",
      }}
    >
      {!imgError && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}

      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/30 text-sm">Image unavailable</p>
        </div>
      )}

      {/* Bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 20%, transparent 50%)",
        }}
      />

      {/* Caption overlay */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5">
          <p
            className="text-white text-center font-medium leading-snug"
            style={{ fontSize: 14, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            {caption}
          </p>
        </div>
      )}

      {/* Auto-advance progress bar */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/10">
          <motion.div
            className="h-full"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #f59e0b, #10b981)",
            }}
          />
        </div>
      )}
    </div>
  );
}
