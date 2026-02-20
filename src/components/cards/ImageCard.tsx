import { useEffect, useRef } from "react";

interface ImageCardProps {
  src: string;
  alt?: string;
  caption?: string;
  isActive: boolean;
  onAutoAdvance?: () => void;
}

export default function ImageCard({
  src,
  alt = "",
  caption,
  isActive,
  onAutoAdvance,
}: ImageCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(() => {
      onAutoAdvance?.();
    }, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, onAutoAdvance]);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "9/16", maxHeight: "65vh" }}
    >
      {/* Full-bleed image */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Subtle bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 20%, transparent 50%)",
        }}
      />

      {/* Optional caption */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5">
          <p
            className="text-white text-center leading-snug"
            style={{ fontSize: 14, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
