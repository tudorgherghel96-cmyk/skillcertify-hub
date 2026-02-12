import { useLocation, Link, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { getAllQuestions } from "@/data/quizQuestions";
import DrillMode from "@/components/practice/DrillMode";
import { useTelemetry } from "@/hooks/useTelemetry";
import { getConceptIdMap } from "@/lib/conceptMap";

const BoostDrill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const boostSlugs: string[] = (location.state as any)?.boostSlugs ?? [];
  const { trackConceptAttempt } = useTelemetry();
  const conceptMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    getConceptIdMap().then((map) => {
      conceptMapRef.current = map;
    });
  }, []);

  const handleConceptAttempt = useCallback(
    (conceptSlug: string, isCorrect: boolean, responseTimeMs: number) => {
      const conceptId = conceptMapRef.current[conceptSlug];
      if (conceptId) {
        trackConceptAttempt(conceptId, isCorrect, responseTimeMs);
      }
    },
    [trackConceptAttempt]
  );

  const questions = useMemo(() => {
    if (boostSlugs.length === 0) return [];
    const slugSet = new Set(boostSlugs);
    return getAllQuestions().filter((q) => slugSet.has(q.conceptSlug));
  }, [boostSlugs]);

  if (questions.length === 0) {
    return (
      <div className="px-4 py-12 text-center space-y-3">
        <p className="text-muted-foreground">No boost concepts found. Complete some practice first.</p>
        <Link to="/dashboard" className="text-primary underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="text-lg font-bold mt-1 text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Adaptive Boost Drill
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Targeting your {boostSlugs.length} weakest concepts
        </p>
      </div>

      <DrillMode questions={questions} onConceptAttempt={handleConceptAttempt} />
    </div>
  );
};

export default BoostDrill;
