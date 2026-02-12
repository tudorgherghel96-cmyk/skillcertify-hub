import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StickyNextActionProps {
  currentMilestone: string;
  nextMilestone: string;
  ctaLabel: string;
  ctaTo: string;
}

export default function StickyNextAction({
  currentMilestone,
  nextMilestone,
  ctaLabel,
  ctaTo,
}: StickyNextActionProps) {
  return (
    <motion.div
      className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 py-2.5 -mx-4"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground truncate">
            You are here: <span className="font-semibold text-foreground">{currentMilestone}</span>
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            Next: {nextMilestone}
          </p>
        </div>
        <Button asChild size="sm" className="h-8 shrink-0 text-xs">
          <Link to={ctaTo}>
            {ctaLabel} <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
