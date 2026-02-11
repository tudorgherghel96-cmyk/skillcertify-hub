import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle, BookOpen, ClipboardCheck, Award, Shield, CreditCard, Smartphone, ChevronRight, Mail, Phone, Zap, Star, Crown, Briefcase } from "lucide-react";
import { examMedia } from "@/data/mediaMap";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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

/* ─── flowchart steps ─── */

const STEPS = [
  { id: 1, title: "Complete Course Lessons", desc: "Study all 5 modules", icon: BookOpen },
  { id: 2, title: "Pass Practice Quizzes", desc: "Score 80%+ per module", icon: ClipboardCheck },
  { id: 3, title: "Pass 5 GQA Module Tests", desc: "Closed-book assessments", icon: Shield },
  { id: 4, title: "Level 1 Qualification", desc: "Issued automatically", icon: Award },
  { id: 5, title: "Pass CSCS H&S Test", desc: "Final closed-book test", icon: ClipboardCheck },
  { id: 6, title: "Q-Card via Partner Alliance", desc: "Same-day processing", icon: Zap },
  { id: 7, title: "CSCS Green Labourer Card", desc: "You're site-ready!", icon: CreditCard },
];

/* ─── career cards ─── */

const CAREER_CARDS = [
  {
    color: "bg-primary",
    textColor: "text-primary-foreground",
    borderColor: "border-primary",
    level: "Level 1 H&S",
    qualification: "Health & Safety in Construction",
    role: "Labourer",
    tag: "YOU ARE HERE",
    tagClass: "bg-primary-foreground text-primary",
    desc: "Entry-level site access. Work under supervision on any construction site in the UK.",
    icon: Shield,
  },
  {
    color: "bg-blue-600",
    textColor: "text-white",
    borderColor: "border-blue-600",
    level: "NVQ Level 2",
    qualification: "Skilled Trade Qualification",
    role: "Skilled Worker",
    tag: "Next Step — Coming Soon",
    tagClass: "bg-white/20 text-white",
    desc: "Specialise in a trade: bricklaying, plumbing, carpentry, electrical, and more.",
    icon: Star,
  },
  {
    color: "bg-amber-500",
    textColor: "text-white",
    borderColor: "border-amber-500",
    level: "NVQ Level 3",
    qualification: "Supervisory Qualification",
    role: "Supervisor",
    tag: "Progression",
    tagClass: "bg-white/20 text-white",
    desc: "Lead teams, manage safety, and oversee site operations.",
    icon: Crown,
  },
  {
    color: "bg-secondary",
    textColor: "text-secondary-foreground",
    borderColor: "border-secondary",
    level: "NVQ Level 6",
    qualification: "Management Qualification",
    role: "Site Manager",
    tag: "Leadership",
    tagClass: "bg-primary text-primary-foreground",
    desc: "Full site management responsibility. Run projects from start to finish.",
    icon: Briefcase,
  },
];

/* ─── helper: determine current step ─── */

function getCurrentStep(progress: ReturnType<typeof useProgress>["progress"]): number {
  const allLessonsDone = MODULES.every((m) => {
    const mp = getModuleProgress(progress, m.id);
    return areAllLessonsComplete(mp, m.lessons.length);
  });

  const allPractice = MODULES.every((m) => {
    const mp = getModuleProgress(progress, m.id);
    return mp.practice.bestScore >= 80;
  });

  const allGqa = allGqaPassed(progress); // superUser not needed here, just shows current step
  const cscsPassed = progress.cscs.passed === true;

  if (cscsPassed) return 7;
  if (allGqa) return 5;
  if (allPractice) return 3;
  if (allLessonsDone) return 2;
  return 1;
}

/* ─── component ─── */

const CscsRoute = () => {
  const { progress } = useProgress();
  const currentStep = getCurrentStep(progress);
  const { percentage } = getOverallProgress(progress);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Your Path to the CSCS Green Card</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Follow each step — you're {percentage}% of the way there
        </p>
      </div>

      {/* Pathway flowchart image */}
      <img
        src={examMedia.pathway}
        alt="CSCS qualification pathway flowchart"
        className="w-full rounded-xl shadow-sm"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* ─── Animated Flowchart ─── */}
      <section className="space-y-0">
        {STEPS.map((step, i) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <div className="flex gap-4">
                {/* Vertical line + node */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                      done
                        ? "bg-primary border-primary"
                        : active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted"
                    }`}
                    animate={active ? { scale: [1, 1.1, 1] } : {}}
                    transition={active ? { repeat: Infinity, duration: 2 } : {}}
                  >
                    {done ? (
                      <CheckCircle className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <motion.div
                      className={`w-0.5 flex-1 min-h-[24px] ${
                        done ? "bg-primary" : "bg-border"
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.08 + 0.15, duration: 0.25 }}
                      style={{ transformOrigin: "top" }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 pt-1.5">
                  <h3
                    className={`font-semibold text-sm ${
                      active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                    {active && (
                      <span className="ml-2 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* CSCS Card image */}
      <img
        src={examMedia.cscsCard}
        alt="CSCS Green Labourer Card"
        className="w-full rounded-xl shadow-sm"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* ─── Key Info Boxes ─── */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Key Information</h2>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              GQA Module Tests
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              5 separate tests, one per module. <strong>80% pass mark.</strong> Fail? Only resit
              that module. Both tests are{" "}
              <strong className="text-destructive">CLOSED BOOK — no notes.</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              CSCS Health & Safety Test
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Final test covering <strong>all 5 modules.</strong> Also closed-book. This is what
              gets you the card.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Q-Card Route
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              No test centre visit needed. <strong>Fully online.</strong> Same-day processing via
              CSCS Partner Alliance.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ─── USP Banner ─── */}
      <motion.div
        className="rounded-xl bg-secondary text-secondary-foreground p-5 text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Smartphone className="h-6 w-6 mx-auto opacity-80" />
        <p className="text-sm font-semibold leading-snug">
          Fully online. No test centres. No postal delays.
          <br />
          Same-day processing.
        </p>
        <p className="text-xs font-medium text-primary">
          UK's first mobile-native CSCS route.
        </p>
      </motion.div>

      {/* ─── Career Progression ─── */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Career Progression</h2>
        <img
          src={examMedia.careerProgression}
          alt="Construction career progression pathway"
          className="w-full rounded-xl shadow-sm"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="grid gap-3">
          {CAREER_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.level}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <Card
                  className={`border-2 ${card.borderColor} overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-0">
                    <div className={`${card.color} ${card.textColor} px-4 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="font-bold text-sm">{card.role}</p>
                          <p className="text-xs opacity-80">{card.level}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.tagClass}`}>
                        {card.tag}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium">{card.qualification}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <Card>
        <CardContent className="p-5 text-center space-y-3">
          <h3 className="font-semibold text-sm">Questions?</h3>
          <p className="text-xs text-muted-foreground">
            Our team is here to help you get your CSCS card.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@skillcertify.co.uk">
                <Mail className="h-4 w-4" />
                support@skillcertify.co.uk
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+44XXXXXXXXXX">
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CscsRoute;
