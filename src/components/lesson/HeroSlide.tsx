import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface HeroSlideProps {
  src: string;
  lessonTitle: string;
  moduleNumber: number;
  durationLabel?: string;
  isActive: boolean;
}

export default function HeroSlide({ src, lessonTitle, moduleNumber, durationLabel, isActive }: HeroSlideProps) {
  const [imgError, setImgError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000", overflow: "hidden" }}>
      {!imgError && src && (
        <img
          src={src}
          alt={lessonTitle}
          onError={() => setImgError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="eager"
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Module pill */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 20,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          color: "white",
          fontSize: 13,
          fontWeight: 600,
          padding: "6px 14px",
          borderRadius: 20,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        Module {moduleNumber}
      </div>

      {/* Duration pill */}
      {durationLabel && (
        <div
          style={{
            position: "absolute",
            top: 130,
            right: 20,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 20,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {durationLabel}
        </div>
      )}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 24,
          right: 24,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1.2,
            margin: 0,
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {lessonTitle}
        </h1>
      </div>

      {/* Swipe hint */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: showHint ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      >
        <ChevronUp size={20} color="rgba(255,255,255,0.6)" style={{ animation: "bounce 1.5s infinite" }} />
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
          Swipe up to start
        </span>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
