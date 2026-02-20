import React from "react";

interface InteractiveSlideProps {
  children: React.ReactNode;
}

export default function InteractiveSlide({ children }: InteractiveSlideProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "0 24px",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          overflowY: "auto",
          maxHeight: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
