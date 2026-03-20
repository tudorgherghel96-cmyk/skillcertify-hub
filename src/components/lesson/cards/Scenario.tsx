import { useState } from "react";

interface ScenarioProps {
  scenario: string;
  question: string;
  options: { text: string }[];
  correct_index: number;
  feedback_correct: string;
  feedback_wrong: string[];
  xp_value: number;
  image?: string;
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
  image,
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
          borderRadius: 14,
          padding: "14px 16px",
          marginBottom: 16,
          display: "flex",
          alignItems: "stretch",
          gap: 0,
        }}
      >
        <div
          style={{
            width: 3,
            borderRadius: 2,
            background: "#f59e0b",
            flexShrink: 0,
            marginRight: 12,
          }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 4px 0" }}>
            📋 Scenario
          </p>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{scenario}</p>
        </div>
      </div>

      {/* Image if provided */}
      {image && (
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <img
            src={image}
            alt="Scenario context"
            loading="eager"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 220,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <p style={{ color: "white", fontSize: 18, fontWeight: 700, lineHeight: 1.4, margin: "0 0 14px 0" }}>
        {question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); handleSelect(i); }}
            style={{
              width: "100%",
              minHeight: 48,
              padding: "14px 16px",
              borderRadius: 14,
              fontSize: 15,
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
        <div
          style={{
            marginTop: 16,
            borderRadius: 14,
            background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
            overflow: "hidden",
          }}
        >
          <div style={{ height: 3, background: isCorrect ? "#10b981" : "#ef4444", width: "100%" }} />
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "stretch", gap: 0 }}>
            <div
              style={{
                width: 3,
                borderRadius: 2,
                background: isCorrect ? "#10b981" : "#ef4444",
                flexShrink: 0,
                marginRight: 12,
              }}
            />
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              <span style={{ color: isCorrect ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                {isCorrect ? "✓ " : "✗ "}
              </span>
              {isCorrect ? feedback_correct : (feedback_wrong[selected!] || "Not quite right.")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
