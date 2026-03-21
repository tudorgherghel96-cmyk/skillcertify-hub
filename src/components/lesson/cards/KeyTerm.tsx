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

/** Split definition into sentences for scannable bullet layout */
function splitSentences(text: string): string[] {
  const sentences = text
    .split(/\.(?:\s|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  return sentences.length >= 2 ? sentences : [];
}

function TermBlock({ term, definition }: { term: string; definition: string }) {
  const sentences = splitSentences(definition);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero term */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "white",
            fontSize: 26,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.3px",
          }}
        >
          {term}
        </p>
        <div
          style={{
            width: 48,
            height: 3,
            background: "linear-gradient(90deg, #10b981, #34d399)",
            borderRadius: 2,
            margin: "10px auto 0",
          }}
        />
      </div>

      {/* Definition panel */}
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(16,185,129,0.15)",
          borderRadius: 14,
          padding: "18px 20px",
          display: "flex",
          alignItems: "stretch",
          gap: 0,
        }}
      >
        {/* Green accent bar */}
        <div
          style={{
            width: 3,
            borderRadius: 2,
            background: "linear-gradient(180deg, #10b981, #059669)",
            flexShrink: 0,
            marginRight: 16,
          }}
        />
        <div style={{ flex: 1 }}>
          {sentences.length >= 2 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sentences.map((sentence, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#10b981",
                      flexShrink: 0,
                      marginTop: 10,
                    }}
                  />
                  <p
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: 1.8,
                      margin: 0,
                    }}
                  >
                    {highlightDef(sentence)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {highlightDef(definition)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KeyTerm({ term, definition, term2, definition2 }: KeyTermProps) {
  const hasDual = Boolean(term2 && definition2);

  return (
    <div
      style={{
        padding: "32px 20px 36px",
        background: "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 60%)",
        borderRadius: 20,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          width: "100%",
          height: 3,
          background: "linear-gradient(90deg, transparent, #10b981 30%, #10b981 70%, transparent)",
          borderRadius: 2,
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 28 }}>📖</span>
        <p
          style={{
            color: "#10b981",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Key Term
        </p>
      </div>

      {/* Term blocks */}
      <div style={{ display: "flex", flexDirection: "column", gap: hasDual ? 24 : 0, textAlign: "left" }}>
        <TermBlock term={term} definition={definition} />

        {hasDual && (
          <>
            <div
              style={{
                width: "60%",
                height: 1,
                background: "rgba(16,185,129,0.15)",
                margin: "0 auto",
              }}
            />
            <TermBlock term={term2!} definition={definition2!} />
          </>
        )}
      </div>
    </div>
  );
}
