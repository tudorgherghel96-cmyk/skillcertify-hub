import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import XpBadge from "./shared/XpBadge";

interface SplitScreenCardProps {
  wrongLabel: string;
  correctLabel: string;
  wrongDescription: string;
  correctDescription: string;
  xpValue?: number;
  dir?: "ltr" | "rtl";
  /** When true, left panel slides from left, right panel from right */
  splitEntrance?: boolean;
  onViewed?: () => void;
}

export default function SplitScreenCard({
  wrongLabel,
  correctLabel,
  wrongDescription,
  correctDescription,
  xpValue = 5,
  dir = "ltr",
  splitEntrance = false,
  onViewed,
}: SplitScreenCardProps) {
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setViewed(true);
      onViewed?.();
    }, 1200);
    return () => clearTimeout(t);
  }, [onViewed]);

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      <div className="p-5 space-y-3">
        <XpBadge xp={xpValue} show={viewed} position={dir === "rtl" ? "top-left" : "top-right"} />

        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          ⚖️ Right vs Wrong
        </p>

        <div className="flex gap-2">
          {/* Wrong panel — slides in from left on splitEntrance */}
          <motion.div
            initial={splitEntrance ? { x: -60, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 rounded-xl p-3 space-y-2"
            style={{ border: "3px solid #C62828", background: "#FFEBEE" }}
          >
            <div className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 shrink-0" style={{ color: "#C62828" }} />
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#C62828" }}>
                {wrongLabel}
              </p>
            </div>
            <p className="text-sm text-foreground leading-snug">{wrongDescription}</p>
          </motion.div>

          {/* Correct panel — slides in from right on splitEntrance */}
          <motion.div
            initial={splitEntrance ? { x: 60, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: splitEntrance ? 0.05 : 0 }}
            className="flex-1 rounded-xl p-3 space-y-2"
            style={{ border: "3px solid #2E7D32", background: "#E8F5E9" }}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#2E7D32" }} />
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#2E7D32" }}>
                {correctLabel}
              </p>
            </div>
            <p className="text-sm text-foreground leading-snug">{correctDescription}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
