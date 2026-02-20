interface RememberThisProps {
  content: string;
}

export default function RememberThis({ content }: RememberThisProps) {
  return (
    <div
      style={{
        padding: "40px 24px",
        textAlign: "center",
        background: "radial-gradient(ellipse at top, rgba(59,130,246,0.08), transparent)",
        borderRadius: 20,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
      <p style={{ color: "#3b82f6", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px 0" }}>
        Remember This
      </p>
      <div style={{ width: 40, height: 3, background: "#3b82f6", borderRadius: 2, margin: "0 auto 20px" }} />
      <p style={{ color: "white", fontSize: 17, fontWeight: 500, lineHeight: 1.7, margin: 0 }}>
        {content}
      </p>
    </div>
  );
}
