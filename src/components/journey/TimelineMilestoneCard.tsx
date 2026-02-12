import { motion } from "framer-motion";
import { Check, Lock, ChevronDown, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { LucideIcon } from "lucide-react";

export type MilestoneStatus =
  | "locked"
  | "next"
  | "in_progress"
  | "complete"
  | "awaiting_verification"
  | "issued";

interface MilestoneCardProps {
  index: number;
  title: string;
  icon: LucideIcon;
  status: MilestoneStatus;
  progressText?: string;
  progressPercent?: number;
  timeEstimate?: string;
  ctaLabel?: string;
  ctaTo?: string;
  onCtaClick?: () => void;
  details: {
    whatYouDo: string;
    whatYouNeed: string;
    whyMatters: string;
    whatsNext: string;
  };
  isLast?: boolean;
}

const STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; pillClass: string; nodeClass: string }
> = {
  locked: {
    label: "Locked",
    pillClass: "bg-muted text-muted-foreground",
    nodeClass: "border-border bg-muted",
  },
  next: {
    label: "Next",
    pillClass: "bg-primary/15 text-primary",
    nodeClass: "border-primary bg-primary/10",
  },
  in_progress: {
    label: "In Progress",
    pillClass: "bg-primary/15 text-primary",
    nodeClass: "border-primary bg-primary/10",
  },
  complete: {
    label: "Complete",
    pillClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    nodeClass: "border-emerald-500 bg-emerald-500",
  },
  awaiting_verification: {
    label: "Awaiting Verification",
    pillClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    nodeClass: "border-amber-500 bg-amber-100 dark:bg-amber-900/30",
  },
  issued: {
    label: "Issued",
    pillClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    nodeClass: "border-emerald-500 bg-emerald-500",
  },
};

export default function TimelineMilestoneCard({
  index,
  title,
  icon: Icon,
  status,
  progressText,
  progressPercent,
  timeEstimate,
  ctaLabel,
  ctaTo,
  onCtaClick,
  details,
  isLast = false,
}: MilestoneCardProps) {
  const config = STATUS_CONFIG[status];
  const isActive = status === "next" || status === "in_progress";
  const isComplete = status === "complete" || status === "issued";
  const isLocked = status === "locked";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex gap-3">
        {/* Timeline spine */}
        <div className="flex flex-col items-center">
          <motion.div
            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 ${config.nodeClass}`}
            animate={isActive ? { scale: [1, 1.06, 1] } : {}}
            transition={isActive ? { repeat: Infinity, duration: 2.5 } : {}}
          >
            {isComplete ? (
              <Check className="h-5 w-5 text-primary-foreground" />
            ) : isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Icon className="h-5 w-5 text-primary" />
            )}
          </motion.div>
          {!isLast && (
            <div
              className={`w-0.5 flex-1 min-h-[24px] ${
                isComplete ? "bg-emerald-500" : "bg-border"
              }`}
            />
          )}
        </div>

        {/* Card content */}
        <div className={`flex-1 pb-4 ${isLocked ? "opacity-50" : ""}`}>
          <Collapsible>
            <div className="rounded-xl border bg-card p-3.5 shadow-sm">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`font-semibold text-sm leading-tight ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap badge-sm ${config.pillClass}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                    {progressText && <span>{progressText}</span>}
                    {timeEstimate && (
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {timeEstimate}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {progressPercent != null && (
                    <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>

                {!isLocked && (
                  <CollapsibleTrigger className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted shrink-0 min-h-0 min-w-0">
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                )}
              </div>

              {/* CTA */}
              {!isLocked && ctaLabel && (
                <div className="mt-3">
                  {ctaTo ? (
                    <Button asChild size="sm" className="h-9 w-full">
                      <Link to={ctaTo}>
                        {ctaLabel} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : onCtaClick ? (
                    <Button size="sm" className="h-9 w-full" onClick={onCtaClick}>
                      {ctaLabel} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                </div>
              )}

              {/* Expandable details */}
              {!isLocked && (
                <CollapsibleContent>
                  <div className="mt-3 pt-3 border-t border-border space-y-2.5 text-xs text-muted-foreground">
                    <Detail label="What you'll do" text={details.whatYouDo} />
                    <Detail label="What you need" text={details.whatYouNeed} />
                    <Detail label="Why this matters" text={details.whyMatters} />
                    <Detail label="What happens next" text={details.whatsNext} />
                  </div>
                </CollapsibleContent>
              )}
            </div>
          </Collapsible>
        </div>
      </div>
    </motion.div>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-semibold text-foreground text-[11px]">{label}</p>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
