import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle, Lock, Target, ArrowRight, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MODULES } from "@/data/courseData";
import { moduleThumbnails } from "@/data/mediaMap";
import {
  useProgress,
  getModuleProgress,
  getLessonsCompleted,
  isModuleComplete,
  isModuleUnlocked,
  allGqaPassed,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function LearnHub() {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const showCscs = allGqaPassed(progress, isSuperUser);

  // Find first incomplete topic
  const firstIncompleteMod = MODULES.find((mod) => {
    const mp = getModuleProgress(progress, mod.id);
    const unlocked = isModuleUnlocked(progress, mod.id, isSuperUser);
    return unlocked && !isModuleComplete(mp);
  });

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-6 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Your Lessons */}
      <motion.div variants={fadeUp}>
        <h1 className="text-lg font-bold text-foreground">Your Lessons</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          5 topics — work through them in order
        </p>
      </motion.div>

      <div className="space-y-3">
        {MODULES.map((mod) => {
          const mp = getModuleProgress(progress, mod.id);
          const unlocked = isModuleUnlocked(progress, mod.id, isSuperUser);
          const lessonsComplete = getLessonsCompleted(mp, mod.lessons.length);
          const complete = isModuleComplete(mp);
          const percent = Math.round((lessonsComplete / mod.lessons.length) * 100);
          const Icon = mod.icon;
          const isNext = firstIncompleteMod?.id === mod.id;

          return (
            <motion.div key={mod.id} variants={fadeUp}>
              <Link
                to={unlocked ? `/module/${mod.id}` : "#"}
                className={!unlocked ? "pointer-events-none" : ""}
              >
                <div
                  className={`rounded-xl border bg-card overflow-hidden transition-all ${
                    complete
                      ? "border-primary/30"
                      : isNext
                      ? "border-primary/40 ring-2 ring-primary/20"
                      : !unlocked
                      ? "opacity-40"
                      : "border-border hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  {moduleThumbnails[mod.id] && (
                    <div className="w-full bg-muted/30" style={{ aspectRatio: "16/7" }}>
                      <img
                        src={moduleThumbnails[mod.id]}
                        alt={mod.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/fallback.webp'; }}
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        complete ? "bg-primary text-primary-foreground" : "bg-primary/10"
                      }`}>
                        {!unlocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : complete ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm leading-tight">
                            {mod.title}
                          </h3>
                          {isNext && !complete && (
                            <Badge variant="secondary" className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">
                              NEXT
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lessonsComplete} of {mod.lessons.length} done
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>

                    {unlocked && !complete && (
                      <Progress value={percent} className="h-1.5" />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Practice section */}
      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Practice</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/practice/1">
            <Card className="hover:border-primary/20 transition-all active:scale-[0.98]">
              <CardContent className="py-4 flex flex-col items-center gap-2 text-center">
                <Target className="h-6 w-6 text-primary" />
                <p className="text-sm font-semibold">Quick Practice</p>
                <p className="text-[10px] text-muted-foreground">10 random questions</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/cscs-prep">
            <Card className={`transition-all active:scale-[0.98] ${showCscs ? "hover:border-primary/20" : "opacity-50 pointer-events-none"}`}>
              <CardContent className="py-4 flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="text-sm font-semibold">Mock Test</p>
                <p className="text-[10px] text-muted-foreground">Full timed CSCS mock</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}