import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Route,
  Target,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  HardHat,
} from "lucide-react";
import CardWallet from "@/components/journey/CardWallet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const benefits = [
  {
    icon: Route,
    title: "Fast, clear pathway",
    desc: "6 milestones from start to card — estimated 20–40 hours, done on your phone.",
  },
  {
    icon: Target,
    title: "Pass-first-time prep",
    desc: "Mock tests, targeted drills, and a readiness score so you know when you're ready.",
  },
  {
    icon: FileCheck,
    title: "All-in-one proof",
    desc: "Documents, verification status, and audit trail — ready for site or employer.",
  },
  {
    icon: TrendingUp,
    title: "Level up for better pay",
    desc: "Green → Blue → Gold → Black. Same app, online-first, fast-tracked.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-secondary text-secondary-foreground px-4 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-semibold badge-sm"
          >
            <HardHat className="h-3.5 w-3.5" />
            UK Construction Workers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight"
          >
            Get on site faster —{" "}
            <span className="text-primary">CSCS Green Card</span>, step by step.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-sm sm:text-base text-secondary-foreground/75 max-w-lg mx-auto leading-relaxed"
          >
            Learn in short bursts, practise real questions, track readiness, and
            follow a clear pathway — no classroom. Verified progress and
            documents in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-2 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="text-base px-8 h-12 font-semibold w-full max-w-xs active:scale-[0.97] transition-transform"
            >
              <Link to="/select-language">
                Start Green Card Pathway
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-secondary-foreground/60 text-xs font-medium h-auto min-h-0 p-0"
            >
              <Link to="/journey">
                See the full card steps
                <ChevronDown className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Card Wallet — above the fold */}
      <section className="px-4 -mt-1 pt-6 pb-2 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <CardWallet currentTarget="green" />
          <p className="text-xs text-muted-foreground text-center mt-3 px-4 leading-relaxed">
            Start with Green. Then keep going in the same app — fast-tracked,
            online-first learning + evidence capture + remote verification.
          </p>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-10 sm:py-14 max-w-2xl mx-auto w-full">
        <h2 className="text-lg font-bold text-center text-foreground mb-6">
          Everything you need to get your card
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="flex gap-3 p-4 rounded-xl border bg-card"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety — collapsed, positive framing */}
      <section className="px-4 pb-10 max-w-2xl mx-auto w-full">
        <Accordion type="single" collapsible>
          <AccordionItem
            value="safety"
            className="border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Why safety training matters
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                <p className="text-sm text-foreground font-semibold">
                  Get trained. Stay safe. Get home.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Construction is one of the highest-risk industries in the UK.
                  Proper training prevents accidents, protects you and your
                  colleagues, and is legally required to work on most sites.
                  Your CSCS card proves you have the knowledge to work safely.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Tagline */}
      <section className="px-4 py-6 text-center border-t mt-auto">
        <p className="text-xs text-muted-foreground tracking-wide">
          Done on your phone. No classroom. Get your card.
        </p>
      </section>
    </div>
  );
};

export default Landing;
