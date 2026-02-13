import { motion } from "framer-motion";
import { Check, Circle, CheckCircle, XCircle, Minus, CreditCard, HelpCircle, Mail, Clock, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useProgress,
  getModuleProgress,
  areAllLessonsComplete,
  allGqaPassed,
  getLessonsCompleted,
  canResitGqa,
  hoursUntilResit,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";
import CscsSmartCheck from "@/components/journey/CscsSmartCheck";
import CardWallet from "@/components/journey/CardWallet";
import { shareProgress } from "@/lib/sharing";
import { useGamification } from "@/contexts/GamificationContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

type StepStatus = "done" | "current" | "todo";

export default function MyCard() {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const { gamification } = useGamification();

  // Compute step statuses
  const topicsDone = MODULES.filter((m) =>
    areAllLessonsComplete(getModuleProgress(progress, m.id), m.lessons.length)
  ).length;
  const allLessonsDone = topicsDone === MODULES.length;
  const allPractice80 = MODULES.every(
    (m) => getModuleProgress(progress, m.id).practice.bestScore >= 80
  );
  const allGqa = allGqaPassed(progress, isSuperUser);
  const cscsPassed = progress.cscs.passed === true;

  const getStatus = (done: boolean, prevDone: boolean): StepStatus =>
    done ? "done" : prevDone ? "current" : "todo";

  const steps: Array<{ label: string; status: StepStatus; detail?: string }> = [
    {
      label: "Complete each course topic",
      status: getStatus(allLessonsDone, true),
      detail: `${topicsDone} of 5 topics done`,
    },
    {
      label: "Pass each assessment test",
      status: getStatus(allGqa, allLessonsDone),
      detail: `${MODULES.filter((m) => getModuleProgress(progress, m.id).gqa.passed === true).length} of 5 passed`,
    },
    {
      label: "Get Level 1 certificate",
      status: getStatus(allGqa, allGqa),
    },
    {
      label: "Pass the Health & Safety CSCS Test",
      status: getStatus(cscsPassed, allGqa),
    },
    {
      label: "Get the Green Card",
      status: getStatus(false, cscsPassed),
    },
  ];

  const cardRequestStatus = cscsPassed ? "active" as const : "not_started" as const;

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-5 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-lg font-bold text-foreground">My Card</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your next step to get on site
        </p>
      </motion.div>

      {/* CSCS Smart Check — front and centre */}
      <motion.div variants={fadeUp}>
        <CscsSmartCheck
          cardRequestStatus={cardRequestStatus}
          cscsRegNumber={cscsPassed ? "1234567890" : undefined}
          expiryDate={cscsPassed ? "31/12/2031" : undefined}
          cardType="Green Labourer"
        />
      </motion.div>

      {/* Your progress — simple 6-step list */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-1">
            <h3 className="text-sm font-bold text-foreground mb-3">Your progress</h3>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className="mt-0.5 shrink-0">
                  {step.status === "done" ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  ) : step.status === "current" ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/10" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${
                    step.status === "done" ? "text-foreground" :
                    step.status === "current" ? "text-foreground font-semibold" :
                    "text-muted-foreground"
                  }`}>
                    {step.label}
                  </p>
                  {step.detail && step.status !== "done" && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">{step.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Per-module assessment status */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-2">
            <h3 className="text-sm font-bold text-foreground mb-3">Assessment topics</h3>
            {MODULES.map((m) => {
              const mp = getModuleProgress(progress, m.id);
              const passed = mp.gqa.passed === true;
              const failed = mp.gqa.passed === false;
              const canRetry = canResitGqa(mp, isSuperUser);
              const retryHours = hoursUntilResit(mp);

              return (
                <div key={m.id} className="flex items-center gap-3 py-1.5">
                  <div className="shrink-0">
                    {passed ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : failed ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Minus className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">Topic {m.id}: {m.title}</p>
                    {failed && !canRetry && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> Retake in {retryHours}h
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {passed ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                        {mp.gqa.score}% ✓
                      </Badge>
                    ) : failed ? (
                      canRetry ? (
                        <Badge variant="destructive" className="text-[10px]">Retry now</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30">Failed</Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Not taken</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
      {/* Your card */}
      <motion.div variants={fadeUp}>
        <CardWallet currentTarget="green" />
      </motion.div>

      {/* Card status message + share */}
      <motion.div variants={fadeUp}>
        <div className="flex flex-col items-center gap-2 px-2">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {cscsPassed
              ? "Your Green Card is on its way."
              : "Complete your steps above to get your card."
            }
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => shareProgress(topicsDone, MODULES.length, gamification.streak)}
          >
            <Share2 className="h-4 w-4" /> Share my progress
          </Button>
        </div>
      </motion.div>

      {/* Common questions */}
      <motion.div variants={fadeUp}>
        <Accordion type="single" collapsible className="space-y-2">
          <h3 className="text-sm font-bold text-foreground mb-2">Common questions</h3>
          {[
            { q: "Do I need a CSCS test?", a: "Yes, you need the CSCS test to get the CSCS card. Luckily, we can do it here." },
            { q: "How long does it take?", a: "It can take as little as 6 hours to complete. The certificate can be available digitally as fast as one day, and the CSCS Smart Checker app can digitally have your card as fast as the next day. The physical card can take up to 5 working days to reach home." },
            { q: "What if I fail?", a: "If you fail an assessment topic, you can retake as many times as you need. If you fail the CSCS test, you can also retake as many times as you need." },
            { q: "Do I need to visit a centre?", a: "You don't need to. It's all done here with us, in one place. No centre visit needed." },
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
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@skillcertify.co.uk">
                <Mail className="h-4 w-4 mr-1" /> Email us
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}