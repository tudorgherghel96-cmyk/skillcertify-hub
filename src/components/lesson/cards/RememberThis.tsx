import { formatRememberText } from "@/lib/formatRememberText";

interface RememberThisProps {
  content: string;
  illustrations?: string[];
}

/** Auto-bold text before a colon or ALL-CAPS words */
function highlightKeyTerms(text: string) {
  // Bold text before first colon if present
  const colonIdx = text.indexOf(":");
  if (colonIdx > 0 && colonIdx < 40) {
    const before = text.slice(0, colonIdx);
    const after = text.slice(colonIdx + 1).trim();
    return (
      <>
        <span className="font-semibold text-white">{before}:</span> {after}
      </>
    );
  }
  // Bold ALL CAPS words (3+ chars)
  const parts = text.split(/(\b[A-Z]{3,}\b)/g);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, i) =>
          /^[A-Z]{3,}$/.test(part) ? (
            <span key={i} className="font-semibold text-white">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }
  return text;
}

export default function RememberThis({ content, illustrations }: RememberThisProps) {
  const parsed = formatRememberText(content);
  const hasIllustrations = illustrations && illustrations.length > 0;
  const isCompact = parsed.items.length >= 6 && hasIllustrations;

  return (
    <div
      className={`text-center rounded-[20px] border border-blue-400/20 ${isCompact ? "py-4 px-3" : "py-10 px-5"}`}
      style={{
        background: "linear-gradient(180deg, rgba(30,40,70,0.95) 0%, rgba(15,15,25,0.98) 40%)",
      }}
    >
      <div className={isCompact ? "text-[28px] mb-1" : "text-[40px] mb-3"}>🧠</div>
      <p className={`text-blue-400 font-bold tracking-[2px] uppercase ${isCompact ? "text-[10px] mb-1" : "text-xs mb-2"}`}>
        Remember This
      </p>
      <div className={`bg-blue-400 rounded-sm mx-auto ${isCompact ? "w-8 h-[2px] mb-3" : "w-10 h-[3px] mb-6"}`} />

      {parsed.title && (
        <>
          <p className={`text-white font-bold uppercase tracking-wide ${isCompact ? "text-sm mb-2" : "text-lg mb-3"}`}>
            {parsed.title}
          </p>
          {parsed.items.length > 0 && !isCompact && (
            <div className="w-16 h-px bg-white/10 mx-auto mb-5" />
          )}
        </>
      )}

      {parsed.items.length > 0 ? (
        <div className={`text-left max-w-sm mx-auto ${isCompact ? "grid grid-cols-2 gap-2" : "flex flex-col gap-4"}`}>
          {parsed.items.map((item, i) => {
            const illustrationSrc = item.type === "numbered" && illustrations && item.number
              ? illustrations[item.number - 1]
              : undefined;
            return (
              <div
                key={i}
                className={`flex items-start bg-white/[0.06] border border-white/[0.08] rounded-xl ${isCompact ? "gap-2 px-2 py-2" : "gap-3 px-4 py-3"}`}
              >
                {illustrationSrc ? (
                  <img
                    src={illustrationSrc}
                    alt={`Step ${item.number}`}
                    className={`shrink-0 rounded-lg object-cover ${isCompact ? "h-10 w-10" : "h-14 w-14"}`}
                    loading="lazy"
                  />
                ) : (
                  <>
                    {item.type === "numbered" && (
                      <span className={`shrink-0 rounded-full bg-blue-500/25 text-blue-300 font-bold flex items-center justify-center mt-0.5 ${isCompact ? "h-5 w-5 text-[10px]" : "h-7 w-7 text-xs"}`}>
                        {item.number}
                      </span>
                    )}
                    {item.type === "keyvalue" && (
                      <span className="shrink-0 h-7 w-7 rounded-full bg-blue-500/25 text-blue-300 text-xs font-bold flex items-center justify-center mt-0.5">
                        {item.key}
                      </span>
                    )}
                    {item.type === "bullet" && (
                      <span className="shrink-0 h-2 w-2 rounded-full bg-blue-400 mt-2.5" />
                    )}
                  </>
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  {illustrationSrc && item.type === "numbered" && (
                    <span className={`text-blue-300 font-bold ${isCompact ? "text-[9px]" : "text-xs"}`}>Step {item.number}</span>
                  )}
                  <p className={`text-gray-200 ${isCompact ? "text-[12px] leading-[1.4]" : "text-[16px] leading-[1.8]"}`}>
                    {item.type === "keyvalue" && (
                      <span className="font-semibold text-white">{item.text.split(/\s*[-–—]\s*/)[0]}</span>
                    )}
                    {item.type === "keyvalue" && item.text.includes("—") && (
                      <span> — {item.text.split(/\s*[-–—]\s+/).slice(1).join(" — ")}</span>
                    )}
                    {item.type === "bullet" && highlightKeyTerms(item.text)}
                    {item.type === "numbered" && item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-100 text-[18px] font-medium leading-[1.8] max-w-sm mx-auto">
          {parsed.fallback}
        </p>
      )}
    </div>
  );
}