import { useState } from "react";

interface ScenarioProps {
  scenario: string;
  question: string;
  options: { text: string }[];
  correct_index: number;
  feedback_correct: string;
  feedback_wrong: string[];
  xp_value: number;
  onAnswer?: (correct: boolean, selectedIndex: number) => void;
}

export default function Scenario({
  scenario,
  question,
  options,
  correct_index,
  feedback_correct,
  feedback_wrong,
  xp_value,
  onAnswer,
}: ScenarioProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === correct_index;
    if (navigator.vibrate) navigator.vibrate(correct ? 50 : [50, 30, 50]);
    onAnswer?.(correct, i);
  };

  const answered = selected !== null;
  const isCorrect = selected === correct_index;

  const getOptionStyle = (i: number): React.CSSProperties => {
    if (!answered) {
      return {
        background: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(255,255,255,0.1)",
        color: "white",
      };
    }
    if (i === correct_index) return { background: "rgba(16,185,129,0.2)", border: "2px solid #10b981", color: "white" };
    if (i === selected) return { background: "rgba(239,68,68,0.15)", border: "2px solid #ef4444", color: "white" };
    return { background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" };
  };

  return (
    <div>
      {/* Scenario box */}
      <div
        style={{
          background: "rgba(245,158,11,0.08)",
          borderLeft: "4px solid #f59e0b",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <p style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0" }}>
          Scenario
        </p>
        <p style={{ color: "white", fontSize: 16, lineHeight: 1.5, margin: 0 }}>{scenario}</p>
      </div>

      <p style={{ color: "white", fontSize: 20, fontWeight: 700, lineHeight: 1.4, margin: "0 0 20px 0" }}>
        {question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
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
              cursor: answered ? "default" : "pointer",
              transition: "all 200ms ease",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              ...getOptionStyle(i),
            }}
          >
            <span>{opt.text}</span>
            {answered && i === correct_index && <span style={{ color: "#10b981" }}>✓</span>}
            {answered && i === selected && i !== correct_index && <span style={{ color: "#ef4444" }}>✗</span>}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 12, background: isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
          <p style={{ color: isCorrect ? "#10b981" : "#ef4444", fontSize: 14, fontWeight: 600, margin: 0 }}>
            {isCorrect ? `✓ ${feedback_correct}` : `✗ ${feedback_wrong[selected!] || "Not quite right."}`}
          </p>
        </div>
      )}
    </div>
  );
}
