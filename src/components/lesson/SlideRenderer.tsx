import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain, Lightbulb, CheckCircle2, XCircle, HelpCircle,
  Play, BookOpen, ListChecks
} from "lucide-react";
import { getLessonVideoUrl } from "@/lib/media";
import type { Slide } from "@/data/slidesSchema";

/* ─── Shared wrapper for all slides ─── */
function SlideShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-full w-full flex flex-col items-center justify-center px-6 py-8 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Hero Slide ─── */
function HeroSlide({ slide }: { slide: Extract<Slide, { type: "hero" }> }) {
  return (
    <SlideShell className="relative overflow-hidden">
      {slide.imageSrc && (
        <>
          <img
            src={slide.imageSrc}
            alt={slide.imageAlt || ""}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </>
      )}
      <div className="relative z-10 text-center space-y-3 max-w-md">
        <p className="text-sm font-medium text-white/70 uppercase tracking-wider">{slide.subtitle}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{slide.title}</h1>
      </div>
    </SlideShell>
  );
}

/* ─── Video Slide ─── */
function VideoSlide({ slide }: { slide: Extract<Slide, { type: "video" }> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = getLessonVideoUrl(slide.lessonId);

  useEffect(() => {
    if (videoRef.current && !loading) {
      videoRef.current.play().catch(() => {});
    }
  }, [loading]);

  if (error) {
    return (
      <SlideShell>
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Play className="h-7 w-7 text-muted-foreground ml-0.5" />
        </div>
        <p className="text-muted-foreground text-sm">Video coming soon</p>
      </SlideShell>
    );
  }

  return (
    <SlideShell className="p-0">
      <div className="w-full h-full flex items-center justify-center bg-black relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          src={url}
          controls
          playsInline
          preload="metadata"
          className={`w-full h-auto max-h-full transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
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
      <div className="max-w-lg space-y-4 text-center">
        {slide.title && (
          <h2 className="text-xl font-bold text-foreground">{slide.title}</h2>
        )}
        <p className={`text-lg leading-relaxed text-foreground/90 ${slide.bold ? "font-bold" : ""}`}>
          {slide.body}
        </p>
      </div>
    </SlideShell>
  );
}

/* ─── Image Slide ─── */
function ImageSlide({ slide }: { slide: Extract<Slide, { type: "image" }> }) {
  const [failed, setFailed] = useState(false);

  return (
    <SlideShell className="p-4">
      <div className="w-full max-w-lg flex flex-col items-center gap-3">
        <div className="w-full rounded-xl overflow-hidden" style={{ backgroundColor: "hsl(var(--secondary))" }}>
          <img
            src={failed ? "/fallback.webp" : slide.src}
            alt={slide.alt}
            className="w-full h-auto"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        </div>
        {slide.caption && (
          <p className="text-sm text-muted-foreground text-center px-2">{slide.caption}</p>
        )}
        {!slide.caption && (
          <p className="text-sm text-muted-foreground text-center px-2">{slide.alt}</p>
        )}
      </div>
    </SlideShell>
  );
}

/* ─── Key Term Slide ─── */
function KeyTermSlide({ slide }: { slide: Extract<Slide, { type: "keyterm" }> }) {
  return (
    <SlideShell>
      <div className="max-w-sm text-center space-y-4">
        <BookOpen className="h-8 w-8 text-primary mx-auto" />
        <h2 className="text-2xl font-bold text-primary">{slide.term}</h2>
        <p className="text-base text-foreground/80 leading-relaxed">{slide.explanation}</p>
      </div>
    </SlideShell>
  );
}

/* ─── Remember This Slide ─── */
function RememberSlide({ slide }: { slide: Extract<Slide, { type: "remember" }> }) {
  return (
    <SlideShell>
      <div className="max-w-md text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <Brain className="h-7 w-7 text-destructive" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-destructive">Remember This</p>
        <p className="text-lg font-semibold leading-relaxed text-foreground">{slide.text}</p>
      </div>
    </SlideShell>
  );
}

/* ─── Test Tip Slide ─── */
function TipSlide({ slide }: { slide: Extract<Slide, { type: "tip" }> }) {
  return (
    <SlideShell>
      <div className="max-w-md text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
          <Lightbulb className="h-7 w-7 text-amber-500" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Test Tip</p>
        <p className="text-lg leading-relaxed text-foreground">{slide.text}</p>
      </div>
    </SlideShell>
  );
}

/* ─── Quiz Slide ─── */
function QuizSlide({ slide, onAnswer }: { slide: Extract<Slide, { type: "quiz" }>; onAnswer?: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = selected !== null;
  const isCorrect = selected === slide.correct;

  const handleSelect = (i: number) => {
    if (isAnswered) return;
    setSelected(i);
    onAnswer?.(i === slide.correct);
  };

  return (
    <SlideShell>
      <div className="max-w-md w-full space-y-5">
        <div className="flex items-center gap-2 justify-center">
          <HelpCircle className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Quick Check</p>
        </div>
        <p className="text-lg font-semibold text-foreground text-center">{slide.question}</p>
        <div className="space-y-2.5">
          {slide.options.map((opt, i) => {
            const isThis = selected === i;
            const showCorrect = isAnswered && i === slide.correct;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all border ${
                  isAnswered
                    ? showCorrect
                      ? "border-primary bg-primary/10 text-foreground"
                      : isThis
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : "border-border bg-muted/50 text-muted-foreground"
                    : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isAnswered && showCorrect && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                  {isAnswered && isThis && !showCorrect && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-medium rounded-xl px-4 py-3 text-center ${
              isCorrect ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}
          >
            {slide.feedback
              ? (isCorrect ? "✓ " : "✗ ") + slide.feedback
              : isCorrect
              ? "✓ Correct!"
              : `✗ The answer is: ${slide.options[slide.correct]}`}
          </motion.div>
        )}
      </div>
    </SlideShell>
  );
}

/* ─── Summary Slide ─── */
function SummarySlide({ slide }: { slide: Extract<Slide, { type: "summary" }> }) {
  return (
    <SlideShell>
      <div className="max-w-md w-full space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <ListChecks className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Key Facts</p>
        </div>
        <div className="space-y-2.5">
          {slide.facts.map((fact, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

/* ─── Main renderer ─── */
export default function SlideRenderer({ slide, onAnswer }: { slide: Slide; onAnswer?: (correct: boolean) => void }) {
  switch (slide.type) {
    case "hero": return <HeroSlide slide={slide} />;
    case "video": return <VideoSlide slide={slide} />;
    case "text": return <TextSlide slide={slide} />;
    case "image": return <ImageSlide slide={slide} />;
    case "keyterm": return <KeyTermSlide slide={slide} />;
    case "remember": return <RememberSlide slide={slide} />;
    case "tip": return <TipSlide slide={slide} />;
    case "quiz": return <QuizSlide slide={slide} onAnswer={onAnswer} />;
    case "summary": return <SummarySlide slide={slide} />;
    default: return null;
  }
}
