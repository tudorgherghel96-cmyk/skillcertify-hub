import { useState } from "react";

interface Panel {
  front: string;
  back: string;
}

interface TapToRevealProps {
  panels: Panel[];
  xp_value: number;
  onComplete?: () => void;
}

export default function TapToReveal({ panels, xp_value, onComplete }: TapToRevealProps) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

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
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px 0" }}>
        Tap to reveal
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, perspective: 1000 }}>
        {panels.slice(0, 4).map((panel, i) => {
          const isFlipped = flipped.has(i);
          return (
            <div
              key={i}
              onClick={() => flip(i)}
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
                <span style={{ color: "white", fontSize: 15, fontWeight: 700, textAlign: "center" }}>{panel.front}</span>
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
                <span style={{ color: "white", fontSize: 13, fontWeight: 600, textAlign: "center", lineHeight: 1.4 }}>{panel.back}</span>
              </div>
            </div>
          );
        })}
      </div>

      {allFlipped && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: "#10b981", fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" }}>Got it! 🎉</p>
          <p style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, margin: 0 }}>+{xp_value} XP</p>
        </div>
      )}
    </div>
  );
}
