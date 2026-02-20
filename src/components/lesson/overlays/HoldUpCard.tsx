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
        top: "25%",
        left: "15%",
        right: "15%",
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <p
        style={{
          color: "#111",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.5,
          margin: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {text}
      </p>
    </div>
  );
}
