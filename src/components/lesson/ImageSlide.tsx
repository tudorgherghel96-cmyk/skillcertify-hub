import { useState } from "react";

interface ImageSlideProps {
  src: string;
  alt?: string;
  caption?: string;
  isActive: boolean;
}

/** Auto-bold text before a colon or ALL-CAPS words (3+ chars) */
function highlightKeyTerms(text: string) {
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

export default function ImageSlide({ src, alt = "", caption, isActive }: ImageSlideProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {!imgError && src && (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
          loading="lazy"
        />
      )}

      {imgError && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Image unavailable</p>
        </div>
      )}

      {caption && (() => {
        const tipIndex = caption.toUpperCase().indexOf("TEST TIP:");
        const mainCaption = tipIndex >= 0 ? caption.slice(0, tipIndex).trim() : caption;
        const tipText = tipIndex >= 0 ? caption.slice(tipIndex + 9).trim() : null;
        return (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "32px 16px 24px",
              background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.15) 80%, transparent 100%)",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
            }}
          >
            {mainCaption && (
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "stretch",
                  gap: 0,
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: "hsl(205, 91%, 43%)",
                    flexShrink: 0,
                    marginRight: 14,
                  }}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.92)",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    letterSpacing: "0.2px",
                    margin: 0,
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {highlightKeyTerms(mainCaption)}
                </p>
              </div>
            )}
            {tipText && (
              <div
                style={{
                  marginTop: 12,
                  background: "rgba(245,158,11,0.1)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: 12,
                  padding: "12px 14px",
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
                  <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                    📝 Test Tip
                  </p>
                  <p style={{ color: "rgba(253,230,138,0.95)", fontSize: 14, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    {tipText}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
