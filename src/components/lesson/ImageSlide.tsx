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
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#111", overflow: "hidden" }}>
      {!imgError && src && (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
        />
      )}

      {imgError && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Image unavailable</p>
        </div>
      )}

      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px 20px",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: 500,
              margin: 0,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
