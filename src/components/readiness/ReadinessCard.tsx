import { motion } from "framer-motion";
import RadialGauge from "./RadialGauge";
import SignalBar from "./SignalBar";
import TierBadge from "./TierBadge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

export default function ReadinessCard() {
  const [data, setData] = useState<ReadinessData | null>(null);
  const [boosting, setBoosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: readiness } = await supabase.rpc(
        "compute_readiness" as any,
        { p_user_id: userData.user.id }
      );

      if (readiness) {
        setData(readiness as unknown as ReadinessData);
      }
    };

    load();
  }, []);

  if (!data) {
    return (
      <Card className="border-dashed opacity-70">
        <CardContent className="py-5 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Readiness Index</p>
            <p className="text-xs text-muted-foreground">
              Start practising to unlock readiness tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20">
        <CardContent className="py-6 space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <RadialGauge value={data.readiness} />

            <div className="flex-1 w-full space-y-3">
              <TierBadge tier={data.tier} />
              <SignalBar label="Knowledge" value={data.knowledge_score / 100} />
              <SignalBar label="Skills" value={data.skills_score / 100} />
              <SignalBar label="Test Readiness" value={data.test_readiness_score / 100} />
              <SignalBar label="Consistency" value={data.consistency_score / 100} />
              <SignalBar label="Experience" value={data.experience_score / 100} />
            </div>
          </div>

          {data.weak_modules && data.weak_modules.length > 0 && (
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

          {data.next_action && (
            <p className="text-sm text-muted-foreground text-center">
              ⚡ {data.next_action}
            </p>
          )}

          {/* Adaptive Boost Button */}
          <Button
            className="w-full h-11"
            disabled={boosting}
            onClick={async () => {
              setBoosting(true);
              try {
                const { data: userData } = await supabase.auth.getUser();
                if (!userData.user) return;
                const { data: boostData } = await supabase.rpc(
                  "get_boost_concepts" as any,
                  { p_user_id: userData.user.id }
                );
                if (boostData && (boostData as any[]).length > 0) {
                  const slugs = (boostData as any[]).map((b: any) => b.slug);
                  navigate("/practice/boost", { state: { boostSlugs: slugs } });
                }
              } finally {
                setBoosting(false);
              }
            }}
          >
            <Zap className="mr-2 h-4 w-4" />
            {boosting ? "Loading…" : "Adaptive Boost Drill"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
