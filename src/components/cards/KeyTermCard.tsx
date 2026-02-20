import { useState } from "react";
import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import XpBadge from "./shared/XpBadge";
import { speakWord } from "@/lib/pronunciation";
import { triggerHaptic } from "@/lib/haptics";

interface KeyTermCardProps {
  term: string;
  definition: string;
  translation?: string;         // translated definition in user's language
  translationLanguage?: string; // e.g. "Română"
  xpValue?: number;
  dir?: "ltr" | "rtl";
}

export default function KeyTermCard({
  term,
  definition,
  translation,
  translationLanguage,
  xpValue = 3,
  dir = "ltr",
}: KeyTermCardProps) {
  const [playing, setPlaying] = useState(false);

  const handleSpeak = () => {
    setPlaying(true);
    speakWord(term);
    triggerHaptic("tap");
    setTimeout(() => setPlaying(false), 1600);
  };

  return (
    <div
      dir={dir}
      className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden"
    >
      {/* Purple accent top */}
      <div className="h-1 w-full" style={{ background: "#7B1FA2" }} />

      <div className="p-5 space-y-3">
        <XpBadge xp={xpValue} show position={dir === "rtl" ? "top-left" : "top-right"} />

        {/* Term + pronunciation */}
        <div className="flex items-center gap-3">
          <h2
            className="text-[22px] font-bold leading-tight"
            style={{ color: "#7B1FA2" }}
          >
            {term}
          </h2>
          <button
            onClick={handleSpeak}
            aria-label={`Pronounce ${term}`}
            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            style={{ background: "rgba(123,31,162,0.1)" }}
          >
            {playing ? (
              <motion.div className="flex items-center gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{ background: "#7B1FA2" }}
                    animate={{ height: [4, 14, 6, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            ) : (
              <Volume2 className="h-4 w-4" style={{ color: "#7B1FA2" }} />
            )}
          </button>
        </div>

        {/* Definition */}
        <p className="text-[16px] text-foreground leading-relaxed">{definition}</p>

        {/* Translation */}
        {translation && (
          <div className="pt-1 border-t border-border">
            {translationLanguage && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                {translationLanguage}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{translation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
