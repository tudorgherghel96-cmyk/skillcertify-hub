import { useState } from "react";

interface MultiSelectProps {
  question: string;
  options: { text: string }[];
  correct_indices: number[];
  xp_value: number;
  onAnswer?: (score: number, total: number) => void;
}

export default function MultiSelect({ question, options, correct_indices, xp_value, onAnswer }: MultiSelectProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0 || submitted) return;
    setSubmitted(true);
    const correctSet = new Set(correct_indices);
    const score = [...selected].filter((i) => correctSet.has(i)).length;
    onAnswer?.(score, correct_indices.length);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const getOptionStyle = (i: number): React.CSSProperties => {
    const isSelected = selected.has(i);
    if (!submitted) {
      return {
        background: isSelected ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.06)",
        border: `2px solid ${isSelected ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
        color: "white",
      };
    }
    const correctSet = new Set(correct_indices);
    if (correctSet.has(i) && isSelected) return { background: "rgba(16,185,129,0.2)", border: "2px solid #10b981", color: "white" };
    if (correctSet.has(i) && !isSelected) return { background: "rgba(16,185,129,0.05)", border: "2px dashed #10b981", color: "rgba(255,255,255,0.7)" };
    if (!correctSet.has(i) && isSelected) return { background: "rgba(239,68,68,0.15)", border: "2px solid #ef4444", color: "white" };
    return { background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" };
  };

  const correctSet = new Set(correct_indices);
  const score = submitted ? [...selected].filter((i) => correctSet.has(i)).length : 0;

  return (
    <div>
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px 0" }}>
        Select All That Apply
      </p>
      <p style={{ color: "white", fontSize: 20, fontWeight: 700, lineHeight: 1.4, margin: "0 0 24px 0" }}>
        {question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              minHeight: 56,
              padding: "14px 20px",
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 600,
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: submitted ? "default" : "pointer",
              transition: "all 200ms ease",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              ...getOptionStyle(i),
            }}
          >
            {/* Checkbox */}
            <div
              style={{
                width: 24,
                height: 24,
                minWidth: 24,
                borderRadius: "50%",
                border: `2px solid ${selected.has(i) ? "#3b82f6" : "rgba(255,255,255,0.3)"}`,
                background: selected.has(i) ? "#3b82f6" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "white",
              }}
            >
              {selected.has(i) && "✓"}
            </div>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          style={{
            width: "100%",
            height: 56,
            marginTop: 24,
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            background: selected.size === 0 ? "rgba(59,130,246,0.3)" : "#3b82f6",
            border: "none",
            cursor: selected.size === 0 ? "default" : "pointer",
            transition: "all 200ms ease",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          Check Answers
        </button>
      )}

      {submitted && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <p style={{ color: score === correct_indices.length ? "#10b981" : "#f59e0b", fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" }}>
            {score}/{correct_indices.length} correct
          </p>
          {score < correct_indices.length && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Review the highlighted answers above</p>
          )}
        </div>
      )}
    </div>
  );
}
