import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Timer, ArrowRight, Target, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  useProgress,
  getOverallProgress,
  getNextAction,
  allGqaPassed,
  getModuleProgress,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";
import DueToday from "@/components/dashboard/DueToday";
import QuickSession from "@/components/practice/QuickSession";
import { supabase } from "@/integrations/supabase/client";

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
  const { gamification } = useGamification();
  const { user } = useAuth();
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const overall = getOverallProgress(progress);
  const nextAction = getNextAction(progress);
  const showCscs = allGqaPassed(progress, isSuperUser);

  // Get first name from user metadata or email
  const rawName = user?.user_metadata?.full_name?.split(" ")[0]
    || user?.email?.split("@")[0]
    || "there";
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

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

      {/* Top bar with greeting */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            {overall.percentage === 0 ? "Get your CSCS Green Card" : `Hey ${firstName} 👋`}
          </h1>
          {overall.percentage > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">Get your CSCS Green Card</p>
          )}
        </div>
        {gamification.streak > 0 && (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <Flame className="h-3.5 w-3.5" />
            {gamification.streak} day{gamification.streak !== 1 ? "s" : ""}
          </div>
        )}
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

      {/* Streak card */}
      {gamification.streak > 0 && (
        <motion.div variants={fadeUp}>
          <Card className="border-primary/10">
            <CardContent className="py-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">🔥</div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {gamification.streak} day streak!
                </p>
                <p className="text-xs text-muted-foreground">Keep it going — study today to stay on track</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Today's goal */}
      <motion.div variants={fadeUp}>
        <Card className="border-primary/10">
          <CardContent className="py-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Today's goal</p>
              <p className="text-xs text-muted-foreground">
                {overall.percentage === 0
                  ? "Complete your first lesson"
                  : overall.percentage < 50
                  ? "Finish 1 lesson today"
                  : "Do a 5-min practice session"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weak areas */}
      <WeakAreasSection />

      {/* Due for review */}
      <motion.div variants={fadeUp}>
        <DueToday />
      </motion.div>
    </motion.div>
  );
}

function WeakAreasSection() {
  const { user } = useAuth();
  const [weakModules, setWeakModules] = useState<Array<{ moduleId: number; score: number }>>([]);

  useEffect(() => {
    if (!user) return;
    const fetchWeak = async () => {
      const { data } = await supabase
        .from("practice_attempts")
        .select("module_id, percentage")
        .eq("user_id", user.id);
      if (!data || data.length === 0) return;

      // Get best score per module
      const best: Record<number, number> = {};
      for (const row of data) {
        const pct = row.percentage ?? 0;
        if (!best[row.module_id] || pct > best[row.module_id]) {
          best[row.module_id] = pct;
        }
      }
      // Find modules with score < 70
      const weak = Object.entries(best)
        .filter(([, score]) => score < 70)
        .map(([id, score]) => ({ moduleId: Number(id), score }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);
      setWeakModules(weak);
    };
    fetchWeak();
  }, [user]);

  if (weakModules.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      <Card className="border-destructive/10">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm font-bold text-foreground">Weak areas</p>
          </div>
          <div className="space-y-2">
            {weakModules.map(({ moduleId, score }) => {
              const mod = MODULES.find((m) => m.id === moduleId);
              return (
                <Link
                  key={moduleId}
                  to={`/practice/${moduleId}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-xs font-medium text-foreground">{mod?.title ?? `Topic ${moduleId}`}</span>
                  <span className="text-xs font-semibold text-destructive">{score}%</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}