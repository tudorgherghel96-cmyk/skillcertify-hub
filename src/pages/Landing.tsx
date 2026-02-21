import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Award, CreditCard, Globe, Check, ChevronDown, Mail, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage, LANGUAGES, type Language } from "@/contexts/LanguageContext";
import { landingText } from "@/i18n/landingTranslations";
import skillcertifyLogo from "@/assets/skillcertify-logo.png";
import skillcertifyIcon from "@/assets/skillcertify-icon.png";
import skillcertifyFullLogo from "@/assets/skillcertify-full-logo.png";
import heroImage from "@/assets/hero-cscs-card.jpg";
import cscsLogo from "@/assets/cscs-logo.png";
import gqaLogo from "@/assets/gqa-logo.png";
import myCscsLogo from "@/assets/my-cscs-logo.png";
import cscsFullLogo from "@/assets/cscs-full-logo.png";
import officePhoto from "@/assets/office-zeus-house.jpg";
import greenCard from "@/assets/cscs-green-card.webp";
import blueCard from "@/assets/cscs-blue-card.webp";
import goldCard from "@/assets/cscs-gold-card.webp";
import blackCard from "@/assets/cscs-black-card.webp";

/* ─── component ─── */

const Landing = () => {
  const { language, setLanguage } = useLanguage();
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = (key: Parameters<typeof landingText>[0]) => landingText(key, language.code);

  const steps = [
  { icon: BookOpen, title: t("step_learn"), desc: t("step_learn_desc") },
  { icon: Target, title: t("step_practice"), desc: t("step_practice_desc") },
  { icon: Award, title: t("step_pass"), desc: t("step_pass_desc") },
  { icon: CreditCard, title: t("step_card"), desc: t("step_card_desc") }];


  const careerCards = [
  { img: greenCard, name: "Green", role: t("labourer"), qual: "Level 1 H&S", salary: "£21,500/yr" },
  { img: blueCard, name: "Blue", role: t("skilled_worker"), qual: "NVQ Level 2", salary: "£35,000/yr" },
  { img: goldCard, name: "Gold", role: t("supervisor"), qual: "NVQ Level 3", salary: "£42,000/yr" },
  { img: blackCard, name: "Black", role: t("manager"), qual: "NVQ Level 6", salary: "£55,000/yr" }];


  const faqs = [
  { q: "Do I need a CSCS test?", a: "Yes, you need the CSCS test to get the CSCS card. Luckily, we can do it here." },
  { q: "How long does it take?", a: "It can take as little as 6 hours to complete. The certificate can be available digitally as fast as one day, and the CSCS Smart Checker app can digitally have your card as fast as the next day. The physical card can take up to 5 working days to reach home." },
  { q: "What if I fail?", a: "If you fail an assessment topic, you can retake as many times as you need. If you fail the CSCS test, you can also retake as many times as you need." },
  { q: "Do I need to visit a centre?", a: "You don't need to. It's all done here with us, in one place. No centre visit needed." },
  { q: "Is this an official qualification?", a: "Yes. SkillCertify delivers the GQA Level 1 Award in Construction Health and Safety (601/2322/9), regulated by Ofqual." },
  { q: "What languages is it available in?", a: "English, Romanian, Polish, Bulgarian, Lithuanian, Arabic, Tigrinya, Yoruba, Igbo, Somali, and Amharic." },
  { q: "How much does it cost?", a: "Course: £XX + CSCS Test: £21 + Card Application: £36. See the pricing section above for the full breakdown." }];


  const handleSelectLang = (lang: Language) => {
    setLanguage(lang);
    setSheetOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ═══ HERO ═══ */}
      <section className="relative px-4 pt-10 pb-8 sm:pt-16 sm:pb-12 bg-secondary">
        {/* Language selector — compact, top right */}
        <button
          onClick={() => setSheetOpen(true)}
          className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-secondary-foreground/10 transition-colors"
          aria-label="Select language">

          <Globe className="h-3.5 w-3.5 text-secondary-foreground/50" />
          <span className="text-xs font-medium text-secondary-foreground/50 uppercase">{language.code}</span>
          <ChevronDown className="h-3 w-3 text-secondary-foreground/40" />
        </button>

        <div className="max-w-2xl mx-auto text-center">
          {/* Logo — transparent icon only */}
          <motion.img
            src={skillcertifyFullLogo}
            alt="SkillCertify"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-[60px] w-auto mx-auto mb-6 mix-blend-multiply"
            loading="eager"
            decoding="sync"
            fetchPriority="high" />


          {/* H1 — single clear headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-secondary-foreground font-[Poppins]">

            {t("hero_title_1")}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-secondary-foreground/70 max-w-md mx-auto">
            {t("hero_title_2")}
            <br />
            <span className="font-semibold text-secondary-foreground/80 inline-block mt-2">Learn in your language.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 flex flex-col items-center">

            <Button
              asChild
              size="lg"
              className="text-base px-8 h-12 font-semibold w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.97] transition-transform">

              <Link to="/select-language">
                {t("cta_start")}
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="mt-3 text-secondary-foreground/50 text-xs font-medium h-auto min-h-0 p-0">

              <Link to="/auth">{t("cta_signin")}</Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-3">

            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-secondary-foreground/15 bg-secondary-foreground/5">
              <img alt="GQA" className="h-5 w-auto" src={gqaLogo} />
              <span className="text-[10px] sm:text-xs font-medium text-secondary-foreground/60">GQA Approved Centre</span>
            </div>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-secondary-foreground/15 bg-secondary-foreground/5">
              <img src={myCscsLogo} alt="myCSCS" className="h-5 w-auto rounded" />
              <span className="text-[10px] sm:text-xs font-medium text-secondary-foreground/60">CSCS Smart Check</span>
            </div>
          </motion.div>

          {/* Benefits row — replaces loud scrolling strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 flex items-center justify-center gap-4 flex-wrap">

            {[t("social_pass_rate"), t("social_languages"), t("social_cert")].map((item, i) =>
            <span key={i} className="text-[10px] sm:text-xs text-secondary-foreground/50 flex items-center gap-1">
                <Check className="h-3 w-3 text-primary" />
                {item}
              </span>
            )}
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 max-w-sm mx-auto">
            <img
              src={heroImage}
              alt="CSCS Green Card and SkillCertify app on a construction site"
              className="w-full rounded-2xl shadow-lg"
              loading="eager"
            />
          </motion.div>

          {/* Reassurance line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-secondary-foreground/45">

            {t("no_laptop")}
          </motion.p>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8 font-[Poppins]">
            {t("how_it_works")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {steps.map(({ icon: Icon, title, desc }, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-card border border-border">

                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-primary">{t("step_prefix")} {i + 1}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="px-4 py-12 sm:py-16 bg-muted/50">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 font-[Poppins]">
            {t("pricing_title")}
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">

            <div className="space-y-2">
              {[
              { label: t("course_cert"), price: "£XX" },
              { label: t("cscs_test"), price: "£21" },
              { label: t("card_app"), price: "£36" }].
              map(({ label, price }) =>
              <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{price}</span>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-foreground">{t("total")}</span>
              <span className="font-bold text-foreground text-lg">£XX</span>
            </div>

            <div className="rounded-lg bg-muted p-2.5 text-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {t("klarna")}
              </span>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full text-base h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">

              <Link to="/select-language">
                {t("start_now")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ CAREER PROGRESSION ═══ */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2 font-[Poppins]">
            {t("career_title")}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {t("career_subtitle")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {careerCards.map((card, i) =>
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl overflow-hidden border bg-card ${i === 0 ? "border-primary shadow-md shadow-primary/10" : "border-border"}`}>

                <img
                src={card.img}
                alt={`${card.name} CSCS Card`}
                className="w-full aspect-[1.586/1] object-cover"
                loading="lazy" />

                <div className="p-3 space-y-0.5">
                  <p className="text-xs font-bold text-foreground">{card.role}</p>
                  <p className="text-[10px] text-muted-foreground">{card.qual}</p>
                  <p className="text-xs font-semibold text-primary">{card.salary}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CREDIBILITY — Office Photo ═══ */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-border shadow-sm">

            <img
              src={officePhoto}
              alt="SkillCertify office at Zeus House, London"
              className="w-full aspect-[2/1] object-cover"
              loading="lazy" />

            <div className="bg-card p-4 text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">Zeus House, London, N1 7NG</p>
              <p className="text-xs text-muted-foreground">Our London headquarters — here to support you every step of the way</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-4 py-12 sm:py-16 bg-muted/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 font-[Poppins]">
            {t("faq_title")}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) =>
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-4">
                <AccordionTrigger className="text-sm font-semibold text-foreground text-left py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-secondary px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Logo row */}
          <div className="flex items-center justify-center gap-4">
            <img alt="SkillCertify" className="h-8 w-auto" src={skillcertifyFullLogo} />
            <img src={gqaLogo} alt="GQA Approved Centre" className="h-8 w-auto" />
            <img src={cscsFullLogo} alt="CSCS" className="h-8 w-auto" />
          </div>

          {/* Address + centre number — compact */}
          <div className="text-center">
            <p className="text-xs text-secondary-foreground/50">
              Zeus House, London, N1 7NG
            </p>
          </div>

          {/* Support row with icons */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="mailto:support@skillcertify.co.uk"
              className="flex items-center gap-1.5 text-xs text-secondary-foreground/60 hover:text-secondary-foreground/80 transition-colors">

              <Mail className="h-3.5 w-3.5" />
              Email support
            </a>
            <a
              href="https://wa.me/44XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-secondary-foreground/60 hover:text-secondary-foreground/80 transition-colors">

              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp support
            </a>
          </div>

          {/* Legal links */}
          <div className="flex items-center justify-center gap-4 text-xs text-secondary-foreground/50">
            <Link to="/privacy" className="hover:text-secondary-foreground/70 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-secondary-foreground/70 transition-colors">Terms & Conditions</Link>
            <span>·</span>
            <a href="#" className="hover:text-secondary-foreground/70 transition-colors">Accessibility</a>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-secondary-foreground/40 text-center">
            © {new Date().getFullYear()} SkillCertify Ltd. All rights reserved. Registered in England & Wales.
          </p>
        </div>
      </footer>

      {/* ═══ LANGUAGE BOTTOM SHEET ═══ */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg font-bold text-foreground">
              Choose Your Language
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2 pb-6">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang)}
                  className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-colors ${
                  isActive ?
                  "border-primary bg-primary/5" :
                  "border-border bg-card hover:border-primary/30"}`
                  }>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{lang.native}</p>
                    {lang.code !== "en" &&
                    <p className="text-xs text-muted-foreground truncate">{lang.english}</p>
                    }
                  </div>
                  {isActive &&
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  }
                </button>);

            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>);

};

export default Landing;