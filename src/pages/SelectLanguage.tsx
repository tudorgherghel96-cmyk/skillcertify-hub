import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, LANGUAGES, type Language } from "@/contexts/LanguageContext";

const headings = [
  "Choose Your Language",
  "Alegeți limba dvs.",
  "Pasirinkite savo kalbą",
  "Изберете вашия език",
  "اختر لغتك",
  "ቋንቋኻ ምረጽ",
  "Yan èdè rẹ",
  "Họrọ asụsụ gị",
  "Dooro luqadaada",
  "ቋንቋዎን ይምረጡ",
];

const SelectLanguage = () => {
  const navigate = useNavigate();
  const { language: currentLang, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language | null>(null);

  const handleSelect = (lang: Language) => {
    setSelected(lang);
  };

  const handleContinue = () => {
    if (selected) {
      setLanguage(selected);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-4 py-8 sm:py-12 max-w-2xl mx-auto w-full space-y-8">
        {/* Multi-language heading stack */}
        <div className="space-y-1 text-center">
          {headings.map((h, i) => (
            <p
              key={i}
              className={`leading-tight ${
                i === 0
                  ? "text-2xl sm:text-3xl font-bold text-foreground"
                  : "text-sm sm:text-base text-muted-foreground/60 font-medium"
              }`}
            >
              {h}
            </p>
          ))}
        </div>

        {/* Subtitle */}
        <div className="text-center space-y-3 max-w-lg mx-auto">
          <p className="text-sm sm:text-base text-muted-foreground">
            Audio is always in English. All text, subtitles, and key terms appear in your chosen language.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/80">
            You'll learn the English safety words you need for UK construction sites AND for your tests.
          </p>
        </div>

        {/* Language grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = selected?.code === lang.code;
            return (
              <motion.button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors min-h-[60px] ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="text-2xl sm:text-3xl shrink-0">{lang.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{lang.english}</p>
                  <p className="text-xs text-muted-foreground truncate">{lang.native}</p>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sticky continue button */}
      <div className="sticky bottom-0 border-t bg-card p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-14 text-base"
            disabled={!selected}
            onClick={handleContinue}
          >
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectLanguage;
