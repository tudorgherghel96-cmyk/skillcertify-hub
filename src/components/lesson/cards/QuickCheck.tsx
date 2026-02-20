import { useState } from "react";

interface Option {
  text: string;
}

interface QuickCheckProps {
  question: string;
  options: Option[];
  correct_index: number;
  feedback_correct: string;
  feedback_wrong: string[];
  xp_value: number;
  onAnswer?: (correct: boolean, selectedIndex: number) => void;
}

export default function QuickCheck({
  question,
  options,
  correct_index,
  feedback_correct,
  feedback_wrong,
  xp_value,
  onAnswer,
}: QuickCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === correct_index;
    if (correct) {
      setShowXp(true);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    }
    onAnswer?.(correct, i);
  };

  const answered = selected !== null;
  const isCorrect = selected === correct_index;

  const getOptionStyle = (i: number) => {
    const base: React.CSSProperties = {
      width: "100%",
      minHeight: 60,
      padding: "18px 20px",
      borderRadius: 16,
      fontSize: 16,
      fontWeight: 600,
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      cursor: answered ? "default" : "pointer",
      border: "2px solid transparent",
      transition: "all 200ms ease",
      color: "white",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    };

    if (!answered) {
      return { ...base, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)" };
    }
    if (i === correct_index) {
      return { ...base, background: "rgba(16,185,129,0.2)", border: "2px solid #10b981" };
    }
    if (i === selected) {
      return {
        ...base,
        background: "rgba(239,68,68,0.15)",
        border: "2px solid #ef4444",
        animation: "shake 300ms ease",
      };
    }
    return { ...base, background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.05)", opacity: 0.5 };
  };

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 0; }
        }
      `}</style>

      {/* Label */}
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px 0" }}>
        ⚡ Quick Check
      </p>

      {/* Question */}
      <p style={{ color: "white", fontSize: 22, fontWeight: 700, lineHeight: 1.4, margin: "0 0 32px 0" }}>
        {question}
      </p>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} style={getOptionStyle(i)}>
            <span>{opt.text}</span>
            {answered && i === correct_index && <span style={{ color: "#10b981", fontSize: 18 }}>✓</span>}
            {answered && i === selected && i !== correct_index && <span style={{ color: "#ef4444", fontSize: 18 }}>✗</span>}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            borderRadius: 12,
            background: isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            animation: "fadeIn 300ms ease",
          }}
        >
          <p
            style={{
              color: isCorrect ? "#10b981" : "#ef4444",
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {isCorrect
              ? `✓ ${feedback_correct}`
              : `✗ ${feedback_wrong[selected!] || "That's not quite right."}`}
          </p>
        </div>
      )}

      {/* XP badge */}
      {showXp && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            color: "#f59e0b",
            fontSize: 16,
            fontWeight: 700,
            animation: "floatUp 1.5s ease forwards",
            pointerEvents: "none",
          }}
        >
          +{xp_value} XP
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
