import { formatRememberText } from "@/lib/formatRememberText";

interface RememberThisProps {
  content: string;
  illustrations?: string[];
  heroImage?: string;
  title?: string;
}

/** Auto-bold text before a colon or ALL-CAPS words */
function highlightKeyTerms(text: string) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 0 && colonIdx < 40) {
    const before = text.slice(0, colonIdx);
    const after = text.slice(colonIdx + 1).trim();
    return (
      <>
        <span className="font-bold text-white">{before}:</span>{" "}
        <span className="text-gray-200">{after}</span>
      </>
    );
  }
  const parts = text.split(/(\b[A-Z]{3,}\b)/g);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, i) =>
          /^[A-Z]{3,}$/.test(part) ? (
            <span key={i} className="font-bold text-amber-300">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }
  return text;
}

export default function RememberThis({ content, illustrations, heroImage, title: explicitTitle }: RememberThisProps) {
  const parsed = formatRememberText(content);
  const hasIllustrations = illustrations && illustrations.length > 0;
  const isCompact = parsed.items.length >= 6 && hasIllustrations;
  const itemCount = parsed.items.length;

  const resolvedTitle = explicitTitle || parsed.title;
  const showHeader = !!resolvedTitle;

  return (
    <div
      className={`text-center rounded-[20px] border border-blue-400/20 ${isCompact ? "py-4 px-3" : "py-6 px-4"}`}
      style={{
        background: "linear-gradient(180deg, rgba(30,40,70,0.95) 0%, rgba(15,15,25,0.98) 40%)",
      }}
    >
      {/* Header - only show when there's a title */}
      {showHeader && (
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className={isCompact ? "text-[24px]" : "text-[32px]"}>🧠</span>
          <p className={`text-blue-400 font-extrabold tracking-[3px] uppercase ${isCompact ? "text-[10px]" : "text-xs"}`}>
            Remember This
          </p>
        </div>
      )}
      {showHeader && (
        <div className={`bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto ${isCompact ? "w-24 h-[2px] mb-3" : "w-32 h-[2px] mb-4"}`} />
      )}

      {/* Hero image */}
      {heroImage && (
        <div className={`mx-auto overflow-hidden rounded-xl ${showHeader ? "mb-4 max-w-sm" : "mb-3"}`}>
          <img
            src={heroImage}
            alt="Remember this"
            className={`w-full h-auto object-contain rounded-xl ${showHeader ? "max-h-[240px]" : "max-h-[360px]"}`}
            loading="lazy"
          />
        </div>
      )}

      {resolvedTitle && (
        <p className={`text-white font-extrabold uppercase tracking-wide mb-3 ${isCompact ? "text-sm" : "text-[17px]"}`}>
          {resolvedTitle}
        </p>
      )}

      {parsed.items.length > 0 ? (
        <div className={`text-left max-w-sm mx-auto ${isCompact ? "grid grid-cols-2 gap-2" : "flex flex-col gap-3"}`}>
          {parsed.items.map((item, i) => {
            const illustrationSrc = item.type === "numbered" && illustrations && item.number
              ? illustrations[item.number - 1]
              : undefined;

            return (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl border border-white/[0.08] ${isCompact ? "p-2" : "p-3"}`}
                style={{
                  background: item.type === "numbered"
                    ? `linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0.04) 100%)`
                    : "rgba(255,255,255,0.04)",
                }}
              >
                <div className={`flex items-start ${isCompact ? "gap-2" : "gap-3"}`}>
                  {illustrationSrc ? (
                    <img
                      src={illustrationSrc}
                      alt={`Step ${item.number}`}
                      className={`shrink-0 rounded-lg object-cover shadow-lg ${isCompact ? "h-10 w-10" : "h-14 w-14"}`}
                      loading="lazy"
                    />
                  ) : (
                    <>
                      {item.type === "numbered" && (
                        <span className={`shrink-0 rounded-lg bg-blue-500/30 text-blue-200 font-extrabold flex items-center justify-center ${isCompact ? "h-6 w-6 text-[11px]" : "h-8 w-8 text-sm"}`}>
                          {item.number}
                        </span>
                      )}
                      {item.type === "keyvalue" && (
                        <span className="shrink-0 h-8 w-8 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-extrabold flex items-center justify-center">
                          {item.key}
                        </span>
                      )}
                      {item.type === "bullet" && (
                        <span className="shrink-0 mt-2">
                          <span className="block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                        </span>
                      )}
                    </>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    {illustrationSrc && item.type === "numbered" && (
                      <span className={`text-blue-300 font-bold ${isCompact ? "text-[9px]" : "text-[11px]"}`}>Step {item.number}</span>
                    )}
                    <p className={`text-gray-200 ${isCompact ? "text-[12px] leading-[1.4]" : "text-[15px] leading-[1.7]"}`}>
                      {item.type === "keyvalue" && (
                        <>
                          <span className="font-bold text-white text-[16px]">{item.text.split(/\s*[-–—]\s*/)[0]}</span>
                          {item.text.includes("—") && (
                            <span className="block mt-0.5 text-gray-300"> {item.text.split(/\s*[-–—]\s+/).slice(1).join(" — ")}</span>
                          )}
                        </>
                      )}
                      {item.type === "bullet" && highlightKeyTerms(item.text)}
                      {item.type === "numbered" && highlightKeyTerms(item.text)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-100 text-[17px] font-medium leading-[1.8] max-w-sm mx-auto">
          {parsed.fallback}
        </p>
      )}

      {/* Item count indicator */}
      {itemCount > 3 && !isCompact && (
        <div className="flex justify-center gap-1 mt-4">
          {parsed.items.map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-400/40" />
          ))}
        </div>
      )}
    </div>
  );
}
