import { ArrowLeft } from "lucide-react";

interface NavHeaderProps {
  title: string;
  current: number;
  total: number;
  onBack: () => void;
}

export default function NavHeader({ title, current, total, onBack }: NavHeaderProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "calc(52px + env(safe-area-inset-top))",
        paddingTop: "env(safe-area-inset-top)",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 16,
        gap: 8,
      }}
    >
      <button
        onClick={onBack}
        aria-label="Exit lesson"
        style={{
          width: 44,
          height: 44,
          minWidth: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius: 8,
        }}
      >
        <ArrowLeft size={22} />
      </button>
      <p
        style={{
          flex: 1,
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          margin: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {title}
      </p>
      <span
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 13,
          whiteSpace: "nowrap",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {current}/{total}
      </span>
    </div>
  );
}
