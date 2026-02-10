import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface KeyFactSummaryProps {
  facts: string[];
}

const KeyFactSummary = ({ facts }: KeyFactSummaryProps) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="bg-secondary px-4 py-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-secondary-foreground" />
        <h3 className="text-sm font-bold text-secondary-foreground">
          Key Facts to Memorise
        </h3>
        <span className="ml-auto text-xs text-secondary-foreground/70">
          {index + 1} / {facts.length}
        </span>
      </div>

      <div className="px-4 py-6 min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="text-center text-[16px] font-semibold leading-relaxed text-foreground px-2"
          >
            {facts[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((p) => Math.max(0, p - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
        </Button>
        <div className="flex gap-1">
          {facts.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-4 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((p) => Math.min(facts.length - 1, p + 1))}
          disabled={index === facts.length - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default KeyFactSummary;
