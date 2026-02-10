import { useState, useEffect, useCallback } from "react";
import { Volume2, BookOpen, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { ui } from "@/i18n/translations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface KeyTermEntry {
  english: string;
  translations: Record<string, string>;
  definition?: Record<string, string>; // optional per-language definitions
}

interface KeyTermsPanelProps {
  terms: KeyTermEntry[];
  maxDisplay?: number;
  autoRotate?: boolean;
  rotateInterval?: number;
}

const KeyTermsPanel = ({
  terms,
  maxDisplay = 3,
  autoRotate = true,
  rotateInterval = 8000,
}: KeyTermsPanelProps) => {
  const { language } = useLanguage();
  const lang = language.code;
  const isRtl = language.rtl;
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotate = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % terms.length);
  }, [terms.length]);

  useEffect(() => {
    if (!autoRotate || terms.length <= 1) return;
    const id = setInterval(rotate, rotateInterval);
    return () => clearInterval(id);
  }, [rotate, autoRotate, rotateInterval, terms.length]);

  const term = terms[currentIndex];
  if (!term || terms.length === 0) return null;

  const translation =
    lang === "en" ? term.english : term.translations[lang] ?? term.english;

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.85;
    speechSynthesis.speak(u);
  };

  // Sort terms alphabetically by English for the modal
  const sortedTerms = [...terms].sort((a, b) => a.english.localeCompare(b.english));

  return (
    <div className="rounded-xl bg-primary text-primary-foreground overflow-hidden">
      {/* Rotating bar */}
      <div
        className="px-4 py-3 min-h-[60px] flex items-center justify-between"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <button
              className="shrink-0 p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
              aria-label={`Pronounce ${term.english}`}
              onClick={() => speak(term.english)}
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold truncate">
              {isRtl ? (
                <>
                  <span>{translation}</span>
                  <span className="opacity-70">=</span>
                  <span className="font-bold tracking-wide">{term.english}</span>
                </>
              ) : (
                <>
                  <span className="font-bold tracking-wide">{term.english}</span>
                  {lang !== "en" && (
                    <>
                      <span className="opacity-70">=</span>
                      <span className="font-normal opacity-90">{translation}</span>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-xs underline underline-offset-2 opacity-80 hover:opacity-100 shrink-0 ml-3">
              <BookOpen className="h-3.5 w-3.5" />
              {ui("all_terms", lang)}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{ui("key_terms", lang)}</DialogTitle>
            </DialogHeader>
            <ul className="space-y-3 mt-2">
              {sortedTerms.map((t, i) => {
                const tr = lang === "en" ? t.english : t.translations[lang] ?? t.english;
                const def =
                  t.definition?.[lang] ?? t.definition?.en ?? undefined;
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    <button
                      className="shrink-0 p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors mt-0.5"
                      onClick={() => speak(t.english)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-sm">
                          {t.english}
                        </span>
                        {lang !== "en" && (
                          <>
                            <span className="text-muted-foreground text-xs">=</span>
                            <span className="text-sm text-primary font-medium">{tr}</span>
                          </>
                        )}
                      </div>
                      {def && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {def}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dots indicator */}
      {terms.length > 1 && (
        <div className="flex gap-1 justify-center pb-2.5">
          {terms.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-4 bg-primary-foreground"
                  : "w-1.5 bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KeyTermsPanel;
