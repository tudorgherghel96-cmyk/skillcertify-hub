import { formatRememberText } from "@/lib/formatRememberText";

interface RememberThisProps {
  content: string;
}

export default function RememberThis({ content }: RememberThisProps) {
  const parsed = formatRememberText(content);

  return (
    <div
      className="py-10 px-6 text-center rounded-[20px]"
      style={{
        background: "radial-gradient(ellipse at top, rgba(59,130,246,0.08), transparent)",
      }}
    >
      <div className="text-[40px] mb-3">🧠</div>
      <p className="text-primary text-xs font-bold tracking-[2px] uppercase mb-2">
        Remember This
      </p>
      <div className="w-10 h-[3px] bg-primary rounded-sm mx-auto mb-5" />

      {parsed.title && (
        <p className="text-foreground text-sm font-bold uppercase tracking-wide mb-4">
          {parsed.title}
        </p>
      )}

      {parsed.items.length > 0 ? (
        <div className="flex flex-col gap-3 text-left max-w-sm mx-auto">
          {parsed.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {item.type === "numbered" && (
                <span className="shrink-0 h-6 w-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {item.number}
                </span>
              )}
              {item.type === "keyvalue" && (
                <span className="shrink-0 h-6 w-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {item.key}
                </span>
              )}
              <p className="text-foreground/90 text-[15px] leading-relaxed">
                {item.type === "keyvalue" && (
                  <span className="font-semibold text-foreground">{item.text.split(/\s*[-–—]\s*/)[0]}</span>
                )}
                {item.type === "keyvalue" && item.text.includes("—") && (
                  <span> — {item.text.split(/\s*[-–—]\s+/).slice(1).join(" — ")}</span>
                )}
                {item.type !== "keyvalue" && item.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-foreground text-[17px] font-medium leading-[1.7] max-w-sm mx-auto">
          {parsed.fallback}
        </p>
      )}
    </div>
  );
}
