import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XpBadge from "./shared/XpBadge";
import { triggerHaptic } from "@/lib/haptics";

interface Panel {
  id: string;
  front: string; // e.g. "?" or an icon/emoji
  back: string;  // revealed content
}

interface TapToRevealCardProps {
  panels: Panel[];
  layout?: "2x2" | "1x4";
  xpValue?: number;
  dir?: "ltr" | "rtl";
  onComplete?: (totalXp: number) => void;
}

export default function TapToRevealCard({
  panels,
  layout = "2x2",
  xpValue = 3,
  dir = "ltr",
  onComplete,
}: TapToRevealCardProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [totalXp, setTotalXp] = useState(0);
  const [showXp, setShowXp] = useState(false);

  const handleReveal = (id: string) => {
    if (revealed.has(id)) return;
    const next = new Set(revealed).add(id);
    setRevealed(next);
    triggerHaptic("tap");

    const earned = xpValue;
    setTotalXp(prev => {
      const newTotal = prev + earned;
      if (next.size === panels.length) {
        // Bonus XP for completing all
        const bonus = newTotal + 5;
        setTotalXp(bonus);
        onComplete?.(bonus);
        setShowXp(true);
        return bonus;
      }
      setShowXp(true);
      return newTotal;
    });
  };

  const gridClass = layout === "2x2"
    ? "grid grid-cols-2 gap-3"
    : "flex flex-col gap-2";

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Deep purple accent top */}
      <div className="h-1 w-full" style={{ background: "#4A148C" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={totalXp} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />

        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#4A148C" }}>
          👆 Tap to Reveal
        </p>

        <div className={gridClass}>
          {panels.map(panel => {
            const isRevealed = revealed.has(panel.id);
            return (
              <div
                key={panel.id}
                className="relative"
                style={{ perspective: 600 }}
                onClick={() => handleReveal(panel.id)}
              >
                <motion.div
                  animate={{ rotateY: isRevealed ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d", position: "relative", minHeight: 80 }}
                  className="cursor-pointer"
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl border-2 font-bold text-xl select-none"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      borderColor: "#4A148C",
                      background: "rgba(74,20,140,0.07)",
                      color: "#4A148C",
                    }}
                  >
                    {panel.front}
                  </div>
                  {/* Back */}
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl border-2 p-2 text-center text-sm font-medium select-none"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderColor: "#7B1FA2",
                      background: "#EDE7F6",
                      color: "#4A148C",
                    }}
                  >
                    {panel.back}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {revealed.size === panels.length && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm font-semibold"
              style={{ color: "#4A148C" }}
            >
              🎉 All revealed! +5 bonus XP
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
