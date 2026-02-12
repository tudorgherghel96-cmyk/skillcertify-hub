import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyFactSummaryProps {
  facts: string[];
}

const KeyFactSummary = ({ facts }: KeyFactSummaryProps) => {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((p) => Math.max(0, p - 1));
  const goNext = () => setIndex((p) => Math.min(facts.length - 1, p + 1));

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-secondary px-4 py-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-secondary-foreground" />
        <h3 className="text-sm font-bold text-secondary-foreground">
          Key Facts to Memorise
        </h3>
        <span className="ml-auto text-xs text-secondary-foreground/70">
          {index + 1} / {facts.length}
        </span>
      </div>

      {/* Fact area with inline nav arrows */}
      <div className="relative px-4 py-6 min-h-[120px] flex items-center justify-center">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="badge-sm absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          aria-label="Previous fact"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="text-center text-[16px] font-semibold leading-relaxed text-foreground px-8"
          >
            {facts[index]}
          </motion.p>
        </AnimatePresence>

        <button
          onClick={goNext}
          disabled={index === facts.length - 1}
          className="badge-sm absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          aria-label="Next fact"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {facts.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`badge-sm rounded-full transition-all ${
              i === index ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-border"
            }`}
            aria-label={`Go to fact ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default KeyFactSummary;
