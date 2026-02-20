import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target } from "lucide-react";
import { MODULES } from "@/data/courseData";
import { getModuleProgress } from "@/contexts/ProgressContext";
import { useProgress } from "@/contexts/ProgressContext";

// ── Daily XP bar chart (last 7 days) ─────────────────────────────────────────

interface DayXp { day: string; xp: number }

export function DailyXpChart() {
  const { user } = useAuth();
  const [data, setData] = useState<DayXp[]>([]);

  useEffect(() => {
    if (!user) return;
    // Build last-7-days skeleton
    const days: DayXp[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { day: d.toLocaleDateString("en-GB", { weekday: "short" }), xp: 0 };
    });

    supabase
      .from("daily_xp_log")
      .select("log_date, xp_earned")
      .eq("user_id", user.id)
      .gte("log_date", new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
      .then(({ data: rows }) => {
        if (!rows) return;
        rows.forEach((r) => {
          const label = new Date(r.log_date).toLocaleDateString("en-GB", { weekday: "short" });
          const idx = days.findIndex((d) => d.day === label);
          if (idx >= 0) days[idx].xp = r.xp_earned;
        });
        setData([...days]);
      });
  }, [user]);

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Daily XP (last 7 days)
        </h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              formatter={(v: number) => [`${v} XP`, "XP"]}
            />
            <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ── Accuracy by module bar chart ──────────────────────────────────────────────

interface ModuleAcc { name: string; pct: number }

export function AccuracyByModuleChart() {
  const { progress } = useProgress();

  const data: ModuleAcc[] = MODULES.map((m) => {
    const mp = getModuleProgress(progress, m.id);
    return {
      name: `M${m.id}`,
      pct: mp.practice.bestScore,
    };
  });

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Practice Score by Module
        </h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              formatter={(v: number) => [`${v}%`, "Best score"]}
            />
            <Bar dataKey="pct" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
