interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div
      style={{
        position: "fixed",
        top: "calc(52px + env(safe-area-inset-top))",
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(255,255,255,0.1)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #f59e0b, #10b981)",
          transition: "width 300ms ease",
        }}
      />
    </div>
  );
}
