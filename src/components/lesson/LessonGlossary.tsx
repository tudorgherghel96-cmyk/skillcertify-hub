import { motion } from "framer-motion";
import { X, Volume2 } from "lucide-react";
import { speakWord } from "@/lib/pronunciation";
import { triggerHaptic } from "@/lib/haptics";

interface LessonGlossaryProps {
  terms: { term: string; explanation: string }[];
  onClose: () => void;
}

export default function LessonGlossary({ terms, onClose }: LessonGlossaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="absolute bottom-0 left-0 right-0 max-h-[75vh] bg-card rounded-t-3xl border-t border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="text-sm font-bold text-foreground">Quick Glossary</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-8 space-y-2 max-h-[60vh]">
          {terms.sort((a, b) => a.term.localeCompare(b.term)).map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
              <button
                onClick={() => { speakWord(t.term); triggerHaptic("tap"); }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 active:scale-90 transition-transform"
              >
                <Volume2 className="h-3.5 w-3.5 text-primary" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary">{t.term}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.explanation}</p>
              </div>
            </div>
          ))}
          {terms.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No key terms in this lesson.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
