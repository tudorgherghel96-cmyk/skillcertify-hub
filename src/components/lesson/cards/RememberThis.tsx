import { formatRememberText } from "@/lib/formatRememberText";

interface RememberThisProps {
  content: string;
}

export default function RememberThis({ content }: RememberThisProps) {
  const parsed = formatRememberText(content);

  return (
    <div
      className="py-10 px-5 text-center rounded-[20px] border border-blue-400/20"
      style={{
        background: "linear-gradient(180deg, rgba(30,40,70,0.95) 0%, rgba(15,15,25,0.98) 40%)",
      }}
    >
      <div className="text-[40px] mb-3">🧠</div>
      <p className="text-blue-400 text-xs font-bold tracking-[2px] uppercase mb-2">
        Remember This
      </p>
      <div className="w-10 h-[3px] bg-blue-400 rounded-sm mx-auto mb-6" />

      {parsed.title && (
        <p className="text-white text-base font-bold uppercase tracking-wide mb-5">
          {parsed.title}
        </p>
      )}

      {parsed.items.length > 0 ? (
        <div className="flex flex-col gap-3 text-left max-w-sm mx-auto">
          {parsed.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3"
            >
              {item.type === "numbered" && (
                <span className="shrink-0 h-7 w-7 rounded-full bg-blue-500/25 text-blue-300 text-xs font-bold flex items-center justify-center mt-0.5">
                  {item.number}
                </span>
              )}
              {item.type === "keyvalue" && (
                <span className="shrink-0 h-7 w-7 rounded-full bg-blue-500/25 text-blue-300 text-xs font-bold flex items-center justify-center mt-0.5">
                  {item.key}
                </span>
              )}
              <p className="text-gray-200 text-[16px] leading-[1.8]">
                {item.type === "keyvalue" && (
                  <span className="font-semibold text-white">{item.text.split(/\s*[-–—]\s*/)[0]}</span>
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
        <p className="text-gray-100 text-[18px] font-medium leading-[1.8] max-w-sm mx-auto">
          {parsed.fallback}
        </p>
      )}
    </div>
  );
}
