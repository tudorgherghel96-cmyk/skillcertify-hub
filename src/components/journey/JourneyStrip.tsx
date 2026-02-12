import { motion } from "framer-motion";
import { BookOpen, Target, ClipboardCheck, Award, ShieldCheck, CreditCard, Check, Lock } from "lucide-react";
import { useProgress, getModuleProgress, isModuleComplete, allGqaPassed, areAllLessonsComplete } from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";
import { useRef, useEffect } from "react";

interface Step {
  id: number;
  label: string;
  icon: typeof BookOpen;
  status: "complete" | "current" | "locked";
  percent: number;
}

function useJourneySteps(): Step[] {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();

  const allLessonsDone = MODULES.every((m) => {
    const mp = getModuleProgress(progress, m.id);
    return areAllLessonsComplete(mp, m.lessons.length);
  });

  const lessonsPercent = (() => {
    let done = 0, total = 0;
    MODULES.forEach(m => {
      total += m.lessons.length;
      const mp = getModuleProgress(progress, m.id);
      m.lessons.forEach(l => { if (mp.lessons[l.id]?.completed) done++; });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  })();

  const allPractice80 = MODULES.every(m => getModuleProgress(progress, m.id).practice.bestScore >= 80);
  const practicePercent = (() => {
    const scores = MODULES.map(m => Math.min(getModuleProgress(progress, m.id).practice.bestScore, 100));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const gqaPassedCount = MODULES.filter(m => isModuleComplete(getModuleProgress(progress, m.id))).length;
  const gqaPercent = Math.round((gqaPassedCount / 5) * 100);
  const allGqa = allGqaPassed(progress, isSuperUser);

  const cscsPassed = progress.cscs.passed === true;

  const getStatus = (done: boolean, prevDone: boolean): "complete" | "current" | "locked" => {
    if (done) return "complete";
    if (prevDone) return "current";
    return "locked";
  };

  return [
    { id: 1, label: "Lessons", icon: BookOpen, status: getStatus(allLessonsDone, true), percent: lessonsPercent },
    { id: 2, label: "Practice", icon: Target, status: getStatus(allPractice80, allLessonsDone), percent: practicePercent },
    { id: 3, label: "5× GQA", icon: ClipboardCheck, status: getStatus(allGqa, allPractice80), percent: gqaPercent },
    { id: 4, label: "Level 1", icon: Award, status: getStatus(allGqa, allGqa), percent: allGqa ? 100 : 0 },
    { id: 5, label: "CSCS Test", icon: ShieldCheck, status: getStatus(cscsPassed, allGqa), percent: cscsPassed ? 100 : 0 },
    { id: 6, label: "Green Card", icon: CreditCard, status: getStatus(cscsPassed, cscsPassed), percent: cscsPassed ? 100 : 0 },
  ];
}

export default function JourneyStrip() {
  const steps = useJourneySteps();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIdx = steps.findIndex(s => s.status === "current");

  useEffect(() => {
    if (scrollRef.current && currentIdx >= 0) {
      const el = scrollRef.current.children[currentIdx] as HTMLElement;
      if (el) {
        el.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentIdx]);

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide py-1 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";
          const isLocked = step.status === "locked";

          return (
            <motion.div
              key={step.id}
              className={`flex-shrink-0 flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 min-w-[72px] transition-all ${
                isCurrent
                  ? "bg-primary/10 border border-primary/30"
                  : isComplete
                  ? "bg-primary/5"
                  : "bg-muted/30 opacity-50"
              }`}
              style={{ scrollSnapAlign: "center" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isLocked ? 0.5 : 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-muted"
                }`}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : isLocked ? (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Icon className={`h-4 w-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </div>
              <span className={`text-[10px] font-medium leading-tight text-center ${
                isCurrent ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
              {step.percent > 0 && step.percent < 100 && (
                <span className="text-[9px] text-primary font-semibold">{step.percent}%</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
