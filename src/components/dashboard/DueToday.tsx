import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    >
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                You've got {dueCount} question{dueCount !== 1 ? "s" : ""} to review
              </p>
              <p className="text-[11px] text-muted-foreground">
                Quick review to keep things fresh
              </p>
            </div>
          </div>
          <Button asChild className="w-full mt-3 h-10 font-semibold">
            <Link to="/practice/boost">Review now</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
