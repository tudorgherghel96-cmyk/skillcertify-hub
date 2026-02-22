import { useState } from "react";

interface ImageSlideProps {
  src: string;
  alt?: string;
  caption?: string;
  isActive: boolean;
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
              padding: "24px 20px",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4) 60%, transparent)",
            }}
          >
            {mainCaption && (
              <p
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: 500,
                  margin: 0,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                {mainCaption}
              </p>
            )}
            {tipText && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>📝 TEST TIP</span>
                <span style={{ color: "rgba(253,230,138,0.9)", fontSize: 13, lineHeight: 1.4 }}>{tipText}</span>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
