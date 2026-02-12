import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Flame, Zap, Timer, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useGamification } from "@/contexts/GamificationContext";
import {
  useProgress,
  getOverallProgress,
  getNextAction,
  allGqaPassed,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import DueToday from "@/components/dashboard/DueToday";
import QuickSession from "@/components/practice/QuickSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function JourneyDashboard() {
  const [quickMode, setQuickMode] = useState<"drill" | "blitz" | null>(null);
  const { language, setLanguage } = useLanguage();
  const { gamification } = useGamification();
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const overall = getOverallProgress(progress);
  const nextAction = getNextAction(progress);
  const showCscs = allGqaPassed(progress, isSuperUser);

  // Determine step number and label
  const getStepInfo = () => {
    if (overall.percentage === 0) return { step: 1, label: "Start your lessons", to: "/learn" };
    if (!nextAction) return { step: 6, label: "Request your card", to: "/my-card" };
    if (showCscs && !progress.cscs.passed) return { step: 5, label: "Pass your CSCS test", to: "/cscs-prep" };
    const isLesson = !!nextAction.lessonId;
    if (isLesson) return {
      step: 2,
      label: "Finish your lessons",
      to: `/lesson/${nextAction.moduleId}/${nextAction.lessonId}`,
    };
    return {
      step: 3,
      label: nextAction.label,
      to: nextAction.moduleId === 0 ? "/cscs-prep" : `/practice/${nextAction.moduleId}`,
    };
  };

  const stepInfo = getStepInfo();

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-5 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {quickMode && (
        <QuickSession mode={quickMode} onClose={() => setQuickMode(null)} />
      )}

      {/* Top bar */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            {overall.percentage === 0 ? "Get your CSCS Green Card" : "Welcome back 👋"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {gamification.streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Flame className="h-4 w-4" />
              {gamification.streak}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm">
                {language.flag}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang)}
                  className={`gap-2 ${lang.code === language.code ? "bg-primary/10 font-medium" : ""}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.english}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Status card — THE main thing */}
      <motion.div variants={fadeUp}>
        <Card className="border-primary/20">
          <CardContent className="py-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" className="stroke-muted" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28" fill="none"
                    className="stroke-primary"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - overall.percentage / 100)}`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                  {overall.percentage}%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  Step {stepInfo.step} of 6
                </p>
                <p className="text-base font-bold text-foreground leading-tight mt-0.5">
                  {stepInfo.label}
                </p>
              </div>
            </div>
            <Button asChild className="w-full h-12 font-semibold text-base">
              <Link to={stepInfo.to}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      {!quickMode && (
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setQuickMode("drill")}
            variant="outline"
            className="h-14 flex flex-col items-center gap-0.5 border-border active:scale-[0.97] transition-transform"
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold">5-min Practice</span>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 flex flex-col items-center gap-0.5 border-border active:scale-[0.97] transition-transform"
          >
            <Link to="/cscs-prep">
              <Timer className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold">Mock Test</span>
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Due for review */}
      <motion.div variants={fadeUp}>
        <DueToday />
      </motion.div>
    </motion.div>
  );
}
