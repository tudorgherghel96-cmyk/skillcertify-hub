import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { MODULES } from "@/data/courseData";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Calendar,
  Brain,
  AlertTriangle,
  Target,
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

interface PassData {
  probability: number;
  confidence: string;
  weakest_module: number | null;
  weak_concepts: { slug: string; name: string; module_id: number; memory_score: number }[];
  days_to_ready: number | null;
  avg_response_time_ms: number;
  total_study_days: number;
  days_since_last_study: number;
  concepts_mastered: number;
  concepts_total: number;
}

interface CohortData {
  avg_probability: number;
  avg_accuracy: number;
  avg_response_time_ms: number;
  total_users: number;
}

export default function PerformanceCard() {
  const [data, setData] = useState<PassData | null>(null);
  const [cohort, setCohort] = useState<CohortData | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const [probRes, cohortRes] = await Promise.all([
        supabase.rpc("compute_pass_probability" as any, { p_user_id: userData.user.id }),
        supabase.rpc("get_cohort_benchmark" as any),
      ]);

      if (probRes.data) setData(probRes.data as unknown as PassData);
      if (cohortRes.data) setCohort(cohortRes.data as unknown as CohortData);
    };
    load();
  }, []);

  if (!data) {
    return (
      <Card className="border-dashed opacity-70">
        <CardContent className="py-5 flex items-center gap-3">
          <Target className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Pass Probability</p>
            <p className="text-xs text-muted-foreground">
              Complete lessons and practice to unlock predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const prob = data.probability;
  const getColor = () => {
    if (prob < 60) return "hsl(var(--destructive))";
    if (prob < 80) return "hsl(45 93% 47%)";
    if (prob < 90) return "hsl(217 91% 60%)";
    return "hsl(var(--primary))";
  };

  const getConfidenceColor = () => {
    switch (data.confidence) {
      case "Very High": return "text-primary";
      case "High": return "text-blue-500";
      case "Moderate": return "text-yellow-600";
      default: return "text-destructive";
    }
  };

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (prob / 100) * circumference;

  const weakMod = data.weakest_module
    ? MODULES.find((m) => m.id === data.weakest_module)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="py-6 space-y-5">
          {/* Header row: gauge + stats */}
          <div className="flex items-center gap-5">
            {/* Radial gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg width="120" height="120" className="rotate-[-90deg]">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="hsl(var(--muted))"
                  strokeWidth="10"
                  fill="transparent"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  strokeWidth="10"
                  fill="transparent"
                  stroke={getColor()}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - progress }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">{prob}%</span>
                <span className="text-[10px] text-muted-foreground">Pass</span>
              </div>
            </div>

            {/* Key stats */}
            <div className="flex-1 space-y-2.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Pass Probability</p>
                <p className={`text-xs font-medium ${getConfidenceColor()}`}>
                  Confidence: {data.confidence}
                </p>
              </div>

              {data.days_to_ready !== null && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Ready in ~<strong className="text-foreground">{data.days_to_ready}</strong> day{data.days_to_ready !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Avg speed: <strong className="text-foreground">{(data.avg_response_time_ms / 1000).toFixed(1)}s</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Brain className="h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong className="text-foreground">{data.concepts_mastered}</strong>/{data.concepts_total} concepts mastered
                </span>
              </div>
            </div>
          </div>

          {/* Weak area */}
          {weakMod && (
            <div className="flex items-start gap-2 text-xs bg-destructive/5 rounded-lg p-3">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">
                  Weakest:{" "}
                  <Link to={`/module/${weakMod.id}`} className="text-primary hover:underline">
                    M{weakMod.id}: {weakMod.title}
                  </Link>
                </span>
                {data.weak_concepts.length > 0 && (
                  <p className="text-muted-foreground mt-0.5">
                    Fragile: {data.weak_concepts.slice(0, 4).map((c) => c.name).join(", ")}
                    {data.weak_concepts.length > 4 && ` +${data.weak_concepts.length - 4} more`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Behaviour row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">{data.total_study_days}</p>
              <p className="text-[10px] text-muted-foreground">Study Days</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">
                {data.days_since_last_study < 1
                  ? "Today"
                  : `${Math.round(data.days_since_last_study)}d`}
              </p>
              <p className="text-[10px] text-muted-foreground">Last Study</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">
                {(data.avg_response_time_ms / 1000).toFixed(1)}s
              </p>
              <p className="text-[10px] text-muted-foreground">Avg Speed</p>
            </div>
          </div>

          {/* Cohort Benchmarking */}
          {cohort && cohort.total_users > 0 && (() => {
            const diff = Math.round(prob - cohort.avg_probability);
            const DiffIcon = diff > 0 ? ArrowUp : diff < 0 ? ArrowDown : Minus;
            const diffColor = diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground";
            const speedDiff = cohort.avg_response_time_ms - data.avg_response_time_ms;
            const fasterSlower = speedDiff > 500 ? "Faster" : speedDiff < -500 ? "Slower" : "Average";
            const speedColor = speedDiff > 500 ? "text-primary" : speedDiff < -500 ? "text-destructive" : "text-muted-foreground";

            return (
              <div className="border-t border-border/50 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>vs {cohort.total_users} learner{cohort.total_users !== 1 ? "s" : ""}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <div className={`flex items-center justify-center gap-0.5 ${diffColor}`}>
                      <DiffIcon className="h-3.5 w-3.5" />
                      <span className="text-sm font-bold">{diff > 0 ? "+" : ""}{diff}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">vs Avg</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-sm font-bold text-foreground">{cohort.avg_probability}%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Cohort Avg</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className={`text-sm font-bold ${speedColor}`}>{fasterSlower}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Response</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
