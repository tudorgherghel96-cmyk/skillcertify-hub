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
  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "9/16", maxHeight: "65vh" }}
    >
      {/* Full-bleed hero image */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.70) 30%, transparent 60%)",
        }}
      />

      {/* Module badge — top left */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="text-white font-semibold rounded-xl"
          style={{
            fontSize: 12,
            background: "rgba(0,0,0,0.50)",
            padding: "4px 10px",
            borderRadius: 12,
          }}
        >
          Module {moduleNumber} of {totalModules}
        </span>
      </div>

      {/* Duration badge — top right */}
      {durationLabel && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-white font-semibold"
            style={{
              fontSize: 12,
              background: "rgba(0,0,0,0.50)",
              padding: "4px 10px",
              borderRadius: 12,
            }}
          >
            {durationLabel}
          </span>
        </div>
      )}

      {/* Lesson title — centred over gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center px-5 pb-6">
        <h1
          className="text-white text-center font-bold leading-tight"
          style={{ fontSize: 28, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
        >
          {lessonTitle}
        </h1>
      </div>
    </div>
  );
}
