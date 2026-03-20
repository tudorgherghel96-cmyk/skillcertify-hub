import { Brain } from "lucide-react";
import { formatRememberText } from "@/lib/formatRememberText";

interface RememberThisProps {
  text: string;
}

const RememberThis = ({ text }: RememberThisProps) => {
  const parsed = formatRememberText(text);

  return (
    <div className="border-2 border-destructive/60 rounded-xl p-4 bg-destructive/5">
      <div className="flex items-start gap-2">
        <Brain className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="w-full">
          <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-1">
            Remember This
          </p>

          {parsed.title && (
            <p className="text-sm font-bold text-foreground mb-2">{parsed.title}</p>
          )}

          {parsed.items.length > 0 ? (
            <div className="flex flex-col gap-2">
              {parsed.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  {item.type === "numbered" && (
                    <span className="shrink-0 h-5 w-5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {item.number}
                    </span>
                  )}
                  {item.type === "keyvalue" && (
                    <span className="shrink-0 h-5 w-5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {item.key}
                    </span>
                  )}
                  <p className="text-[15px] leading-relaxed text-foreground">
                    {item.type === "keyvalue" ? (
                      <>
                        <span className="font-semibold">{item.text.split(/\s*[-–—]\s*/)[0]}</span>
                        {item.text.includes("—") && (
                          <span> — {item.text.split(/\s*[-–—]\s+/).slice(1).join(" — ")}</span>
                        )}
                      </>
                    ) : (
                      item.text
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[15px] leading-relaxed text-foreground font-medium">
              {parsed.fallback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RememberThis;
