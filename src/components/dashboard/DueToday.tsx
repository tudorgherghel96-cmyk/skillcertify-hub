import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function DueToday() {
  const [dueCount, setDueCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDue() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from("concept_attempts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("next_review_at", "is", null)
        .lte("next_review_at", new Date().toISOString());

      if (!error && count !== null && count > 0) {
        setDueCount(count);
      }
    }
    fetchDue();
  }, []);

  if (dueCount === null || dueCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <Link
        to="/boost-drill"
        className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <RotateCcw className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {dueCount} Concept{dueCount !== 1 ? "s" : ""} Due Today
          </p>
          <p className="text-[11px] text-muted-foreground">
            Review now to lock in your knowledge
          </p>
        </div>
        <Brain className="h-4 w-4 text-muted-foreground shrink-0" />
      </Link>
    </motion.div>
  );
}
