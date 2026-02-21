import { useEffect, useState, RefObject } from "react";

interface LeanInCalloutProps {
  text: string;
  videoRef: RefObject<HTMLVideoElement>;
}

export default function LeanInCallout({ text, videoRef }: LeanInCalloutProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const handler = () => {
      if (vid.currentTime >= 2) setVisible(true);
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
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 16,
        padding: "18px 24px",
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 600ms ease, transform 600ms ease",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <p
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: 600,
          textAlign: "center",
          margin: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {text}
      </p>
    </div>
  );
}
