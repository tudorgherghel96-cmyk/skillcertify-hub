import { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Award, CreditCard, Globe, Check, ChevronDown, ChevronUp, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage, LANGUAGES, type Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { landingText } from "@/i18n/landingTranslations";
import skillcertifyFullLogo from "@/assets/skillcertify-full-logo.png";
import skillcertifyIcon from "@/assets/skillcertify-icon.png";
import heroImage from "@/assets/hero-cscs-card.jpg";
import gqaLogo from "@/assets/gqa-logo.png";
import myCscsLogo from "@/assets/my-cscs-logo.png";
import cscsFullLogo from "@/assets/cscs-full-logo.png";
import officePhoto from "@/assets/office-zeus-house.jpg";
import greenCard from "@/assets/cscs-green-card.webp";
import blueCard from "@/assets/cscs-blue-card.webp";
import goldCard from "@/assets/cscs-gold-card.webp";
import blackCard from "@/assets/cscs-black-card.webp";

/* ─── animation helpers ─── */
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ─── component ─── */
const Landing = () => {
  const { language, setLanguage } = useLanguage();
  const { user, loading } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const t = (key: Parameters<typeof landingText>[0]) => landingText(key, language.code);

  // Redirect authenticated users
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const steps = [
    { icon: BookOpen, title: t("step_learn"), desc: t("step_learn_desc") },
    { icon: Target, title: t("step_practice"), desc: t("step_practice_desc") },
    { icon: Award, title: t("step_pass"), desc: t("step_pass_desc") },
    { icon: CreditCard, title: t("step_card"), desc: t("step_card_desc") },
  ];

  const careerCards = [
    { img: greenCard, name: "Green", role: t("labourer"), qual: "Level 1 H&S", salary: "£21,500/yr", active: true },
    { img: blueCard, name: "Blue", role: t("skilled_worker"), qual: "NVQ Level 2", salary: "£35,000/yr", active: false },
    { img: goldCard, name: "Gold", role: t("supervisor"), qual: "NVQ Level 3", salary: "£42,000/yr", active: false },
    { img: blackCard, name: "Black", role: t("manager"), qual: "NVQ Level 6", salary: "£55,000/yr", active: false },
  ];

  const faqs = [
    {
      q: "Do I need a CSCS test?",
      a: "Yes. Most UK construction sites require workers to hold a valid CSCS card. To get the Green Labourer card, you need to pass the Level 1 Health & Safety in a Construction Environment qualification and the CSCS Health, Safety & Environment test.",
    },
    {
      q: "How long does it take?",
      a: "Most learners complete the course in 1–2 weeks studying on their phone. You can go at your own pace — there's no deadline.",
    },
    {
      q: "What if I fail?",
      a: "You can retake any assessment. Your progress is saved and you only need to redo the parts you didn't pass.",
    },
    {
      q: "Do I need to visit a centre?",
      a: "No. Everything is done online from your phone. The course, the practice tests, and the GQA assessment are all completed remotely.",
    },
    {
      q: "Is this an official qualification?",
      a: "Yes. SkillCertify is a GQA-approved assessment centre. The Level 1 Award in Health and Safety in a Construction Environment is a nationally recognised qualification regulated by Ofqual.",
    },
    {
      q: "What languages is it available in?",
      a: "The course is available in 11 languages: English, Romanian, Polish, Lithuanian, Bulgarian, Arabic, Tigrinya, Yoruba, Igbo, Somali, and Amharic. Audio is in English with subtitles and key terms in your chosen language.",
    },
    {
      q: "How much does it cost?",
      a: "We'll publish pricing soon. The course includes the GQA assessment and certificate. The CSCS test (£21) and card application (£36) are paid separately.",
    },
  ];

  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setSheetOpen(false);
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" ref={topRef}>
      {/* ═══ STICKY TOP NAV ═══ */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={skillcertifyIcon} alt="SkillCertify" className="h-7 w-7" />
            <span className="text-lg font-bold text-primary tracking-tight font-[Poppins]">SkillCertify</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1 p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Select language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">{language.code}</span>
            </button>
            <Link
              to="/auth"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative px-4 pt-10 pb-8 sm:pt-16 sm:pb-12 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <motion.img
            src={skillcertifyFullLogo}
            alt="SkillCertify"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-[60px] w-auto mx-auto mb-6"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-secondary-foreground font-[Poppins]"
          >
            {t("hero_title_1")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-secondary-foreground/70 max-w-md mx-auto"
          >
            {t("hero_title_2")}
            <br />
            <span className="font-semibold text-secondary-foreground/80 inline-block mt-2">Learn in your language.</span>
          </motion.p>

          {/* CTA with pulse glow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 flex flex-col items-center"
          >
            <Button
              asChild
              size="lg"
              className="relative text-base px-8 h-12 font-semibold w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.97] transition-transform overflow-hidden"
            >
              <Link to="/select-language">
                <span className="absolute inset-0 rounded-md animate-[pulse_2s_ease-in-out_infinite] bg-primary/20" />
                <span className="relative">{t("cta_start")}</span>
              </Link>
            </Button>
            <p className="mt-2 text-[10px] sm:text-xs text-secondary-foreground/45">
              Free to start · No card required
            </p>
          </motion.div>

          {/* Trust strip — unified band */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-xl bg-secondary-foreground/5 border border-secondary-foreground/10 py-3 px-4"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <img alt="GQA" className="h-5 w-auto" src={gqaLogo} />
                <span className="text-[10px] sm:text-xs font-medium text-secondary-foreground/60">GQA Approved</span>
              </div>
              <span className="text-secondary-foreground/20">|</span>
              <div className="flex items-center gap-1.5">
                <img src={myCscsLogo} alt="myCSCS" className="h-5 w-auto rounded" />
                <span className="text-[10px] sm:text-xs font-medium text-secondary-foreground/60">CSCS Smart Check</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 flex-wrap">
              {[t("social_pass_rate"), t("social_languages"), t("social_cert")].map((item, i) => (
                <span key={i} className="text-[10px] sm:text-xs text-secondary-foreground/50 flex items-center gap-1">
                  <Check className="h-3 w-3 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 max-w-sm mx-auto"
          >
            <img
              src={heroImage}
              alt="CSCS Green Card and SkillCertify app on a construction site"
              className="w-full rounded-2xl shadow-lg"
              loading="eager"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-secondary-foreground/45"
          >
            {t("no_laptop")}
          </motion.p>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="px-4 py-12 sm:py-16 bg-muted/50"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2
            variants={sectionVariants}
            className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8 font-[Poppins]"
          >
            {t("how_it_works")}
          </motion.h2>

          {/* Desktop: 4 cols. Mobile: vertical with connecting line */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-4">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-card border border-border"
              >
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                {/* Connector arrow */}
                {i < 3 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-border hidden sm:block">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical stack with connecting line */}
          <div className="sm:hidden relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[22px] top-8 bottom-8 w-0.5 bg-border" />
            <div className="flex flex-col gap-4">
              {steps.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="relative flex items-start gap-4 pl-2"
                >
                  <div className="relative z-10 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ CAREER PROGRESSION ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="px-4 py-12 sm:py-16"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2
            variants={sectionVariants}
            className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2 font-[Poppins]"
          >
            {t("career_title")}
          </motion.h2>
          <motion.p variants={sectionVariants} className="text-sm text-muted-foreground text-center mb-8">
            {t("career_subtitle")}
          </motion.p>

          {/* Desktop grid, mobile horizontal scroll */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-3">
            {careerCards.map((card, i) => (
              <motion.div
                key={card.name}
                variants={itemVariants}
                className="relative"
              >
                {/* Connector between cards */}
                {i > 0 && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-border hidden sm:block">
                    <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                  </div>
                )}
                <div
                  className={`rounded-2xl overflow-hidden border bg-card transition-all ${
                    card.active
                      ? "border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20"
                      : "border-border opacity-60"
                  }`}
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
                    {!card.active && (
                      <p className="text-[9px] text-muted-foreground italic mt-1">Next step →</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: horizontal scroll strip */}
          <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {careerCards.map((card) => (
              <div
                key={card.name}
                className={`shrink-0 w-[200px] rounded-2xl overflow-hidden border bg-card ${
                  card.active
                    ? "border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border opacity-60"
                }`}
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
                  {!card.active && (
                    <p className="text-[9px] text-muted-foreground italic mt-1">Next step →</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <motion.div variants={sectionVariants} className="mt-6 text-center">
            <Button asChild variant="outline" size="sm" className="text-sm font-semibold">
              <Link to="/select-language">
                Start with your Green Card today <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ CREDIBILITY — Office Photo ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="px-4 py-12 sm:py-16 bg-muted/50"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-foreground text-center mb-4 font-[Poppins]">
            We're here to help.
          </h3>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <img
              src={officePhoto}
              alt="SkillCertify office at Zeus House, London"
              className="w-full aspect-[2/1] object-cover"
              loading="lazy"
            />
            <div className="bg-card p-4 text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">Zeus House, London, N1 7NG</p>
              <p className="text-xs text-muted-foreground">Our London headquarters — here to support you every step of the way</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ FAQ ═══ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
        className="px-4 py-12 sm:py-16"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 font-[Poppins]">
            {t("faq_title")}
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
      </motion.section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-secondary px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-center gap-4">
            <img alt="SkillCertify" className="h-8 w-auto" src={skillcertifyFullLogo} />
            <img src={gqaLogo} alt="GQA Approved Centre" className="h-8 w-auto" />
            <img src={cscsFullLogo} alt="CSCS" className="h-8 w-auto" />
          </div>

          <div className="text-center">
            <p className="text-xs text-secondary-foreground/50">Zeus House, London, N1 7NG</p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="mailto:support@skillcertify.co.uk"
              className="flex items-center gap-1.5 text-xs text-secondary-foreground/60 hover:text-secondary-foreground/80 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              Email support
            </a>
            <a
              href="https://wa.me/44XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-secondary-foreground/60 hover:text-secondary-foreground/80 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp support
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-secondary-foreground/50">
            <Link to="/privacy" className="hover:text-secondary-foreground/70 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-secondary-foreground/70 transition-colors">Terms & Conditions</Link>
          </div>

          {/* Back to top */}
          <div className="text-center">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-xs text-secondary-foreground/40 hover:text-secondary-foreground/60 transition-colors"
            >
              <ChevronUp className="h-3 w-3" />
              Back to top
            </button>
          </div>

          <p className="text-[10px] text-secondary-foreground/40 text-center">
            © {new Date().getFullYear()} SkillCertify Ltd. All rights reserved. Registered in England & Wales.
          </p>
        </div>
      </footer>

      {/* ═══ LANGUAGE BOTTOM SHEET ═══ */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg font-bold text-foreground">Choose Your Language</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2 pb-6">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang)}
                  className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-colors ${
                    isActive ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{lang.native}</p>
                    {lang.code !== "en" && (
                      <p className="text-xs text-muted-foreground truncate">{lang.english}</p>
                    )}
                  </div>
                  {isActive && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Landing;
