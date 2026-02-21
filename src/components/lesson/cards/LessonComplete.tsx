import { useEffect, useRef, useState } from "react";

interface LessonCompleteProps {
  totalXp: number;
  streak: number;
  nextLessonTitle?: string;
  onNext: () => void;
  isLastLesson: boolean;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    start.current = null;
    const step = (ts: number) => {
      if (!start.current) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return count;
}

// Confetti particle
function Confetti() {
  const colours = ["#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ef4444", "#f97316", "#06b6d4"];
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    colour: colours[Math.floor(Math.random() * colours.length)],
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
  }));

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            background: p.colour,
            borderRadius: p.size / 4,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            pointerEvents: "none",
            zIndex: 50,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

export default function LessonComplete({
  totalXp,
  streak,
  nextLessonTitle,
  onNext,
  isLastLesson,
}: LessonCompleteProps) {
  const xpCount = useCountUp(totalXp);

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse at center, #1a1a2e, #0a0a0f)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Confetti />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 64, marginBottom: 12, display: "flex", justifyContent: "center" }}>
          <svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGold" x1="0" y1="0" x2="80" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="checkGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* Shield */}
            <path d="M40 4L8 18v26c0 22 14 36 32 44 18-8 32-22 32-44V18L40 4z" fill="url(#shieldGold)" opacity="0.9" />
            <path d="M40 4L8 18v26c0 22 14 36 32 44 18-8 32-22 32-44V18L40 4z" fill="none" stroke="#fbbf24" strokeWidth="2" />
            {/* Graduation cap */}
            <polygon points="40,28 18,40 40,52 62,40" fill="#1a1a2e" opacity="0.8" />
            <line x1="40" y1="52" x2="40" y2="66" stroke="#1a1a2e" strokeWidth="2" opacity="0.6" />
            <path d="M26 44v12c0 4 6 8 14 8s14-4 14-8V44" fill="none" stroke="#1a1a2e" strokeWidth="2" opacity="0.6" />
            {/* Checkmark */}
            <path d="M28 46l8 8 16-18" fill="none" stroke="url(#checkGold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 style={{ color: "white", fontSize: 28, fontWeight: 800, margin: "0 0 8px 0" }}>
          {isLastLesson ? "Course Complete! 🎉" : "Lesson Complete!"}
        </h1>

        <p style={{ color: "#f59e0b", fontSize: 36, fontWeight: 800, margin: "16px 0 4px 0" }}>
          +{xpCount} XP
        </p>

        {streak > 0 && (
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, margin: "0 0 32px 0" }}>
            🔥 Day {streak} streak
          </p>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            width: "100%",
            maxWidth: 360,
            height: 60,
            borderRadius: 16,
            background: isLastLesson
              ? "linear-gradient(135deg, #a855f7, #3b82f6)"
              : "linear-gradient(135deg, #f59e0b, #ef4444)",
            border: "none",
            color: "white",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {isLastLesson ? "Back to Learn Hub 🎓" : `Next: ${nextLessonTitle || "Continue"} →`}
        </button>
      </div>
    </div>
  );
}
