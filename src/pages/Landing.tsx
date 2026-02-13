import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Target, Award, CreditCard, ChevronDown, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import skillcertifyLogo from "@/assets/skillcertify-logo.png";
import greenCard from "@/assets/cscs-green-card.webp";
import blueCard from "@/assets/cscs-blue-card.webp";
import goldCard from "@/assets/cscs-gold-card.webp";
import blackCard from "@/assets/cscs-black-card.webp";

/* ─── data ─── */

const socialProofItems = [
  "98% pass rate",
  "Available in 11 languages",
  "Complete in as little as 6 hours",
  "Certificate in 24 hours",
];

const steps = [
  { icon: BookOpen, title: "Learn", desc: "Bite-sized lessons with videos in your language" },
  { icon: Target, title: "Practice", desc: "Unlimited practice tests until you're confident" },
  { icon: Award, title: "Pass", desc: "Take the official GQA assessment from your phone" },
  { icon: CreditCard, title: "Get Your Card", desc: "Receive your CSCS Green Labourer card" },
];

const careerCards = [
  { img: greenCard, name: "Green", role: "Labourer", qual: "Level 1 H&S", salary: "£21,500/yr" },
  { img: blueCard, name: "Blue", role: "Skilled Worker", qual: "NVQ Level 2", salary: "£35,000/yr" },
  { img: goldCard, name: "Gold", role: "Supervisor", qual: "NVQ Level 3", salary: "£42,000/yr" },
  { img: blackCard, name: "Black", role: "Manager", qual: "NVQ Level 6", salary: "£55,000/yr" },
];

const faqs = [
  { q: "Do I need a CSCS test?", a: "Yes, you need the CSCS test to get the CSCS card. Luckily, we can do it here." },
  { q: "How long does it take?", a: "It can take as little as 6 hours to complete. The certificate can be available digitally as fast as one day, and the CSCS Smart Checker app can digitally have your card as fast as the next day. The physical card can take up to 5 working days to reach home." },
  { q: "What if I fail?", a: "If you fail an assessment topic, you can retake as many times as you need. If you fail the CSCS test, you can also retake as many times as you need." },
  { q: "Do I need to visit a centre?", a: "You don't need to. It's all done here with us, in one place. No centre visit needed." },
  { q: "Is this an official qualification?", a: "Yes. SkillCertify delivers the GQA Level 1 Award in Construction Health and Safety (601/2322/9), regulated by Ofqual." },
  { q: "What languages is it available in?", a: "English, Romanian, Bulgarian, Lithuanian, Polish, Portuguese, Hungarian, Ukrainian, Arabic, Amharic, and Kurdish Sorani." },
  { q: "How much does it cost?", a: "Course: £XX + CSCS Test: £21 + Card Application: £36. See the pricing section above for the full breakdown." },
];

/* ─── component ─── */

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ═══ HERO ═══ */}
      <section className="relative px-4 pt-10 pb-8 sm:pt-16 sm:pb-12 bg-secondary">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <motion.img
            src={skillcertifyLogo}
            alt="SkillCertify"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-14 sm:h-16 mx-auto mb-1 brightness-0 invert"
          />

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-secondary-foreground font-[Poppins]"
          >
            Get your CSCS Green Card.{" "}
            <span className="text-primary">Start to finish, from your phone.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-secondary-foreground/70 max-w-md mx-auto"
          >
            Used by 2,000+ construction workers across the UK
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-col items-center gap-3 pt-1"
          >
            <Button
              asChild
              size="lg"
              className="text-base px-8 h-12 font-semibold w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.97] transition-transform"
            >
              <Link to="/select-language">
                Start Learning Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-secondary-foreground/50 text-xs font-medium h-auto min-h-0 p-0"
            >
              <Link to="/auth">Already have an account? Sign in</Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            {["GQA Approved", "Ofqual Regulated", "CSCS Partner"].map((badge) => (
              <div
                key={badge}
                className="flex items-center justify-center h-10 px-3 rounded-lg border border-secondary-foreground/15 bg-secondary-foreground/5"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-secondary-foreground/60 tracking-wide uppercase">
                  {badge}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-xs text-secondary-foreground/50 pt-1"
          >
            No laptop needed. No centre visit. Everything on your phone.
          </motion.p>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <section className="bg-primary py-3 overflow-hidden">
        <div className="flex animate-[scroll_20s_linear_infinite] gap-10 px-4 whitespace-nowrap">
          {[...socialProofItems, ...socialProofItems].map((item, i) => (
            <span key={i} className="text-sm font-semibold text-primary-foreground/90 flex-shrink-0">
              ✓ {item}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8 font-[Poppins]">
            How It Works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-card border border-border"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary">Step {i + 1}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="px-4 py-12 sm:py-16 bg-muted/50">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 font-[Poppins]">
            Simple, Transparent Pricing
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4"
          >
            <div className="space-y-2">
              {[
                { label: "Course & Certificate", price: "£XX" },
                { label: "CSCS Test", price: "£21" },
                { label: "Card Application", price: "£36" },
              ].map(({ label, price }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-foreground text-lg">£XX</span>
            </div>

            {/* Klarna badge */}
            <div className="rounded-lg bg-muted p-2.5 text-center">
              <span className="text-xs font-semibold text-muted-foreground">
                Pay in 3 with Klarna — interest-free
              </span>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full text-base h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link to="/select-language">
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ CAREER PROGRESSION ═══ */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2 font-[Poppins]">
            Your Career Ladder
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Start with Green. We'll help you go further.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {careerCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl overflow-hidden border bg-card ${i === 0 ? "border-primary shadow-md shadow-primary/10" : "border-border"}`}
              >
                <img
                  src={card.img}
                  alt={`${card.name} CSCS Card`}
                  className="w-full aspect-[1.586/1] object-cover"
                  loading="lazy"
                />
                <div className="p-3 space-y-0.5">
                  <p className="text-xs font-bold text-foreground">{card.role}</p>
                  <p className="text-[10px] text-muted-foreground">{card.qual}</p>
                  <p className="text-xs font-semibold text-primary">{card.salary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-4 py-12 sm:py-16 bg-muted/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 font-[Poppins]">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-4">
                <AccordionTrigger className="text-sm font-semibold text-foreground text-left py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-secondary px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center">
            <img src={skillcertifyLogo} alt="SkillCertify" className="h-10 brightness-0 invert" />
          </div>

          <div className="text-center space-y-1.5">
            <p className="text-xs text-secondary-foreground/60">
              GQA Centre Number: XXXXXX &nbsp;|&nbsp; Ofqual Recognition: XXXXXX
            </p>
            <p className="text-xs text-secondary-foreground/60">
              Support: <a href="mailto:support@skillcertify.co.uk" className="underline">support@skillcertify.co.uk</a>
              &nbsp;|&nbsp;
              <a href="https://wa.me/44XXXXXXXXXX" className="underline" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-secondary-foreground/50">
            <a href="#" className="hover:text-secondary-foreground/70 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-secondary-foreground/70 transition-colors">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-secondary-foreground/70 transition-colors">Accessibility</a>
          </div>

          <p className="text-[10px] text-secondary-foreground/40 text-center">
            © {new Date().getFullYear()} SkillCertify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
