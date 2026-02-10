import { useState, useEffect, useCallback } from "react";
import { Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { KeyTerm } from "@/data/lessonContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";

interface KeyTermsBarProps {
  terms: KeyTerm[];
}

const KeyTermsBar = ({ terms }: KeyTermsBarProps) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotate = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % terms.length);
  }, [terms.length]);

  useEffect(() => {
    if (terms.length <= 1) return;
    const id = setInterval(rotate, 8000);
    return () => clearInterval(id);
  }, [rotate, terms.length]);

  const term = terms[currentIndex];
  if (!term) return null;

  const translation =
    language.code === "en"
      ? term.english
      : term.translations[language.code] ?? term.english;

  return (
    <div className="rounded-xl bg-primary text-primary-foreground px-4 py-3">
      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <button
              className="shrink-0 p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
              aria-label={`Pronounce ${term.english}`}
              onClick={() => {
                const u = new SpeechSynthesisUtterance(term.english);
                u.lang = "en-GB";
                u.rate = 0.85;
                speechSynthesis.speak(u);
              }}
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <span className="font-bold text-sm tracking-wide">
              {term.english}
              {language.code !== "en" && (
                <span className="font-normal opacity-90"> = {translation}</span>
              )}
            </span>
          </motion.div>
        </AnimatePresence>

        <Dialog>
          <DialogTrigger asChild>
            <button className="text-xs underline underline-offset-2 opacity-80 hover:opacity-100 shrink-0 ml-2">
              All terms
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Key Terms</DialogTitle>
            </DialogHeader>
            <ul className="space-y-3 mt-2">
              {terms.map((t, i) => {
                const tr =
                  language.code === "en"
                    ? t.english
                    : t.translations[language.code] ?? t.english;
                return (
                  <li key={i} className="flex items-center gap-3">
                    <button
                      className="shrink-0 p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        const u = new SpeechSynthesisUtterance(t.english);
                        u.lang = "en-GB";
                        u.rate = 0.85;
                        speechSynthesis.speak(u);
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <div>
                      <span className="font-semibold text-foreground">
                        {t.english}
                      </span>
                      {language.code !== "en" && (
                        <span className="text-muted-foreground"> = {tr}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </DialogContent>
        </Dialog>
      </div>

      {terms.length > 1 && (
        <div className="flex gap-1 mt-2 justify-center">
          {terms.map((_, i) => (
            <div
              key={i}
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

export default KeyTermsBar;
