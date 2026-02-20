import { useState, useEffect, useRef, useCallback } from "react";

interface DrillQuestion {
  question: string;
  options: string[];
  correct_index: number;
}

interface SpeedDrillProps {
  questions: DrillQuestion[];
  xp_value: number;
  onComplete?: (score: number, total: number) => void;
}

const TIMER_SECONDS = 3;

export default function SpeedDrill({ questions, xp_value, onComplete }: SpeedDrillProps) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(
    (wasCorrect: boolean) => {
      if (wasCorrect) setScore((s) => s + 1);
      if (timerRef.current) clearInterval(timerRef.current);
      setFeedback(wasCorrect ? "correct" : "wrong");
      setTimeout(() => {
        setFeedback(null);
        const next = qIndex + 1;
        if (next >= questions.length) {
          setDone(true);
          onComplete?.(score + (wasCorrect ? 1 : 0), questions.length);
        } else {
          setQIndex(next);
          setTimeLeft(TIMER_SECONDS);
        }
      }, 400);
    },
    [qIndex, questions.length, score, onComplete],
  );

  useEffect(() => {
    if (done || feedback) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          advance(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [qIndex, done, advance, feedback]);

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#f59e0b", fontSize: 48, fontWeight: 800, margin: "0 0 8px 0" }}>
          {score}/{questions.length}
        </p>
        <p style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 16px 0" }}>
          {score === questions.length ? "Perfect! 🎉" : score >= questions.length / 2 ? "Nice work!" : "Keep practising!"}
        </p>
        <p style={{ color: "#f59e0b", fontSize: 18, fontWeight: 700, margin: 0 }}>
          +{Math.round((score / questions.length) * xp_value)} XP
        </p>
      </div>
    );
  }

  const q = questions[qIndex];
  const pct = timeLeft / TIMER_SECONDS;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * (1 - pct);
  const timerColor = pct > 0.6 ? "#10b981" : pct > 0.3 ? "#f59e0b" : "#ef4444";

  return (
    <div
      style={{
        background: feedback === "correct" ? "rgba(16,185,129,0.15)" : feedback === "wrong" ? "rgba(239,68,68,0.15)" : "transparent",
        borderRadius: 20,
        padding: "20px 0",
        transition: "background 200ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <svg width={64} height={64} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={timerColor}
            strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 300ms ease" }}
          />
          <text x="32" y="36" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">
            {timeLeft}
          </text>
        </svg>
      </div>

      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px 0", textAlign: "center" }}>
        Speed Drill ⚡ {qIndex + 1}/{questions.length}
      </p>
      <p style={{ color: "white", fontSize: 20, fontWeight: 700, lineHeight: 1.4, margin: "0 0 24px 0", textAlign: "center" }}>
        {q.question}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => advance(i === q.correct_index)}
            style={{
              minHeight: 70,
              padding: "12px 16px",
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 600,
              color: "white",
              background: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              textAlign: "center",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
