import { useState } from "react";
import SafetySignIcon from "./SafetySignIcon";

const isImagePath = (s: string) => s.startsWith('/') || /\.(webp|png|jpg|jpeg|svg)$/i.test(s);

interface Panel {
  front?: string;
  back?: string;
  label?: string;
  content?: string;
  icon?: string;
}

interface TapToRevealProps {
  title?: string;
  panels: Panel[];
  xp_value: number;
  layout?: string;
  onComplete?: () => void;
}

function FlipCard({
  panel,
  isFlipped,
  onFlip,
  size,
}: {
  panel: Panel;
  isFlipped: boolean;
  onFlip: () => void;
  size?: number;
}) {
  const s = size || 100;
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onFlip(); }}
      style={{
        width: s,
        height: s,
        borderRadius: 16,
        position: "relative",
        cursor: isFlipped ? "default" : "pointer",
        transformStyle: "preserve-3d",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 500ms ease",
      }}
    >
      {/* Front */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "rgba(255,255,255,0.08)",
          border: "2px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          padding: 6,
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        {panel.icon ? (
          isImagePath(panel.icon) ? (
            <>
              <img src={panel.icon} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 14, objectFit: "cover" }} />
              <span style={{ position: "relative", zIndex: 1, color: "white", fontSize: 13, fontWeight: 800, textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.8)", background: "rgba(0,0,0,0.45)", borderRadius: 6, padding: "2px 8px", lineHeight: 1.2 }}>
                {panel.front || panel.label}
              </span>
            </>
          ) : (
            <>
              <SafetySignIcon icon={panel.icon} size={28} />
              <span style={{ color: "white", fontSize: 10, fontWeight: 700, textAlign: "center", lineHeight: 1.1, wordBreak: "break-word" }}>
                {panel.front || panel.label}
              </span>
            </>
          )
        ) : (
          <span style={{ color: "white", fontSize: 13, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
            {panel.front || panel.label}
          </span>
        )}
      </div>

      {/* Back */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "#065f46",
          border: "2px solid #10b981",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          padding: 6,
          overflow: "hidden",
        }}
      >
        <span style={{ color: "white", fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.2, wordBreak: "break-word" }}>
          {panel.back || panel.content}
        </span>
      </div>
    </div>
  );
}

function TriangleLayout({
  panels,
  flipped,
  onFlip,
}: {
  panels: Panel[];
  flipped: Set<number>;
  onFlip: (i: number) => void;
}) {
  const triPanels = panels.slice(0, 3);
  const extraPanel = panels[3];
  const allTriFlipped = triPanels.every((_, i) => flipped.has(i));

  // SVG triangle connecting lines between the 3 card centers
  // Card positions (center points in the 300×200 viewBox):
  // Top: (150, 30), Bottom-left: (45, 170), Bottom-right: (255, 170)
  const points = [
    { x: 150, y: 40 },   // top center
    { x: 45, y: 170 },   // bottom left
    { x: 255, y: 170 },  // bottom right
  ];

  const lineColor = (a: number, b: number) => {
    if (flipped.has(a) && flipped.has(b)) return "#10b981";
    return "rgba(255,255,255,0.12)";
  };

  const lineGlow = (a: number, b: number) => {
    if (flipped.has(a) && flipped.has(b)) return "0 0 8px #10b981";
    return "none";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {/* Triangle area */}
      <div style={{ position: "relative", width: 300, height: 210 }}>
        {/* SVG lines */}
        <svg
          viewBox="0 0 300 210"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          {/* Triangle edges */}
          {[[0, 1], [1, 2], [2, 0]].map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={points[a].x} y1={points[a].y}
              x2={points[b].x} y2={points[b].y}
              stroke={lineColor(a, b)}
              strokeWidth={allTriFlipped ? 3 : 2}
              strokeDasharray={flipped.has(a) && flipped.has(b) ? "none" : "6 4"}
              style={{
                filter: lineGlow(a, b),
                transition: "stroke 400ms, filter 400ms",
              }}
            />
          ))}
          {/* Center label */}
          {allTriFlipped && (
            <text x="150" y="120" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="700" opacity="0.8">
              🔥 FIRE
            </text>
          )}
        </svg>

        {/* Top card */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>
          <FlipCard panel={triPanels[0]} isFlipped={flipped.has(0)} onFlip={() => onFlip(0)} size={90} />
        </div>

        {/* Bottom-left card */}
        <div style={{ position: "absolute", bottom: 0, left: 0 }}>
          <FlipCard panel={triPanels[1]} isFlipped={flipped.has(1)} onFlip={() => onFlip(1)} size={90} />
        </div>

        {/* Bottom-right card */}
        <div style={{ position: "absolute", bottom: 0, right: 0 }}>
          <FlipCard panel={triPanels[2]} isFlipped={flipped.has(2)} onFlip={() => onFlip(2)} size={90} />
        </div>
      </div>

      {/* 4th panel below triangle */}
      {extraPanel && (
        <FlipCard panel={extraPanel} isFlipped={flipped.has(3)} onFlip={() => onFlip(3)} size={90} />
      )}
    </div>
  );
}

