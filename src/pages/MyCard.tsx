import { motion } from "framer-motion";
import { Check, Circle, CreditCard, ExternalLink, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useProgress,
  getModuleProgress,
  areAllLessonsComplete,
  allGqaPassed,
  getLessonsCompleted,
} from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { MODULES } from "@/data/courseData";
import CscsSmartCheck from "@/components/journey/CscsSmartCheck";
import CardWallet from "@/components/journey/CardWallet";
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
      label: "Choose your language",
      status: "done",
    },
    {
      label: "Finish your lessons",
      status: getStatus(allLessonsDone, true),
      detail: `${topicsDone} of 5 topics done`,
    },
    {
      label: "Pass practice questions",
      status: getStatus(allPractice80, allLessonsDone),
    },
    {
      label: "Book your CSCS test",
      status: getStatus(allGqa, allPractice80),
    },
    {
      label: "Pass your CSCS test",
      status: getStatus(cscsPassed, allGqa),
    },
    {
      label: "Get your card",
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
                  {/* Book your test link */}
                  {i === 3 && step.status === "current" && (
                    <a
                      href="https://www.citb.co.uk/courses-and-qualifications/health-safety-and-environment-test/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                    >
                      Book at citb.co.uk <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Your card */}
      <motion.div variants={fadeUp}>
        <CardWallet currentTarget="green" />
        <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed px-2">
          {cscsPassed
            ? "Your Green Card is on its way."
            : "Complete your steps above to get your card."
          }
        </p>
      </motion.div>

      {/* Common questions */}
      <motion.div variants={fadeUp}>
        <Accordion type="single" collapsible className="space-y-2">
          <h3 className="text-sm font-bold text-foreground mb-2">Common questions</h3>
          {[
            { q: "Do I need a CSCS test?", a: "Yes — it's a short health & safety test. We'll prepare you fully before you book." },
            { q: "How long does it all take?", a: "Most people finish in 2–4 weeks studying part-time. Everything's online." },
            { q: "What if I fail?", a: "Don't worry — if you fail, you only redo the bit you failed. All other passes stay. There's a 24-hour wait before you can retry." },
            { q: "How do I book my CSCS test?", a: "Through the CITB website. We'll give you the link when you're ready." },
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