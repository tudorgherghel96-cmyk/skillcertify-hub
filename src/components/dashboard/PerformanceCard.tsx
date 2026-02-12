import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MODULES } from "@/data/courseData";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Clock,
  Calendar,
  Brain,
  AlertTriangle,
  Target,
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

interface WeakConcept {
  slug: string;
  name: string;
  module_id: number;
  memory_score: number;
  accuracy: number;
  state: string;
}

interface MockTrendPoint {
  score: number;
  date: string;
}

interface PassData {
  probability: number;
  confidence: string;
  weakest_module: number | null;
  weak_concepts: WeakConcept[];
  fragile_count: number;
  days_to_ready: number | null;
  avg_response_time_ms: number;
  total_study_days: number;
  days_since_last_study: number;
  concepts_mastered: number;
  concepts_total: number;
  mock_trend: MockTrendPoint[];
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
  const [showExplainer, setShowExplainer] = useState(false);

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
            <p className="text-xs text-muted-foreground">Complete lessons and practice to unlock predictions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const prob = data.probability;
  const confidenceMargin = prob >= 80 ? 5 : prob >= 60 ? 8 : 12;
  const getColor = () => {
    if (prob < 60) return "hsl(var(--destructive))";
    if (prob < 80) return "hsl(45 93% 47%)";
    if (prob < 90) return "hsl(217 91% 60%)";
    return "hsl(var(--primary))";
  };

  // Top 3 drivers
  const drivers: string[] = [];
  if (data.weakest_module) {
    const mod = MODULES.find((m) => m.id === data.weakest_module);
    if (mod) drivers.push(`${mod.title} accuracy`);
  }
  if (data.total_study_days > 0) drivers.push("Study consistency");
  if (data.avg_response_time_ms > 5000) drivers.push("Response speed");
  if (drivers.length === 0) drivers.push("Overall concept mastery", "Quiz consistency", "Drill streak");

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progressVal = (prob / 100) * circumference;

  const trendData = (data.mock_trend || []).slice().reverse();
  const isTrendUp = trendData.length >= 2 && trendData[trendData.length - 1].score > trendData[0].score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="py-5 space-y-5">
          {/* Gauge + stats */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg width="120" height="120" className="rotate-[-90deg]">
                <circle cx="60" cy="60" r={radius} stroke="hsl(var(--muted))" strokeWidth="10" fill="transparent" />
                <motion.circle
                  cx="60" cy="60" r={radius} strokeWidth="10" fill="transparent"
                  stroke={getColor()} strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - progressVal }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">{prob}%</span>
                <span className="text-[10px] text-muted-foreground">Pass</span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Pass Probability</p>
                <p className="text-xs text-muted-foreground">
                  {prob}% ± {confidenceMargin}% • {data.confidence}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top drivers</p>
                {drivers.slice(0, 3).map((d, i) => (
                  <p key={i} className="text-xs text-foreground flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                    {d}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Next action CTA */}
          {data.weakest_module && (
            <Button asChild variant="outline" size="sm" className="w-full h-10 active:scale-[0.97] transition-transform">
              <Link to={`/practice/${data.weakest_module}`}>
                <Target className="mr-2 h-4 w-4 text-primary" />
                Do 10 questions on {MODULES.find(m => m.id === data.weakest_module)?.title}
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          )}

          {/* Fragile concepts warning */}
          {data.fragile_count > 0 && (
            <div className="flex items-center gap-2 text-xs bg-destructive/8 rounded-lg px-3 py-2">
              <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
              <span className="text-foreground font-medium">
                {data.fragile_count} fragile concept{data.fragile_count !== 1 ? "s" : ""} — review needed
              </span>
            </div>
          )}

          {/* Weak concepts */}
          {data.weak_concepts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                Weak Concepts
              </p>
              <div className="space-y-1.5">
                {data.weak_concepts.slice(0, 4).map((c) => (
                  <div key={c.slug} className="flex items-center justify-between text-xs bg-muted/40 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${c.state === "Fragile" ? "bg-destructive" : "bg-amber-500"}`} />
                      <span className="text-foreground truncate">{c.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${c.state === "Fragile" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"}`}>
                      {c.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mock Trend */}
          {trendData.length >= 2 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {isTrendUp ? <TrendingUp className="h-3.5 w-3.5 text-primary" /> : <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                  Mock Trend
                </span>
                <span className={`text-[10px] font-medium ${isTrendUp ? "text-primary" : "text-destructive"}`}>
                  {isTrendUp ? "Improving" : "Declining"}
                </span>
              </div>
              <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Score"]}
                    />
                    <Line
                      type="monotone" dataKey="score"
                      stroke={isTrendUp ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                      strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">{data.concepts_mastered}/{data.concepts_total}</p>
              <p className="text-[10px] text-muted-foreground">Mastered</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">{data.total_study_days}</p>
              <p className="text-[10px] text-muted-foreground">Study Days</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-foreground">{(data.avg_response_time_ms / 1000).toFixed(1)}s</p>
              <p className="text-[10px] text-muted-foreground">Avg Speed</p>
            </div>
          </div>

          {/* Cohort */}
          {cohort && cohort.total_users > 0 && (() => {
            const diff = Math.round(prob - cohort.avg_probability);
            const DiffIcon = diff > 0 ? ArrowUp : diff < 0 ? ArrowDown : Minus;
            const diffColor = diff > 0 ? "text-primary" : diff < 0 ? "text-destructive" : "text-muted-foreground";
            return (
              <div className="border-t border-border/50 pt-3">
                <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" /> vs {cohort.total_users} learner{cohort.total_users !== 1 ? "s" : ""}
                </p>
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
                    <p className="text-[10px] text-muted-foreground mt-0.5">Cohort</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30">
                    <p className="text-sm font-bold text-foreground">{Math.round(cohort.avg_accuracy * 100)}%</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Avg Acc</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Explainer */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <HelpCircle className="h-3 w-3" />
            What this means
          </button>
          {showExplainer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-3 space-y-1"
            >
              <p>Pass Probability uses a logistic regression model combining concept mastery, mock scores, readiness, response speed, and study consistency.</p>
              <p>The confidence band (±{confidenceMargin}%) reflects uncertainty based on your data volume.</p>
              <p>Top drivers show which factors most influence your current score.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
