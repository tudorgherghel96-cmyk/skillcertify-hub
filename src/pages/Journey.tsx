import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Phone, HelpCircle, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProgress, getOverallProgress, allGqaPassed } from "@/contexts/ProgressContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import JourneyTimeline from "@/components/journey/JourneyTimeline";
import CardWallet from "@/components/journey/CardWallet";
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

export default function Journey() {
  const { progress } = useProgress();
  const { isSuperUser } = useSuperUser();
  const overall = getOverallProgress(progress);
  const allGqa = allGqaPassed(progress, isSuperUser);
  const cscsPassed = progress.cscs.passed === true;

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-6 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-lg font-bold text-foreground">Your CSCS Card Journey</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {overall.percentage}% complete — follow each step to get your Green Card
        </p>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={fadeUp}>
        <JourneyTimeline />
      </motion.div>

      {/* Card Wallet */}
      <motion.div variants={fadeUp}>
        <CardWallet currentTarget="green" />
      </motion.div>

      {/* Proof & Eligibility */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Proof & Eligibility</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                <span className="text-foreground">Level 1 Qualification</span>
                <span className={`text-xs font-medium ${allGqa ? "text-primary" : "text-muted-foreground"}`}>
                  {allGqa ? "✅ Issued" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
                <span className="text-foreground">CSCS H&S Test</span>
                <span className={`text-xs font-medium ${cscsPassed ? "text-primary" : "text-muted-foreground"}`}>
                  {cscsPassed ? `✅ Passed ${progress.cscs.score}%` : "Not taken"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-foreground">Card Request</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {cscsPassed ? "Ready to submit" : "Pending"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <AccordionItem value="q1" className="border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              What if I fail a GQA module?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3 text-xs text-muted-foreground">
              You only resit the failed module. All other passes remain valid. There's a 24-hour cooldown before your resit.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2" className="border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              How long does the Green Card take?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3 text-xs text-muted-foreground">
              After passing the CSCS H&S test, Q-Card processing is same-day via CSCS Partner Alliance. The physical card arrives by post within 5-10 working days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3" className="border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              Are the tests open or closed book?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3 text-xs text-muted-foreground">
              Both the GQA Module Tests and the CSCS Health & Safety Test are closed-book. No notes allowed. This course is designed to help you memorise everything.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Contact */}
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
