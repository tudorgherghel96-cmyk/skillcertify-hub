interface TestTipProps {
  content: string;
}

export default function TestTip({ content }: TestTipProps) {
  return (
    <div
      style={{
        padding: "40px 24px",
        textAlign: "center",
        background: "radial-gradient(ellipse at top, rgba(168,85,247,0.08), transparent)",
        borderRadius: 20,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
      <p style={{ color: "#a855f7", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px 0" }}>
        Test Tip
      </p>
      <div style={{ width: 40, height: 3, background: "#a855f7", borderRadius: 2, margin: "0 auto 20px" }} />
      <p style={{ color: "white", fontSize: 17, fontWeight: 500, lineHeight: 1.7, margin: 0 }}>
        {content}
      </p>
    </div>
  );
}
