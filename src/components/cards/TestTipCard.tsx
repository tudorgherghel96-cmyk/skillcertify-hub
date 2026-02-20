import XpBadge from "./shared/XpBadge";

interface TestTipCardProps {
  tipText: string;
  trapWarnings?: string[];
  xpValue?: number;
  dir?: "ltr" | "rtl";
}

export default function TestTipCard({
  tipText,
  trapWarnings = [],
  xpValue = 5,
  dir = "ltr",
}: TestTipCardProps) {
  return (
    <div
      dir={dir}
      className="relative w-full rounded-2xl bg-card border border-border overflow-hidden"
      style={{
        boxShadow: "0 0 20px rgba(249,168,37,0.3)",
      }}
    >
      <div className="p-5 space-y-3">
        <XpBadge xp={xpValue} show position={dir === "rtl" ? "top-left" : "top-right"} />

        {/* Header */}
        <p
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: "#F9A825" }}
        >
          💡 Test Tip
        </p>

        {/* Tip body */}
        <p className="text-[16px] leading-relaxed text-foreground">{tipText}</p>

        {/* Trap warnings */}
        {trapWarnings.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Watch out for:
            </p>
            {trapWarnings.map((w, i) => (
              <p
                key={i}
                className="text-sm font-bold leading-snug"
                style={{ color: "#C62828" }}
              >
                ⚠ {w}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
