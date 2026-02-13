import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  ArrowRight,
  Lock,
  ChevronRight,
  CheckCircle,
  BookOpen,
  Target,
  ClipboardCheck,
  Trophy,
  Zap,
  Timer,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
  allGqaPassed,
  getOverallProgress,
  getNextAction,
  canResitGqa,
  hoursUntilResit,
} from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { ui } from "@/i18n/translations";
import StreakBanner from "@/components/gamification/StreakBanner";
import BadgesGrid from "@/components/gamification/BadgesGrid";
import SmartNudges from "@/components/gamification/SmartNudges";
import MotivationalBanner from "@/components/gamification/MotivationalBanner";
import SocialProofNudge from "@/components/gamification/SocialProofNudge";
import DailyGoalRing from "@/components/gamification/DailyGoalRing";
import DailyGoalSelector from "@/components/gamification/DailyGoalSelector";
import ProgressDecayBar from "@/components/gamification/ProgressDecayBar";
import QuickSession from "@/components/practice/QuickSession";
import ReadinessCard from "@/components/readiness/ReadinessCard";
import WelcomeVideo from "@/components/dashboard/WelcomeVideo";
import DueToday from "@/components/dashboard/DueToday";
import PerformanceCard from "@/components/dashboard/PerformanceCard";

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.015, y: -2, transition: { duration: 0.25, ease: "easeOut" as const } },
};

