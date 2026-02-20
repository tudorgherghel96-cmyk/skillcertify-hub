import { useState } from "react";

interface HeroImageCardProps {
  src: string;
  alt?: string;
  lessonTitle: string;
  moduleNumber: number;
  totalModules?: number;
  durationLabel?: string;
}

export default function HeroImageCard({
  src,
  alt = "",
  lessonTitle,
  moduleNumber,
  totalModules = 5,
  durationLabel,
}: HeroImageCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "9/16",
        maxHeight: "65vh",
        borderRadius: 16,
        background: "#0a0a0a",
        position: "relative",
      }}
    >
      {/* Full-bleed hero image */}
      {!imgError && (
        <img
          src={src}
          alt={alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="eager"
          fetchPriority="high"
          onError={() => setImgError(true)}
        />
      )}

      {/* Bottom gradient overlay — 40% height */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          pointerEvents: "none",
        }}
      />

      {/* Module badge — top left */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(0,0,0,0.5)",
          color: "white",
          fontSize: 12,
          padding: "4px 12px",
          borderRadius: 12,
          backdropFilter: "blur(4px)",
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        Module {moduleNumber} of {totalModules}
      </div>

      {/* Duration badge — top right */}
      {durationLabel && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            fontSize: 12,
            padding: "4px 12px",
            borderRadius: 12,
            backdropFilter: "blur(4px)",
            fontWeight: 600,
            zIndex: 10,
          }}
        >
          {durationLabel}
        </div>
      )}

      {/* Lesson title — bottom centre */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 20px",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: 700,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {lessonTitle}
        </h1>
      </div>
    </div>
  );
}
