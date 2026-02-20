import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XpBadge from "./shared/XpBadge";
import { triggerHaptic } from "@/lib/haptics";

interface PatternPair {
  id: string;
  hazard: string;
  disease: string;
}

interface PatternCardProps {
  pairs: PatternPair[];
  xpValue?: number;
  dir?: "ltr" | "rtl";
  onComplete?: () => void;
}

export default function PatternCard({
  pairs,
  xpValue = 10,
  dir = "ltr",
  onComplete,
}: PatternCardProps) {
  const [active, setActive] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [showXp, setShowXp] = useState(false);

  const handleTap = (id: string) => {
    setActive(prev => (prev === id ? null : id));
    triggerHaptic("tap");
    setReviewed(prev => {
      const next = new Set(prev).add(id);
      if (next.size === pairs.length) {
        setShowXp(true);
        onComplete?.();
      }
      return next;
    });
  };

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Green accent top */}
      <div className="h-1 w-full" style={{ background: "#2E7D32" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={xpValue} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />

        <div className="space-y-0.5">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#2E7D32" }}>
            🔍 Hazard Patterns
          </p>
          <p className="text-xs text-muted-foreground">Tap a hazard to reveal its match</p>
        </div>

        <div className="space-y-2">
          {pairs.map(pair => {
            const isActive = active === pair.id;
            const isReviewed = reviewed.has(pair.id);

            return (
              <div key={pair.id} className="flex gap-2 items-stretch">
                {/* Hazard */}
                <button
                  onClick={() => handleTap(pair.id)}
                  className="flex-1 min-h-[48px] px-3 py-2 rounded-xl border-2 text-sm font-semibold text-start transition-all active:scale-[0.98]"
                  style={{
                    borderColor: isActive ? "#2E7D32" : isReviewed ? "#81C784" : "hsl(var(--border))",
                    background: isActive ? "#E8F5E9" : "white",
                    color: isActive ? "#1B5E20" : "hsl(var(--foreground))",
                  }}
                >
                  {pair.hazard}
                </button>

                {/* Arrow */}
                <div className="flex items-center text-muted-foreground/40 text-lg">→</div>

                {/* Disease / match */}
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex-1 min-h-[48px] px-3 py-2 rounded-xl flex items-center text-sm font-medium"
                      style={{ background: "#E8F5E9", color: "#1B5E20", border: "2px solid #4CAF50" }}
                    >
                      {pair.disease}
                    </motion.div>
                  ) : (
                    <div
                      className="flex-1 min-h-[48px] px-3 py-2 rounded-xl flex items-center text-sm text-muted-foreground/40 border-2"
                      style={{ borderColor: isReviewed ? "#81C784" : "hsl(var(--border))", borderStyle: "dashed" }}
                    >
                      {isReviewed ? pair.disease : "?"}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {reviewed.size === pairs.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-semibold"
              style={{ color: "#2E7D32" }}
            >
              ✅ All patterns reviewed! +{xpValue} XP
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
