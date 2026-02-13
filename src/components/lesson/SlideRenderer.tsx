import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Lightbulb, CheckCircle2, XCircle, HelpCircle,
  Play, BookOpen, ListChecks, Languages, Volume2
} from "lucide-react";
import { getLessonVideoUrl } from "@/lib/media";
import { triggerHaptic } from "@/lib/haptics";
import { speakWord } from "@/lib/pronunciation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Slide } from "@/data/slidesSchema";

/* ─── Shared wrapper ─── */
function SlideShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-full w-full flex flex-col items-center justify-center px-6 py-8 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}

/* ─── Micro entrance animation ─── */
const pop = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ─── English overlay ─── */
function EnglishOverlay({ text }: { text?: string }) {
  const [show, setShow] = useState(false);
  if (!text) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setShow(!show)}
        className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        <Languages className="h-3 w-3" />
        {show ? "Hide English" : "Show English"}
      </button>
      <AnimatePresence>
        {show && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-muted-foreground/50 italic mt-1.5 leading-relaxed"
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Hero Slide ─── */
function HeroSlide({ slide }: { slide: Extract<Slide, { type: "hero" }> }) {
  return (
    <SlideShell className="relative overflow-hidden p-0">
      {slide.imageSrc && (
        <>
          <img
            src={slide.imageSrc}
            alt={slide.imageAlt || ""}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </>
      )}
      <motion.div
        variants={pop}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center space-y-3 max-w-sm mt-auto pb-20 px-6"
      >
        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">{slide.subtitle}</p>
        <h1 className="text-2xl font-bold text-white leading-tight">{slide.title}</h1>
      </motion.div>
    </SlideShell>
  );
}

/* ─── Video Slide ─── */
function VideoSlide({ slide, isActive }: { slide: Extract<Slide, { type: "video" }>; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = getLessonVideoUrl(slide.lessonId);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive && !loading) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, loading]);

  if (error) {
    return (
      <SlideShell>
        <motion.div variants={pop} initial="hidden" animate="show" className="flex flex-col items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Play className="h-7 w-7 text-muted-foreground ml-0.5" />
          </div>
          <p className="text-muted-foreground text-sm">Video coming soon</p>
          <p className="text-[11px] text-muted-foreground/50 animate-pulse">Swipe up to continue ↑</p>
        </motion.div>
      </SlideShell>
    );
  }

  return (
    <SlideShell className="p-0 bg-black">
      <div className="w-full h-full flex items-center justify-center relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          src={url}
          playsInline
          muted
          loop
          preload="metadata"
          className={`w-full h-auto max-h-full transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
          onError={() => setError(true)}
          onLoadedMetadata={() => setLoading(false)}
        />
      </div>
    </SlideShell>
  );
}

/* ─── Text Slide ─── */
function TextSlide({ slide }: { slide: Extract<Slide, { type: "text" }> }) {
  return (
    <SlideShell>
      <motion.div variants={pop} initial="hidden" animate="show" className="max-w-md space-y-2 text-center">
        {slide.title && (
          <h2 className="text-xl font-bold text-foreground">{slide.title}</h2>
        )}
        <p className={`text-lg leading-relaxed text-foreground/85 ${slide.bold ? "font-bold text-foreground" : ""}`}>
          {slide.body}
        </p>
        <EnglishOverlay text={slide.bodyEn} />
      </motion.div>
    </SlideShell>
  );
}

/* ─── Image Slide ─── */
function ImageSlide({ slide }: { slide: Extract<Slide, { type: "image" }> }) {
  const [failed, setFailed] = useState(false);

  return (
    <SlideShell className="p-4">
      <motion.div variants={pop} initial="hidden" animate="show" className="w-full max-w-lg flex flex-col items-center gap-3">
        <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-background">
          <img
            src={failed ? "/fallback.webp" : slide.src}
            alt={slide.alt}
            className="w-full h-auto"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center px-2 max-w-xs">
          {slide.caption || slide.alt}
        </p>
      </motion.div>
    </SlideShell>
  );
}

/* ─── Key Term Slide — with sound wave animation ─── */
function KeyTermSlide({ slide }: { slide: Extract<Slide, { type: "keyterm" }> }) {
  const [playing, setPlaying] = useState(false);

  const handleSpeak = () => {
    setPlaying(true);
    speakWord(slide.term);
    triggerHaptic("tap");
    setTimeout(() => setPlaying(false), 1500);
  };

  return (
    <SlideShell>
      <motion.div variants={pop} initial="hidden" animate="show" className="max-w-sm text-center space-y-5">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <div className="flex items-center gap-3 justify-center">
          <h2 className="text-2xl font-bold text-primary tracking-tight">{slide.term}</h2>
          <button
            onClick={handleSpeak}
            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-90 transition-all relative"
            aria-label={`Pronounce ${slide.term}`}
          >
            {playing ? (
              <motion.div className="flex items-center gap-[2px]">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-primary"
                    animate={{ height: [4, 14, 6, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            ) : (
              <Volume2 className="h-5 w-5 text-primary" />
            )}
          </button>
        </div>
        <p className="text-base text-foreground/75 leading-relaxed">{slide.explanation}</p>
      </motion.div>
    </SlideShell>
  );
}

/* ─── Remember This Slide ─── */
function RememberSlide({ slide }: { slide: Extract<Slide, { type: "remember" }> }) {
  const reducedMotion = useReducedMotion();
  return (
    <SlideShell>
      <motion.div variants={pop} initial="hidden" animate="show" className="max-w-md text-center space-y-5">
        <motion.div
          animate={reducedMotion ? undefined : { scale: [1, 1.08, 1] }}
          transition={reducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto ring-2 ring-destructive/20"
        >
          <Brain className="h-8 w-8 text-destructive" />
        </motion.div>
        <p className="text-xs font-bold uppercase tracking-widest text-destructive">Remember This</p>
        <p className="text-lg font-semibold leading-relaxed text-foreground">{slide.text}</p>
        <EnglishOverlay text={slide.textEn} />
      </motion.div>
    </SlideShell>
  );
}

/* ─── Test Tip Slide — with amber glow ─── */
function TipSlide({ slide }: { slide: Extract<Slide, { type: "tip" }> }) {
  const reducedMotion = useReducedMotion();
  return (
    <SlideShell>
      <motion.div variants={pop} initial="hidden" animate="show" className="max-w-md text-center space-y-5">
        <motion.div
          animate={reducedMotion ? undefined : { rotate: [0, 8, -8, 0], boxShadow: ["0 0 0 0 rgba(245,158,11,0.2)", "0 0 20px 4px rgba(245,158,11,0.15)", "0 0 0 0 rgba(245,158,11,0.2)"] }}
          transition={reducedMotion ? undefined : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto ring-2 ring-amber-500/20"
        >
          <Lightbulb className="h-8 w-8 text-amber-500" />
        </motion.div>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Test Tip</p>
        <p className="text-lg leading-relaxed text-foreground">{slide.text}</p>
        <EnglishOverlay text={slide.textEn} />
      </motion.div>
    </SlideShell>
  );
}

/* ─── Quiz Slide — with shake entry + ripple effects ─── */
function QuizSlide({
  slide,
  onQuizAnswered,
}: {
  slide: Extract<Slide, { type: "quiz" }>;
  onQuizAnswered?: (correct: boolean, conceptSlug?: string, responseTimeMs?: number) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const [rippleIdx, setRippleIdx] = useState<number | null>(null);
  const startTime = useRef(Date.now());
  const isAnswered = selected !== null;
  const isCorrect = selected === slide.correct;

  const handleSelect = (i: number) => {
    if (isAnswered) return;
    setSelected(i);
    setRippleIdx(i);
    const responseTime = Date.now() - startTime.current;
    const correct = i === slide.correct;
    if (!reducedMotion) triggerHaptic(correct ? "success" : "error");
    onQuizAnswered?.(correct, slide.conceptSlug, responseTime);
  };

  return (
    <SlideShell>
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: [-4, 4, -4, 4, 0] }}
        animate={{ opacity: 1, x: 0 }}
        transition={reducedMotion ? { duration: 0.2 } : { duration: 0.4 }}
        className="max-w-md w-full space-y-6"
      >
        <div className="text-center space-y-3">
          <motion.div
            animate={reducedMotion ? undefined : { rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto"
          >
            <HelpCircle className="h-6 w-6 text-primary" />
          </motion.div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Quick Check</p>
          <p className="text-lg font-semibold text-foreground">{slide.question}</p>
          {slide.questionEn && (
            <p className="text-sm text-muted-foreground/50 italic">{slide.questionEn}</p>
          )}
        </div>

        <div className="space-y-2.5">
          {slide.options.map((opt, i) => {
            const isThis = selected === i;
            const showCorrect = isAnswered && i === slide.correct;
            return (
              <motion.button
                key={i}
                whileTap={!isAnswered ? { scale: 0.97 } : undefined}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`relative w-full text-left px-4 py-4 rounded-2xl text-sm font-medium transition-all border-2 overflow-hidden ${
                  isAnswered
                    ? showCorrect
                      ? "border-primary bg-primary/10 text-foreground"
                      : isThis
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : "border-transparent bg-muted/30 text-muted-foreground"
                    : "border-border bg-card active:bg-primary/5 text-foreground"
                }`}
                animate={
                  isAnswered && isThis && !isCorrect
                    ? { x: [-3, 3, -3, 3, 0] }
                    : undefined
                }
                transition={{ duration: 0.3 }}
              >
                {/* Ripple effect on correct answer */}
                {isAnswered && showCorrect && !reducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-primary/10"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <span className="flex items-center gap-3 relative z-10">
                  {!isAnswered && (
                    <span className="h-6 w-6 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                  )}
                  {isAnswered && showCorrect && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                  {isAnswered && isThis && !showCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                  {opt}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`text-sm font-medium rounded-2xl px-4 py-3 text-center ${
                isCorrect ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              }`}
            >
              {isCorrect
                ? `✓ ${slide.feedback || "Correct!"}`
                : `Not quite — ${slide.feedback || `The answer is: ${slide.options[slide.correct]}`}`}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </SlideShell>
  );
}

/* ─── Summary Slide ─── */
function SummarySlide({ slide }: { slide: Extract<Slide, { type: "summary" }> }) {
  return (
    <SlideShell>
      <motion.div variants={pop} initial="hidden" animate="show" className="max-w-md w-full space-y-5">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Key Facts</p>
        </div>
        <div className="space-y-2">
          {slide.facts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
            >
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{fact}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideShell>
  );
}

/* ─── Main renderer ─── */
export default function SlideRenderer({
  slide,
  isActive = false,
  onQuizAnswered,
}: {
  slide: Slide;
  isActive?: boolean;
  onQuizAnswered?: (correct: boolean, conceptSlug?: string, responseTimeMs?: number) => void;
}) {
  switch (slide.type) {
    case "hero": return <HeroSlide slide={slide} />;
    case "video": return <VideoSlide slide={slide} isActive={isActive} />;
    case "text": return <TextSlide slide={slide} />;
    case "image": return <ImageSlide slide={slide} />;
    case "keyterm": return <KeyTermSlide slide={slide} />;
    case "remember": return <RememberSlide slide={slide} />;
    case "tip": return <TipSlide slide={slide} />;
    case "quiz": return <QuizSlide slide={slide} onQuizAnswered={onQuizAnswered} />;
    case "summary": return <SummarySlide slide={slide} />;
    default: return null;
  }
}