const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const GlassCard = ({ children, className = "", hoverable = true, ...props }: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  [key: string]: any;
}) => (
  <motion.div
    variants={hoverable ? cardHover : undefined}
    initial="rest"
    whileHover={hoverable ? "hover" : undefined}
    className={`glass-card rounded-xl ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

const Dashboard = () => {
  const [quickMode, setQuickMode] = useState<"drill" | "blitz" | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || el.scrollTop > 10) return;
    const diff = e.changedTouches[0].clientY - startY.current;
    if (diff > 80) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        window.location.reload();
      }, 800);
    }
  }, []);

  const { progress } = useProgress();
  const { gamification, badges, nudges, motivationalMessage, refreshLessonStrength } = useGamification();
  const { language } = useLanguage();
  const { isSuperUser } = useSuperUser();
  const lang = language.code;
  const overall = getOverallProgress(progress);
  const nextAction = getNextAction(progress);
  const showCscs = allGqaPassed(progress, isSuperUser);
  const gqaPassed = MODULES.filter((m) => isModuleComplete(getModuleProgress(progress, m.id))).length;

  // Show daily goal selector on first login if not set
  useEffect(() => {
    if (!gamification.dailyGoalSet) {
      const timer = setTimeout(() => setShowGoalSelector(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [gamification.dailyGoalSet]);

  return (
    <>
      <div className="aura-bg" />

      {showGoalSelector && (
        <DailyGoalSelector onComplete={() => setShowGoalSelector(false)} />
      )}

      <motion.div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="px-4 py-6 max-w-2xl mx-auto space-y-5 pb-24 relative"
        variants={staggerChildren}
        initial="hidden"
        animate="show"
      >
        {refreshing && (
          <div className="flex justify-center py-2">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {quickMode && (
          <QuickSession mode={quickMode} onClose={() => setQuickMode(null)} />
        )}

        {/* Welcome */}
        <motion.div variants={fadeUp}>
          <h1 className="text-xl sm:text-2xl font-bold">
            {ui("welcome_back", lang)} <span className="text-primary">{ui("fastest_route", lang)}</span>
          </h1>
        </motion.div>

        {/* Welcome Video */}
        <motion.div variants={fadeUp}>
          <WelcomeVideo />
        </motion.div>

        {/* Due Today — Spaced Recall */}
        <motion.div variants={fadeUp}>
          <DueToday />
        </motion.div>

        {/* Streak Banner */}
        <motion.div variants={fadeUp}>
          <StreakBanner
            streak={gamification.streak}
            frozen={gamification.streakFrozen}
            freezesAvailable={gamification.streakFreezesAvailable}
          />
        </motion.div>

        {/* Social Proof */}
        <motion.div variants={fadeUp}>
          <SocialProofNudge />
        </motion.div>

        {/* Daily Goal Ring */}
        {gamification.dailyGoalSet && (
          <motion.div variants={fadeUp}>
            <GlassCard hoverable={false}>
              <CardContent className="py-4 flex items-center justify-center gap-6">
                <DailyGoalRing />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Daily Goal</p>
                  <p className="text-xs text-muted-foreground">
                    Level {gamification.level} · {gamification.totalXp.toLocaleString()} XP total
                  </p>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Motivational Message */}
        <motion.div variants={fadeUp}>
          <MotivationalBanner message={motivationalMessage} />
        </motion.div>

        {/* Smart Nudges */}
        <motion.div variants={fadeUp}>
          <SmartNudges nudges={nudges} />
        </motion.div>

        {/* Quick Session Buttons */}
        {!quickMode && (
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            <GlassCard>
              <Button
                onClick={() => setQuickMode("drill")}
                variant="ghost"
                className="w-full h-14 flex flex-col items-center gap-0.5"
              >
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold">Quick Drill</span>
              </Button>
            </GlassCard>
            <GlassCard>
              <Button
                onClick={() => setQuickMode("blitz")}
                variant="ghost"
                className="w-full h-14 flex flex-col items-center gap-0.5"
              >
                <Timer className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold">2-Min Blitz</span>
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {/* Overall progress */}
        <motion.div variants={fadeUp}>
          <GlassCard>
            <CardContent className="pt-5 pb-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm">
                  {ui("module_of", lang, overall.modulesComplete)} — {ui("gqa_passed", lang, gqaPassed, gqaPassed !== 1 ? "s" : "")}
                </span>
                <span className="text-xs text-muted-foreground">{overall.percentage}%</span>
              </div>
              <Progress value={overall.percentage} className="h-2.5" />

              {nextAction && (
                <Button asChild className="w-full h-12 mt-1">
                  <Link
                    to={
                      nextAction.moduleId === 0
                        ? "/cscs-prep"
                        : nextAction.lessonId
                        ? `/lesson/${nextAction.moduleId}/${nextAction.lessonId}`
                        : isGqaUnlocked(getModuleProgress(progress, nextAction.moduleId), isSuperUser)
                        ? `/gqa-test/${nextAction.moduleId}`
                        : `/practice/${nextAction.moduleId}`
                    }
                  >
                    {nextAction.label} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">{gamification.streak}</p>
                  <p className="text-[10px] text-muted-foreground">{ui("day_streak", lang)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">{gamification.totalXp}</p>
                  <p className="text-[10px] text-muted-foreground">XP</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">
                    {badges.filter((b) => b.earned).length}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{ui("badges", lang)}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">
                    {gamification.level}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Level</p>
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Readiness Index */}
        <motion.div variants={fadeUp}>
          <ReadinessCard />
        </motion.div>

        {/* Pass Probability */}
        <motion.div variants={fadeUp}>
          <PerformanceCard />
        </motion.div>

        {/* Closed-book reminder */}
        <motion.div variants={fadeUp}>
          <GlassCard hoverable={false}>
            <div className="flex items-start gap-3 p-4">
              <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm leading-snug">
                <span className="font-semibold">{ui("closed_book_title", lang)}</span> — {ui("closed_book_desc", lang)}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Module cards */}
        <div className="space-y-3">
          {MODULES.map((mod, index) => {
            const mp = getModuleProgress(progress, mod.id);
            const unlocked = isModuleUnlocked(progress, mod.id, isSuperUser);
            const lessonsComplete = getLessonsCompleted(mp, mod.lessons.length);
            const practiceReady = isPracticeUnlocked(mp, mod.lessons.length, isSuperUser);
            const gqaReady = isGqaUnlocked(mp, isSuperUser);
            const complete = isModuleComplete(mp);
            const Icon = mod.icon;
            const failed = mp.gqa.passed === false;

            return (
              <motion.div key={mod.id} variants={fadeUp}>
                <Link
                  to={unlocked ? `/module/${mod.id}` : "#"}
                  className={!unlocked ? "pointer-events-none" : ""}
                >
                  <GlassCard
                    className={`overflow-hidden transition-colors ${
                      complete
                        ? "border-primary/40"
                        : !unlocked
                        ? "opacity-50"
                        : ""
                    }`}
                    hoverable={unlocked}
                  >
                    {moduleThumbnails[mod.id] && (
                      <div className="w-full overflow-hidden bg-muted/30" style={{ aspectRatio: "16/9" }}>
                        <img
                          src={moduleThumbnails[mod.id]}
                          alt={`Module ${mod.id} thumbnail`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/fallback.webp'; }}
                        />
                      </div>
                    )}
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                            complete ? "bg-primary text-primary-foreground" : "bg-primary/10"
                          }`}
                        >
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
                            {ui("module", lang)} {mod.id}: {mod.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {mod.lessons.length} {ui("lessons", lang).toLowerCase()} • {mod.topics.length} {ui("topics", lang)}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {mod.topics.map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                            {t}
                          </Badge>
                        ))}
                      </div>

                      {unlocked && (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/30">
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-[10px] font-medium">{ui("learn", lang)}</span>
                            <span
                              className={`text-[10px] ${
                                lessonsComplete === mod.lessons.length
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {lessonsComplete}/{mod.lessons.length}
                            </span>
                          </div>
                          <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/30">
                            <Target className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-[10px] font-medium">{ui("practice", lang)}</span>
                            <span
                              className={`text-[10px] ${
                                mp.practice.bestScore >= 80
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {practiceReady
                                ? mp.practice.attempts > 0
                                  ? ui("best_score", lang, mp.practice.bestScore)
                                  : ui("ready", lang)
                                : "🔒"}
                            </span>
                          </div>
                          <div className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-muted/30">
                            <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-[10px] font-medium">GQA</span>
                            <span
                              className={`text-[10px] ${
                                complete
                                  ? "text-primary font-semibold"
                                  : failed
                                  ? "text-destructive font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {complete
                                ? `✅ ${mp.gqa.score}%`
                                : failed
                                ? canResitGqa(mp, isSuperUser)
                                  ? ui("resit_ready", lang)
                                  : `⏳ ${hoursUntilResit(mp)}h`
                                : gqaReady
                                ? ui("ready", lang)
                                : "🔒"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Progress decay bars for completed lessons */}
                      {unlocked && Object.keys(mp.lessons).length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-border/50">
                          {mod.lessons.map((lesson) => {
                            const key = `${mod.id}.${lesson.id}`;
                            const strengthData = gamification.lessonStrength[key];
                            if (!strengthData || !mp.lessons[lesson.id]?.completed) return null;
                            if (strengthData.strength >= 75) return null; // Only show fading ones
                            return (
                              <div key={key} className="space-y-0.5">
                                <span className="text-[10px] text-muted-foreground">L{lesson.id}</span>
                                <ProgressDecayBar
                                  lastReviewed={strengthData.lastReviewed}
                                  onReview={() => refreshLessonStrength(mod.id, lesson.id)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {mp.practice.attempts > 0 && (
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                          <span>Best: <strong className="text-foreground">{mp.practice.bestScore}%</strong></span>
                          <span>Attempts: <strong className="text-foreground">{mp.practice.attempts}</strong></span>
                        </div>
                      )}
                    </CardContent>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Badges */}
        <motion.div variants={fadeUp}>
          <BadgesGrid badges={badges} />
        </motion.div>

        {/* CSCS Card */}
        <motion.div variants={fadeUp}>
          {showCscs ? (
            <GlassCard className="border-primary/30">
              <CardContent className="py-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{ui("all_gqa_complete", lang)}</h3>
                    <p className="text-xs text-muted-foreground">
                      {ui("prepare_cscs", lang)}
                    </p>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button asChild variant="outline" className="h-11">
                    <Link to="/cscs-prep">
                      <Brain className="mr-2 h-4 w-4" /> {ui("cscs_mock_test", lang)}
                    </Link>
                  </Button>
                  <Button asChild className="h-11">
                    <Link to="/cscs-test">
                      {ui("take_cscs_test", lang)} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          ) : (
            <GlassCard hoverable={false} className="opacity-50">
              <CardContent className="py-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-sm">{ui("cscs_test", lang)}</h3>
                  <p className="text-xs text-muted-foreground">
                    {ui("cscs_available_after", lang)}
                  </p>
                </div>
              </CardContent>
            </GlassCard>
          )}
        </motion.div>

        {/* CSCS Route link */}
        <motion.div variants={fadeUp} className="text-center pb-4">
          <Link to="/cscs-route" className="text-xs text-primary hover:underline font-medium">
            {ui("view_roadmap", lang)}
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;
