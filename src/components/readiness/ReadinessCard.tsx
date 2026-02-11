import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import { MODULES } from "@/data/courseData";

interface ReadinessData {
  readiness: number;
  tier: string;
  knowledge_score: number;
  skills_score: number;
  test_readiness_score: number;
  consistency_score: number;
  experience_score: number;
  weak_modules: number[];
  gates: string[];
  next_action: string;
}

const TIER_COLORS: Record<string, string> = {
  Beginner: "bg-destructive/10 text-destructive border-destructive/30",
  Developing: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  Competent: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Proficient: "bg-primary/10 text-primary border-primary/30",
  Expert: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

const COMPONENTS = [
  { key: "knowledge_score", label: "Knowledge", short: "K" },
  { key: "skills_score", label: "Skills", short: "S" },
  { key: "test_readiness_score", label: "Test Readiness", short: "T" },
  { key: "consistency_score", label: "Consistency", short: "C" },
  { key: "experience_score", label: "Experience", short: "E" },
] as const;

const ReadinessCard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setAuthChecked(true);
    });
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["readiness", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("compute_readiness" as any, {
        p_user_id: userId,
      });
      if (error) throw error;
      return data as unknown as ReadinessData;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  // Not authenticated – show fallback
  if (authChecked && !userId) {
    return (
      <Card className="border-dashed opacity-70">
        <CardContent className="py-5 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Readiness Index</p>
            <p className="text-xs text-muted-foreground">
              Start practising to unlock readiness tracking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading
  if (!authChecked || isLoading) {
    return (
      <Card>
        <CardContent className="py-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error or empty data
  if (isError || !data) {
    return (
      <Card className="border-dashed opacity-70">
        <CardContent className="py-5 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Readiness Index</p>
            <p className="text-xs text-muted-foreground">
              Start practising to unlock readiness tracking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierClass = TIER_COLORS[data.tier] ?? TIER_COLORS.Beginner;

  return (
    <Card className="border-primary/20">
      <CardContent className="py-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">Readiness Index</span>
          </div>
          <Badge variant="outline" className={`text-xs font-semibold ${tierClass}`}>
            {data.tier}
          </Badge>
        </div>

        {/* Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15.5"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${data.readiness * 0.974} 97.4`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
              {data.readiness}
            </span>
          </div>
          <div className="flex-1 space-y-1.5">
            {COMPONENTS.map(({ key, label, short }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground w-3">{short}</span>
                <Progress
                  value={(data as any)[key]}
                  className="h-1.5 flex-1"
                />
                <span className="text-[10px] text-muted-foreground w-6 text-right">
                  {(data as any)[key]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak modules */}
        {data.weak_modules.length > 0 && (
          <div className="flex items-start gap-2 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Focus areas: </span>
              {data.weak_modules.map((mid, i) => {
                const mod = MODULES.find((m) => m.id === mid);
                return (
                  <span key={mid}>
                    {i > 0 && ", "}
                    <Link to={`/module/${mid}`} className="text-primary hover:underline">
                      M{mid}{mod ? `: ${mod.title}` : ""}
                    </Link>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Next action CTA */}
        {data.next_action && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/dashboard">
              {data.next_action} <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ReadinessCard;
