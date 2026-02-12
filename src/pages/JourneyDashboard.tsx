import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Globe, Flame, Zap, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useProgress, getOverallProgress } from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import JourneyStrip from "@/components/journey/JourneyStrip";
import HeroCTA from "@/components/journey/HeroCTA";
import ReadinessCard from "@/components/readiness/ReadinessCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import DueToday from "@/components/dashboard/DueToday";
import StreakBanner from "@/components/gamification/StreakBanner";
import BadgesGrid from "@/components/gamification/BadgesGrid";
import QuickSession from "@/components/practice/QuickSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const { gamification, badges } = useGamification();
  const { progress } = useProgress();
  const overall = getOverallProgress(progress);

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

      {/* Top bar: Welcome + language */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Welcome back 👋</h1>
          <p className="text-xs text-muted-foreground">
            {overall.percentage}% towards your CSCS Green Card
          </p>
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

      {/* Journey Strip Stepper */}
      <motion.div variants={fadeUp}>
        <JourneyStrip />
      </motion.div>

      {/* Hero CTA */}
      <motion.div variants={fadeUp}>
        <HeroCTA />
      </motion.div>

      {/* Due Today */}
      <motion.div variants={fadeUp}>
        <DueToday />
      </motion.div>

      {/* Quick Session */}
      {!quickMode && (
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setQuickMode("drill")}
            variant="outline"
            className="h-14 flex flex-col items-center gap-0.5 border-border"
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold">Quick Drill</span>
          </Button>
          <Button
            onClick={() => setQuickMode("blitz")}
            variant="outline"
            className="h-14 flex flex-col items-center gap-0.5 border-border"
          >
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold">2-Min Blitz</span>
          </Button>
        </motion.div>
      )}

      {/* Secondary cards: Readiness + Performance */}
      <motion.div variants={fadeUp}>
        <Accordion type="single" collapsible defaultValue="readiness" className="space-y-3">
          <AccordionItem value="readiness" className="border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
              Readiness & Pass Probability
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <ReadinessCard />
              <PerformanceCard />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Streak + Badges */}
      <motion.div variants={fadeUp}>
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="rewards" className="border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
              Streak & Rewards
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <StreakBanner streak={gamification.streak} />
              <BadgesGrid badges={badges} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
