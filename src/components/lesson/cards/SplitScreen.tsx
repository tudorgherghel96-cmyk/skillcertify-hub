interface SplitScreenProps {
  left_label?: string;
  right_label?: string;
  left_text: string;
  right_text: string;
}

export default function SplitScreen({ left_label = "✗ Wrong", right_label = "✓ Right", left_text, right_text }: SplitScreenProps) {
  return (
    <div>
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px 0", textAlign: "center" }}>
        Compare
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "nowrap",
        }}
      >
        {/* Left — wrong */}
        <div
          style={{
            flex: 1,
            background: "rgba(239,68,68,0.1)",
            borderLeft: "3px solid #ef4444",
            borderRadius: 16,
            padding: 20,
            minHeight: 120,
          }}
        >
          <p style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px 0" }}>
            {left_label}
          </p>
          <p style={{ color: "white", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{left_text}</p>
        </div>

        {/* Right — correct */}
        <div
          style={{
            flex: 1,
            background: "rgba(16,185,129,0.1)",
            borderLeft: "3px solid #10b981",
            borderRadius: 16,
            padding: 20,
            minHeight: 120,
          }}
        >
          <p style={{ color: "#10b981", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px 0" }}>
            {right_label}
          </p>
          <p style={{ color: "white", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{right_text}</p>
        </div>
      </div>
    </div>
  );
}
