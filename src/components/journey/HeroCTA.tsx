import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Target, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useProgress,
  getModuleProgress,
  getNextAction,
  allGqaPassed,
  areAllLessonsComplete,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";

export default function HeroCTA() {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const nextAction = getNextAction(progress);
  const showCscs = allGqaPassed(progress, isSuperUser);

  const getHeroInfo = () => {
    if (showCscs && progress.cscs.passed !== true) {
      return {
        icon: ShieldCheck,
        title: "You're ready for the CSCS test",
        subtitle: "All 5 tests passed — take the final one",
        cta: "Prepare for CSCS test",
        to: "/cscs-prep",
        gradient: "from-primary to-primary/80",
      };
    }
    if (nextAction) {
      const isLesson = !!nextAction.lessonId;
      const isPractice = !nextAction.lessonId && nextAction.moduleId > 0;
      return {
        icon: isLesson ? BookOpen : isPractice ? Target : ClipboardCheck,
        title: nextAction.label,
        subtitle: isLesson
          ? "Continue where you left off"
          : isPractice
          ? "Score 80%+ to unlock the next step"
          : "Closed-book test",
        cta: isLesson ? "Continue" : isPractice ? "Start practice" : "Start test",
        to: nextAction.moduleId === 0
          ? "/cscs-prep"
          : nextAction.lessonId
          ? `/lesson/${nextAction.moduleId}/${nextAction.lessonId}`
          : `/practice/${nextAction.moduleId}`,
        gradient: "from-primary to-primary/80",
      };
    }
    return null;
  };

  const hero = getHeroInfo();
  if (!hero) return null;

  const Icon = hero.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${hero.gradient} p-5 text-primary-foreground`}>
        <div className="relative z-10 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">{hero.title}</p>
              <p className="text-xs opacity-80 mt-0.5">{hero.subtitle}</p>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="w-full h-12 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            <Link to={hero.to}>
              {hero.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary-foreground/5" />
      </div>
    </motion.div>
  );
}
