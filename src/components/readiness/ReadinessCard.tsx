import { motion } from "framer-motion";
import RadialGauge from "./RadialGauge";
import SignalBar from "./SignalBar";
import TierBadge from "./TierBadge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, Zap, ChevronRight, HelpCircle, Target } from "lucide-react";
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
  const [showExplainer, setShowExplainer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: readiness } = await supabase.rpc(
        "compute_readiness" as any,
        { p_user_id: userData.user.id }
      );
      if (readiness) setData(readiness as unknown as ReadinessData);
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
            <p className="text-xs text-muted-foreground">Start practising to unlock readiness tracking.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Plain-language explanation
  const getPlainLanguage = () => {
    if (data.readiness >= 85) return "You're ready for mock tests — keep practising to lock it in.";
    if (data.readiness >= 65) return "Good progress! Focus on weak areas to boost your score.";
    if (data.readiness >= 40) return "You're building momentum. Complete more lessons and drills.";
    return "Just getting started — focus on completing lessons first.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20">
        <CardContent className="py-5 space-y-5">
          {/* Gauge + plain language */}
          <div className="flex items-center gap-4">
            <RadialGauge value={data.readiness} />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <TierBadge tier={data.tier} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {getPlainLanguage()}
              </p>
            </div>
          </div>

          {/* Signal bars */}
          <div className="space-y-2">
            <SignalBar label="Knowledge" value={data.knowledge_score / 100} />
            <SignalBar label="Skills" value={data.skills_score / 100} />
            <SignalBar label="Test Readiness" value={data.test_readiness_score / 100} />
            <SignalBar label="Consistency" value={data.consistency_score / 100} />
          </div>

          {/* Weak areas with direct CTA */}
          {data.weak_modules && data.weak_modules.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                Focus areas
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.weak_modules.map((mid) => {
                  const mod = MODULES.find((m) => m.id === mid);
                  return (
                    <Link
                      key={mid}
                      to={`/module/${mid}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-destructive/8 text-destructive text-[11px] font-medium hover:bg-destructive/15 transition-colors"
                    >
                      <Target className="h-3 w-3" />
                      M{mid}: {mod?.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next action CTA */}
          {data.next_action && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <Zap className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs text-foreground flex-1">
                <span className="font-semibold">Next: </span>{data.next_action}
              </p>
            </div>
          )}

          {/* What this means */}
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
              <p>Your Readiness Index blends lesson completion, practice scores, test readiness, and study consistency.</p>
              <p>Score 85+ with zero fragile concepts to unlock the CSCS mock test.</p>
            </motion.div>
          )}

          {/* Boost button */}
          <Button
            className="w-full h-11 active:scale-[0.97] transition-transform"
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
