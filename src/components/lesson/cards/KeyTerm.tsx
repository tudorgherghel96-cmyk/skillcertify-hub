interface KeyTermProps {
  term: string;
  definition: string;
  term2?: string;
  definition2?: string;
}

export default function KeyTerm({ term, definition, term2, definition2 }: KeyTermProps) {
  return (
    <div
      style={{
        padding: "40px 24px",
        background: "radial-gradient(ellipse at top, rgba(16,185,129,0.08), transparent)",
        borderRadius: 20,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
      <p style={{ color: "#10b981", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px 0" }}>
        Key Term
      </p>
      <p style={{ color: "white", fontSize: 24, fontWeight: 800, margin: "0 0 12px 0" }}>{term}</p>
      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>{definition}</p>

      {term2 && definition2 && (
        <>
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "24px 0" }} />
          <p style={{ color: "white", fontSize: 24, fontWeight: 800, margin: "0 0 12px 0" }}>{term2}</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.6, margin: 0 }}>{definition2}</p>
        </>
      )}
    </div>
  );
}
