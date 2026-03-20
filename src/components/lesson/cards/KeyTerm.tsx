interface KeyTermProps {
  term: string;
  definition: string;
  term2?: string;
  definition2?: string;
}

/** Auto-bold ALL-CAPS words and text before colons */
function highlightDef(text: string) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 0 && colonIdx < 40) {
    const before = text.slice(0, colonIdx);
    const after = text.slice(colonIdx + 1).trim();
    return (
      <>
        <span style={{ fontWeight: 700, color: "white" }}>{before}:</span> {after}
      </>
    );
  }
  const parts = text.split(/(\b[A-Z]{3,}\b)/g);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, i) =>
          /^[A-Z]{3,}$/.test(part) ? (
            <span key={i} style={{ fontWeight: 700, color: "white" }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }
  return text;
}

function TermBlock({ term, definition }: { term: string; definition: string }) {
  return (
    <div
      style={{
        background: "rgba(16,185,129,0.06)",
        border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "stretch",
        gap: 0,
      }}
    >
      <div
        style={{
          width: 3,
          borderRadius: 2,
          background: "#10b981",
          flexShrink: 0,
          marginRight: 14,
        }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 8px 0", lineHeight: 1.2 }}>
          {term}
        </p>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
          {highlightDef(definition)}
        </p>
      </div>
    </div>
  );
}

export default function KeyTerm({ term, definition, term2, definition2 }: KeyTermProps) {
  return (
    <div
      style={{
        padding: "40px 20px",
        background: "radial-gradient(ellipse at top, rgba(16,185,129,0.08), transparent)",
        borderRadius: 20,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
      <p
        style={{
          color: "#10b981",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          margin: "0 0 20px 0",
        }}
      >
        Key Term
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
        <TermBlock term={term} definition={definition} />
        {term2 && definition2 && (
          <TermBlock term={term2} definition={definition2} />
        )}
      </div>
    </div>
  );
}