export default function TapToReveal({ title, panels, xp_value, layout, onComplete }: TapToRevealProps) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const useTriangle = layout === "triangle" || (title?.toLowerCase().includes("triangle") ?? false);

  const flip = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.add(i);
      if (next.size === panels.length) {
        setTimeout(() => onComplete?.(), 400);
        if (navigator.vibrate) navigator.vibrate(50);
      }
      return next;
    });
  };

  const allFlipped = flipped.size === panels.length;

  return (
    <div>
      {title && (
        <p style={{ color: "white", fontSize: 20, fontWeight: 800, textAlign: "center", margin: "0 0 4px 0", lineHeight: 1.3 }}>
          {title}
        </p>
      )}
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px 0" }}>
        Tap to reveal
      </p>

      {useTriangle ? (
        <TriangleLayout panels={panels} flipped={flipped} onFlip={flip} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, perspective: 1000 }}>
          {panels.map((panel, i) => {
            const isFlipped = flipped.has(i);
            return (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); flip(i); }}
                style={{
                  aspectRatio: "1",
                  borderRadius: 16,
                  position: "relative",
                  cursor: isFlipped ? "default" : "pointer",
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 500ms ease",
                }}
              >
                {/* Front */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.08)",
                    border: "2px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    padding: 12,
                  }}
                >
                  {panel.icon ? (
                    isImagePath(panel.icon) ? (
                      <>
                        <img src={panel.icon} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 14, objectFit: "cover" }} />
                        <span style={{ position: "relative", zIndex: 1, color: "white", fontSize: 15, fontWeight: 800, textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.8)", background: "rgba(0,0,0,0.45)", borderRadius: 8, padding: "4px 10px", lineHeight: 1.2 }}>
                          {panel.front || panel.label}
                        </span>
                      </>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <SafetySignIcon icon={panel.icon} size={36} />
                        <span style={{ color: "white", fontSize: 13, fontWeight: 700, textAlign: "center" }}>{panel.front || panel.label}</span>
                      </div>
                    )
                  ) : (
                    <span style={{ color: "white", fontSize: 15, fontWeight: 700, textAlign: "center" }}>{panel.front || panel.label}</span>
                  )}
                </div>

                {/* Back */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: "#065f46",
                    border: "2px solid #10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    padding: 12,
                  }}
                >
                  <span style={{ color: "white", fontSize: 13, fontWeight: 600, textAlign: "center", lineHeight: 1.4 }}>{panel.back || panel.content}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allFlipped && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: "#10b981", fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" }}>Got it! 🎉</p>
          <p style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, margin: 0 }}>+{xp_value} XP</p>
        </div>
      )}
    </div>
  );
}
