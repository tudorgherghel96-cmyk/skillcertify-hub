import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Lock, ChevronRight, BookOpen, ClipboardCheck, Award, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useProgress,
  getModuleProgress,
  isModuleComplete,
  allGqaPassed,
  areAllLessonsComplete,
  getOverallProgress,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  timeEstimate: string;
  requirements: string;
  icon: typeof BookOpen;
  status: "complete" | "current" | "locked";
  ctaLabel?: string;
  ctaTo?: string;
}

function useTimelineSteps(): TimelineStep[] {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();

  const allLessonsDone = MODULES.every(m => areAllLessonsComplete(getModuleProgress(progress, m.id), m.lessons.length));
  const allGqa = allGqaPassed(progress, isSuperUser);
  const cscsPassed = progress.cscs.passed === true;

  const st = (done: boolean, prev: boolean): "complete" | "current" | "locked" =>
    done ? "complete" : prev ? "current" : "locked";

  return [
    {
      id: 1, title: "Complete Each Course Topic", description: "Study 5 modules covering health & safety, manual handling, working at height, health risks, and plant safety.",
      timeEstimate: "~6 hours", requirements: "Sequential completion", icon: BookOpen,
      status: st(allLessonsDone, true), ctaLabel: "Continue Lessons", ctaTo: "/learn",
    },
    {
      id: 2, title: "Pass Each Assessment Test", description: "Pass all 5 topic assessment tests. 80% pass mark. Retake as many times as you need.",
      timeEstimate: "~3 hours", requirements: "All topics complete", icon: ClipboardCheck,
      status: st(allGqa, allLessonsDone), ctaLabel: "Take Tests", ctaTo: "/learn",
    },
    {
      id: 3, title: "Get Level 1 Certificate", description: "Automatically issued when all 5 assessment tests are passed.",
      timeEstimate: "As fast as 1 day", requirements: "All 5 tests passed", icon: Award,
      status: st(allGqa, allGqa),
    },
    {
      id: 4, title: "Pass the CSCS Test", description: "Final closed-book test covering all 5 modules. No notes allowed — this is what earns your card.",
      timeEstimate: "~90 mins", requirements: "Level 1 Certificate", icon: ShieldCheck,
      status: st(cscsPassed, allGqa), ctaLabel: "Prepare for CSCS", ctaTo: "/cscs-prep",
    },
    {
      id: 5, title: "Get the Green Card", description: "Same-day processing via CSCS Partner Alliance. No test centre visit needed — fully online.",
      timeEstimate: "As fast as next day", requirements: "CSCS test passed", icon: CreditCard,
      status: st(cscsPassed, cscsPassed),
    },
  ];
}

export default function JourneyTimeline() {
  const steps = useTimelineSteps();
  const currentIdx = steps.findIndex(s => s.status === "current");

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isComplete = step.status === "complete";
        const isCurrent = step.status === "current";
        const isLocked = step.status === "locked";

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex gap-4">
              {/* Vertical line + node */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isComplete
                      ? "bg-primary border-primary"
                      : isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={isCurrent ? { repeat: Infinity, duration: 2.5 } : {}}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Icon className="h-5 w-5 text-primary" />
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[16px] ${isComplete ? "bg-primary" : "bg-border"}`} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 pt-1 flex-1 ${isLocked ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-sm ${isCurrent ? "text-primary" : "text-foreground"}`}>
                    {step.title}
                  </h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      YOU ARE HERE
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
                  <span>⏱ {step.timeEstimate}</span>
                  <span>• {step.requirements}</span>
                </div>
                {isCurrent && step.ctaTo && (
                  <Button asChild size="sm" className="mt-3 h-9">
                    <Link to={step.ctaTo}>
                      {step.ctaLabel} <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
