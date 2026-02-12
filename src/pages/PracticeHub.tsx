import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Zap, Timer, ArrowRight, Lock, ShieldCheck, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MODULES } from "@/data/courseData";
import {
  useProgress,
  getModuleProgress,
  isPracticeUnlocked,
  allGqaPassed,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import QuickSession from "@/components/practice/QuickSession";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function PracticeHub() {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const [quickMode, setQuickMode] = useState<"drill" | "blitz" | null>(null);
  const showCscs = allGqaPassed(progress, isSuperUser);

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

      <motion.div variants={fadeUp}>
        <h1 className="text-lg font-bold text-foreground">Practice & Test</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          3 modes: Quick Drill, Targeted Practice, Mock CSCS Test
        </p>
      </motion.div>

      {/* Quick sessions */}
      <motion.div variants={fadeUp}>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Quick Sessions</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setQuickMode("drill")}
            variant="outline"
            className="h-20 flex flex-col items-center gap-1.5 border-border active:scale-[0.97] transition-transform"
          >
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold">Quick Drill</span>
            <span className="text-[10px] text-muted-foreground">~5 min • Spaced recall</span>
          </Button>
          <Button
            onClick={() => setQuickMode("blitz")}
            variant="outline"
            className="h-20 flex flex-col items-center gap-1.5 border-border active:scale-[0.97] transition-transform"
          >
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold">2-Min Blitz</span>
            <span className="text-[10px] text-muted-foreground">Speed challenge</span>
          </Button>
        </div>
      </motion.div>

      {/* Adaptive Boost */}
      <motion.div variants={fadeUp}>
        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="py-0">
            <Link to="/boost-drill" className="flex items-center gap-3 py-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Adaptive Boost Drill</p>
                <p className="text-xs text-muted-foreground">AI picks your weakest concepts</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Targeted Practice — Module quizzes */}
      <motion.div variants={fadeUp} className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Targeted Practice</p>
        {MODULES.map((mod) => {
          const mp = getModuleProgress(progress, mod.id);
          const ready = isPracticeUnlocked(mp, mod.lessons.length, isSuperUser);
          const passed80 = mp.practice.bestScore >= 80;

          return (
            <Link
              key={mod.id}
              to={ready ? `/practice/${mod.id}` : "#"}
              className={!ready ? "pointer-events-none" : ""}
            >
              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                ready ? "border-border hover:border-primary/20 bg-card active:scale-[0.99]" : "border-border opacity-40"
              }`}>
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                  passed80 ? "bg-primary text-primary-foreground" : ready ? "bg-primary/10" : "bg-muted"
                }`}>
                  {!ready ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Target className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">M{mod.id}: {mod.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {ready
                      ? mp.practice.attempts > 0
                        ? `Best: ${mp.practice.bestScore}% • ${mp.practice.attempts} attempt${mp.practice.attempts !== 1 ? "s" : ""}`
                        : "Ready — tap to start"
                      : `Complete all ${mod.lessons.length} lessons first`}
                  </p>
                </div>
                {ready && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* CSCS Mock / Test */}
      <motion.div variants={fadeUp}>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">CSCS Health & Safety</p>
        <Card className={showCscs ? "border-primary/30" : "opacity-50"}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                showCscs ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {showCscs ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">CSCS Health & Safety Test</p>
                <p className="text-xs text-muted-foreground">
                  {showCscs ? "All GQA modules passed — you're ready" : "Pass all 5 GQA modules first"}
                </p>
              </div>
            </div>
            {showCscs && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button asChild variant="outline" size="sm" className="active:scale-[0.97] transition-transform">
                  <Link to="/cscs-prep"><Brain className="mr-1.5 h-4 w-4" /> Mock Test</Link>
                </Button>
                <Button asChild size="sm" className="active:scale-[0.97] transition-transform">
                  <Link to="/cscs-test">Take Test <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
