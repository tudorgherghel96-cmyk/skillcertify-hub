import { useState } from "react";

interface SplitScreenProps {
  left_label?: string;
  right_label?: string;
  left_text: string;
  right_text: string;
  left_image?: string;
  right_image?: string;
  title?: string;
  takeaway?: string;
  onComplete?: () => void;
}

export default function SplitScreen({
  left_label = "✗ Wrong",
  right_label = "✓ Right",
  left_text,
  right_text,
  left_image,
  right_image,
  title,
  takeaway,
  onComplete,
}: SplitScreenProps) {
  const [revealed, setRevealed] = useState(false);
  const [tapped, setTapped] = useState<"left" | "right" | null>(null);

  const handleTap = (side: "left" | "right") => {
    if (tapped) return;
    setTapped(side);
    // Brief delay then reveal both with takeaway
    setTimeout(() => {
      setRevealed(true);
      onComplete?.();
    }, 400);
  };

  return (
    <div>
      {/* Title */}
      <p
        style={{
          color: "#f59e0b",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          margin: "0 0 6px 0",
          textAlign: "center",
        }}
      >
        Spot the difference
      </p>
      {title && (
        <p
          style={{
            color: "white",
            fontSize: 17,
            fontWeight: 700,
            textAlign: "center",
            margin: "0 0 16px 0",
            lineHeight: 1.3,
          }}
        >
          {title}
        </p>
      )}
      {!title && (
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            textAlign: "center",
            margin: "0 0 16px 0",
          }}
        >
          Tap a side to reveal which is correct
        </p>
      )}

      {/* Two panels */}
      <div style={{ display: "flex", gap: 10, flexWrap: "nowrap" }}>
        {/* Left — wrong */}
        <button
          onClick={() => handleTap("left")}
          style={{
            flex: 1,
            background:
              revealed || tapped === "left"
                ? "rgba(239,68,68,0.12)"
                : "rgba(255,255,255,0.05)",
            borderLeft: `3px solid ${
              revealed || tapped === "left" ? "#ef4444" : "rgba(255,255,255,0.15)"
            }`,
            borderTop: "none",
            borderRight: "none",
            borderBottom: "none",
            borderRadius: 16,
            padding: "16px 14px",
            minHeight: 110,
            cursor: tapped ? "default" : "pointer",
            textAlign: "left",
            transition: "all 0.35s ease",
            transform: tapped === "left" ? "scale(0.97)" : "scale(1)",
          }}
        >
          {left_image && (
            <img
              src={left_image}
              alt="Option A"
              loading="eager"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "contain",
                borderRadius: 10,
                marginBottom: 8,
                background: "rgba(255,255,255,0.03)",
              }}
            />
          )}
          <p
            style={{
              color: revealed || tapped === "left" ? "#ef4444" : "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 8px 0",
              transition: "color 0.3s",
            }}
          >
            {revealed || tapped === "left" ? left_label : "Option A"}
          </p>
          <p style={{ color: "white", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {left_text}
          </p>
        </button>

        {/* Right — correct */}
        <button
          onClick={() => handleTap("right")}
          style={{
            flex: 1,
            background:
              revealed || tapped === "right"
                ? "rgba(16,185,129,0.12)"
                : "rgba(255,255,255,0.05)",
            borderLeft: `3px solid ${
              revealed || tapped === "right" ? "#10b981" : "rgba(255,255,255,0.15)"
            }`,
            borderTop: "none",
            borderRight: "none",
            borderBottom: "none",
            borderRadius: 16,
            padding: "16px 14px",
            minHeight: 110,
            cursor: tapped ? "default" : "pointer",
            textAlign: "left",
            transition: "all 0.35s ease",
            transform: tapped === "right" ? "scale(0.97)" : "scale(1)",
          }}
        >
          {right_image && (
            <img
              src={right_image}
              alt="Option B"
              loading="eager"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "contain",
                borderRadius: 10,
                marginBottom: 8,
                background: "rgba(255,255,255,0.03)",
              }}
            />
          )}
          <p
            style={{
              color: revealed || tapped === "right" ? "#10b981" : "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 8px 0",
              transition: "color 0.3s",
            }}
          >
            {revealed || tapped === "right" ? right_label : "Option B"}
          </p>
          <p style={{ color: "white", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            {right_text}
          </p>
        </button>
      </div>

      {/* Takeaway / feedback */}
      <div
        style={{
          marginTop: 14,
          borderRadius: 14,
          background: revealed ? "rgba(16,185,129,0.08)" : "transparent",
          border: revealed ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.4s ease",
          overflow: "hidden",
          minHeight: revealed ? "auto" : 0,
        }}
      >
        {revealed && (
          <>
            <div style={{ height: 3, background: tapped === "right" ? "#10b981" : "#ef4444", width: "100%" }} />
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "stretch", gap: 0 }}>
              <div
                style={{
                  width: 3,
                  borderRadius: 2,
                  background: tapped === "right" ? "#10b981" : "#ef4444",
                  flexShrink: 0,
                  marginRight: 12,
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                <span style={{ color: tapped === "right" ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                  {tapped === "right" ? "✓ Correct! " : "✗ Not quite — "}
                </span>
                {takeaway || "The right side shows the safe, compliant approach. Always follow correct procedure on site."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
