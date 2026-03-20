import { formatTestTipContent } from "@/lib/formatTestTip";

interface TestTipProps {
  content: string;
}

export default function TestTip({ content }: TestTipProps) {
  const parts = formatTestTipContent(content);

  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        background: "radial-gradient(ellipse at top, rgba(245,158,11,0.06), transparent 70%)",
        borderRadius: 20,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
      <p
        style={{
          color: "#f59e0b",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          margin: "0 0 8px 0",
        }}
      >
        Test Tip
      </p>
      <div
        style={{
          width: 40,
          height: 3,
          background: "linear-gradient(90deg, #f59e0b, #f97316)",
          borderRadius: 2,
          margin: "0 auto 24px",
        }}
      />

      {parts.length > 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 340, margin: "0 auto", textAlign: "left" }}>
          {parts.map((part, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.12)",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  flexShrink: 0,
                  marginTop: 8,
                }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {part.highlighted ? (
                  <>
                    <span style={{ fontWeight: 700, color: "white" }}>{part.highlighted}:</span>{" "}
                    {part.rest}
                  </>
                ) : (
                  part.text
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 17,
            fontWeight: 500,
            lineHeight: 1.8,
            margin: 0,
            maxWidth: 340,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {parts[0]?.highlighted ? (
            <>
              <span style={{ fontWeight: 700, color: "white" }}>{parts[0].highlighted}:</span>{" "}
              {parts[0].rest}
            </>
          ) : (
            content
          )}
        </p>
      )}
    </div>
  );
}
