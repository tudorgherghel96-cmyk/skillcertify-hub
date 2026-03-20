import { useEffect, useState, RefObject } from "react";

interface HoldUpCardProps {
  text: string;
  videoRef: RefObject<HTMLVideoElement>;
}

export default function HoldUpCard({ text, videoRef }: HoldUpCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const handler = () => {
      if (vid.currentTime >= 1.5) setVisible(true);
    };
    vid.addEventListener("timeupdate", handler);
    return () => vid.removeEventListener("timeupdate", handler);
  }, [videoRef]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "5%",
        left: "5%",
        right: "5%",
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 400ms ease, transform 400ms ease",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Amber top accent bar */}
      <div
        style={{
          height: 3,
          background: "linear-gradient(90deg, #f59e0b, #ef4444)",
          width: "100%",
        }}
      />
      <div style={{ padding: "14px 20px" }}>
        <p
          style={{
            color: "#92400e",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            margin: "0 0 6px 0",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          ✋ Hold up
        </p>
        <p
          style={{
            color: "#111",
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.5,
            margin: 0,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
