import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  ClipboardCheck,
  Award,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Mail,
  Phone,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useProgress,
  getModuleProgress,
  areAllLessonsComplete,
  allGqaPassed,
  getLessonsCompleted,
  getOverallProgress,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";
import CardWallet from "@/components/journey/CardWallet";
import TimelineMilestoneCard, {
  type MilestoneStatus,
} from "@/components/journey/TimelineMilestoneCard";
import StickyNextAction from "@/components/journey/StickyNextAction";
import EvidenceSection, {
  type EvidenceItem,
} from "@/components/journey/EvidenceSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import CertificatePackCard from "@/components/journey/CertificatePackCard";
import BookingTracker from "@/components/journey/BookingTracker";
import GreenCardStatus from "@/components/journey/GreenCardStatus";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

type SubView = "main" | "certificate" | "booking" | "greencard";

export default function Journey() {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const [subView, setSubView] = useState<SubView>("main");

  // Compute milestone statuses
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = MODULES.reduce(
    (acc, m) => acc + getLessonsCompleted(getModuleProgress(progress, m.id), m.lessons.length),
    0
  );
  const allLessonsDone = MODULES.every((m) =>
    areAllLessonsComplete(getModuleProgress(progress, m.id), m.lessons.length)
  );

  const allPractice80 = MODULES.every(
    (m) => getModuleProgress(progress, m.id).practice.bestScore >= 80
  );
  const practiceModulesDone = MODULES.filter(
    (m) => getModuleProgress(progress, m.id).practice.bestScore >= 80
  ).length;

  const gqaModulesPassed = MODULES.filter(
    (m) => getModuleProgress(progress, m.id).gqa.passed === true
  ).length;
  const allGqa = allGqaPassed(progress, isSuperUser);

  const cscsPassed = progress.cscs.passed === true;

  const st = (done: boolean, prevDone: boolean): MilestoneStatus =>
    done ? "complete" : prevDone ? "in_progress" : "locked";

  const milestones: Array<{
    title: string;
    icon: typeof BookOpen;
    status: MilestoneStatus;
    progressText?: string;
    progressPercent?: number;
    timeEstimate?: string;
    ctaLabel?: string;
    ctaTo?: string;
    onCtaClick?: () => void;
    details: { whatYouDo: string; whatYouNeed: string; whyMatters: string; whatsNext: string };
  }> = [
    {
      title: "Complete All Lessons",
      icon: BookOpen,
      status: st(allLessonsDone, true),
      progressText: `${completedLessons}/${totalLessons} lessons`,
      progressPercent: Math.round((completedLessons / totalLessons) * 100),
      timeEstimate: "~8 hours",
      ctaLabel: allLessonsDone ? undefined : "Continue Lessons",
      ctaTo: allLessonsDone ? undefined : "/learn",
      details: {
        whatYouDo: "Study 5 modules covering health & safety, manual handling, working at height, health risks, and plant safety.",
        whatYouNeed: "A device with internet access. Each lesson takes 15-30 minutes.",
        whyMatters: "This is the knowledge base for your qualification and CSCS test.",
        whatsNext: "Once all lessons are complete, you unlock practice quizzes.",
      },
    },
    {
      title: "Pass Practice Quizzes",
      icon: Target,
      status: st(allPractice80, allLessonsDone),
      progressText: `${practiceModulesDone}/5 modules at 80%+`,
      progressPercent: Math.round((practiceModulesDone / 5) * 100),
      timeEstimate: "~2 hours",
      ctaLabel: allPractice80 ? undefined : "Start Practice",
      ctaTo: allPractice80 ? undefined : "/practice-hub",
      details: {
        whatYouDo: "Score 80% or higher on each module's practice quiz. Unlimited retakes.",
        whatYouNeed: "Complete all lessons in the relevant module first.",
        whyMatters: "Practice quizzes ensure you're ready for the formal GQA assessments.",
        whatsNext: "Passing all practice quizzes unlocks GQA Module Tests.",
      },
    },
    {
      title: "Pass 5 GQA Module Tests",
      icon: ClipboardCheck,
      status: st(allGqa, allPractice80),
      progressText: `${gqaModulesPassed}/5 passed`,
      progressPercent: Math.round((gqaModulesPassed / 5) * 100),
      timeEstimate: "~5 hours",
      ctaLabel: allGqa ? undefined : "Take GQA Tests",
      ctaTo: allGqa ? undefined : "/learn",
      details: {
        whatYouDo: "Closed-book assessments. 80% pass mark required for each module.",
        whatYouNeed: "80%+ on the corresponding practice quiz. 24-hour cooldown on resits.",
        whyMatters: "These are the formal assessments that count toward your qualification.",
        whatsNext: "Pass all 5 and your Level 1 Qualification is automatically issued.",
      },
    },
    {
      title: "Level 1 Qualification Issued",
      icon: Award,
      status: allGqa ? "issued" : allPractice80 ? "awaiting_verification" : "locked",
      progressText: allGqa ? "Qualification verified" : undefined,
      timeEstimate: "1-3 days",
      ctaLabel: allGqa ? "View Certificate" : undefined,
      onCtaClick: allGqa ? () => setSubView("certificate") : undefined,
      details: {
        whatYouDo: "Your results are submitted to the awarding body for verification.",
        whatYouNeed: "All 5 GQA modules must be passed.",
        whyMatters: "This qualification is a legal requirement for applying for a CSCS card.",
        whatsNext: "Once verified, you can book and sit the CSCS Health & Safety Test.",
      },
    },
    {
      title: "CSCS Health & Safety Test",
      icon: ShieldCheck,
      status: st(cscsPassed, allGqa),
      timeEstimate: "~90 mins",
      ctaLabel: cscsPassed ? undefined : allGqa ? "Prepare & Book" : undefined,
      onCtaClick: !cscsPassed && allGqa ? () => setSubView("booking") : undefined,
      details: {
        whatYouDo: "Final closed-book test covering all 5 modules. This earns your card.",
        whatYouNeed: "Level 1 Qualification issued. Book via CITB.",
        whyMatters: "Passing this test is the final requirement for your CSCS Green Card.",
        whatsNext: "Pass and you can request your Green Card immediately.",
      },
    },
    {
      title: "Green Card Issued",
      icon: CreditCard,
      status: cscsPassed ? "complete" : "locked",
      timeEstimate: "Same day processing",
      ctaLabel: cscsPassed ? "Track Card" : undefined,
      onCtaClick: cscsPassed ? () => setSubView("greencard") : undefined,
      details: {
        whatYouDo: "Same-day processing via CSCS Partner Alliance. No test centre visit needed.",
        whatYouNeed: "Passed CSCS H&S Test + Level 1 Qualification.",
        whyMatters: "Your Green Card proves you can work legally on UK construction sites.",
        whatsNext: "Physical card arrives by post in 5-10 working days.",
      },
    },
  ];

  // Find current milestone for sticky bar
  const currentIdx = milestones.findIndex(
    (m) => m.status === "in_progress" || m.status === "next" || m.status === "awaiting_verification"
  );
  const currentMilestone = currentIdx >= 0 ? milestones[currentIdx] : milestones[0];
  const nextMilestone = currentIdx >= 0 && currentIdx < milestones.length - 1 ? milestones[currentIdx + 1] : null;

  // Evidence items
  const evidenceItems: EvidenceItem[] = [
    {
      id: "id_verified",
      label: "ID Verification",
      status: "not_started",
    },
    {
      id: "qual_submitted",
      label: "Qualification Assessment",
      status: allGqa ? "complete" : gqaModulesPassed > 0 ? "pending" : "not_started",
      timestamp: allGqa ? "Submitted" : undefined,
    },
    {
      id: "assessor_verification",
      label: "Assessor Verification",
      status: allGqa ? "complete" : "not_started",
    },
    {
      id: "qual_issued",
      label: "Qualification Issued",
      status: allGqa ? "complete" : "not_started",
      reference: allGqa ? "GQA-L1-REF" : undefined,
    },
  ];

  // Sub-views
  if (subView === "certificate") {
    return (
      <div className="px-4 py-5 max-w-2xl mx-auto pb-24">
        <CertificatePackCard
          state={allGqa ? "downloadable" : "awaiting"}
          onBack={() => setSubView("main")}
        />
      </div>
    );
  }
  if (subView === "booking") {
    return (
      <div className="px-4 py-5 max-w-2xl mx-auto pb-24">
        <BookingTracker
          readinessPercent={getOverallProgress(progress).percentage}
          onBack={() => setSubView("main")}
        />
      </div>
    );
  }
  if (subView === "greencard") {
    return (
      <div className="px-4 py-5 max-w-2xl mx-auto pb-24">
        <GreenCardStatus
          status={cscsPassed ? "ready" : "not_started"}
          onBack={() => setSubView("main")}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-5 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-lg font-bold text-foreground">Your CSCS Journey</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          One platform → course → qualification → test → card
        </p>
      </motion.div>

      {/* Sticky next action */}
      <StickyNextAction
        currentMilestone={currentMilestone.title}
        nextMilestone={nextMilestone?.title || "Complete!"}
        ctaLabel={currentMilestone.ctaLabel || "Continue"}
        ctaTo={currentMilestone.ctaTo || "/learn"}
      />

      {/* Card Wallet */}
      <motion.div variants={fadeUp}>
        <CardWallet currentTarget="green" />
      </motion.div>

      {/* Timeline */}
      <motion.div variants={fadeUp} className="space-y-0">
        <h3 className="text-sm font-bold text-foreground mb-3">Journey Timeline</h3>
        {milestones.map((m, i) => (
          <TimelineMilestoneCard
            key={i}
            index={i}
            title={m.title}
            icon={m.icon}
            status={m.status}
            progressText={m.progressText}
            progressPercent={m.progressPercent}
            timeEstimate={m.timeEstimate}
            ctaLabel={m.ctaLabel}
            ctaTo={m.ctaTo}
            onCtaClick={m.onCtaClick}
            details={m.details}
            isLast={i === milestones.length - 1}
          />
        ))}
      </motion.div>

      {/* Evidence */}
      <motion.div variants={fadeUp}>
        <EvidenceSection items={evidenceItems} />
      </motion.div>

      {/* USP Banner */}
      <motion.div variants={fadeUp}>
        <div className="rounded-xl bg-secondary text-secondary-foreground p-5 text-center space-y-2">
          <Smartphone className="h-5 w-5 mx-auto opacity-80" />
          <p className="text-sm font-semibold leading-snug">
            Fully online. No test centres. Same-day processing.
          </p>
          <p className="text-xs font-medium text-primary">
            UK's first mobile-native CSCS route.
          </p>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div variants={fadeUp}>
        <Accordion type="single" collapsible className="space-y-2">
          <h3 className="text-sm font-bold text-foreground mb-2">FAQs</h3>
          {[
            { q: "Do I need a CSCS test?", a: "Yes. The CSCS Health & Safety Test is required to get your Green Card. We prepare you fully before you book." },
            { q: "How long does the whole journey take?", a: "Most learners complete everything in 2-4 weeks studying part-time. The course, quizzes, and tests are all online." },
            { q: "What if I fail a module test?", a: "You only resit the failed module. All other passes remain valid. There's a 24-hour cooldown before your resit." },
            { q: "How do I renew my card?", a: "CSCS Green Cards are valid for 5 years. Renewal requires retaking the Health & Safety Test." },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl overflow-hidden">
              <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-xs text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Support */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="p-4 text-center space-y-3">
            <HelpCircle className="h-5 w-5 mx-auto text-muted-foreground" />
            <h3 className="font-semibold text-sm">Need help?</h3>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:support@skillcertify.co.uk">
                  <Mail className="h-4 w-4 mr-1" /> Email Support
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+44XXXXXXXXXX">
                  <Phone className="h-4 w-4 mr-1" /> Call Us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
