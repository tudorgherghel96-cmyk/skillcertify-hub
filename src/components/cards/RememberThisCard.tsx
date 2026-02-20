import { Camera } from "lucide-react";
import XpBadge from "./shared/XpBadge";

interface RememberThisCardProps {
  content: string;
  xpValue?: number;
  dir?: "ltr" | "rtl";
}

/**
 * Screenshot-worthy static card — clean, high-contrast design.
 * Key terms (wrapped in **bold**) are rendered bold automatically.
 */
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function RememberThisCard({
  content,
  xpValue = 5,
  dir = "ltr",
}: RememberThisCardProps) {
  return (
    <div
      dir={dir}
      className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden"
      style={{
        borderLeft: dir === "rtl" ? undefined : "6px solid #F9A825",
        borderRight: dir === "rtl" ? "6px solid #F9A825" : undefined,
      }}
    >
      <div className="p-5 space-y-3">
        <XpBadge xp={xpValue} show position={dir === "rtl" ? "top-left" : "top-right"} />

        {/* Header */}
        <p
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: "#F9A825" }}
        >
          🧠 Remember This
        </p>

        {/* Content */}
        <p className="text-[16px] leading-relaxed text-foreground">
          {renderContent(content)}
        </p>

        {/* Camera hint */}
        <div className="flex justify-end mt-2">
          <Camera className="h-4 w-4 opacity-25" />
        </div>
      </div>
    </div>
  );
}
