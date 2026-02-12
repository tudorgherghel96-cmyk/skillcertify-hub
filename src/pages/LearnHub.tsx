import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle, Lock, BookOpen, Target, ClipboardCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MODULES } from "@/data/courseData";
import { moduleThumbnails } from "@/data/mediaMap";
import {
  useProgress,
  getModuleProgress,
  getLessonsCompleted,
  isPracticeUnlocked,
  isGqaUnlocked,
  isModuleComplete,
  isModuleUnlocked,
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

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-5 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-lg font-bold text-foreground">Modules & Lessons</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          5 modules • Complete lessons → Practice → GQA test
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
                      : !unlocked
                      ? "opacity-40"
                      : "border-border hover:border-primary/20 hover:shadow-sm"
                  }`}
                >
                  {moduleThumbnails[mod.id] && (
                    <div className="w-full bg-muted/30" style={{ aspectRatio: "16/7" }}>
                      <img
                        src={moduleThumbnails[mod.id]}
                        alt={`Module ${mod.id}`}
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
                        <h3 className="font-semibold text-sm leading-tight">
                          Module {mod.id}: {mod.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lessonsComplete}/{mod.lessons.length} lessons • {mod.topics.length} topics
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>

                    {unlocked && !complete && (
                      <Progress value={percent} className="h-1.5" />
                    )}

                    {unlocked && (
                      <div className="flex gap-4 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{lessonsComplete}/{mod.lessons.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{mp.practice.bestScore > 0 ? `${mp.practice.bestScore}%` : "—"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClipboardCheck className="h-3 w-3" />
                          <span>{complete ? `✅ ${mp.gqa.score}%` : mp.gqa.passed === false ? "❌ Failed" : "—"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
