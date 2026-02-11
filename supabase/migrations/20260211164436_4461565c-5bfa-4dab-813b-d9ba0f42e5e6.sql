
-- Fix: change v_module_stats to SECURITY INVOKER (default, safe)
CREATE OR REPLACE VIEW public.v_module_stats
WITH (security_invoker = true)
AS
SELECT
  p.user_id,
  p.module_id,
  COUNT(*) FILTER (WHERE p.completed = true) AS lessons_completed,
  COALESCE(pa.total_attempts, 0) AS total_practice_attempts,
  COALESCE(pa.best_score, 0) AS best_practice_score,
  COALESCE(pa.avg_score, 0) AS avg_practice_score,
  COALESCE(gqa.passed, false) AS gqa_passed,
  COALESCE(gqa.score, 0) AS gqa_score
FROM public.progress p
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) AS total_attempts,
    MAX(pa2.percentage) AS best_score,
    AVG(pa2.percentage) AS avg_score
  FROM public.practice_attempts pa2
  WHERE pa2.user_id = p.user_id AND pa2.module_id = p.module_id
) pa ON true
LEFT JOIN LATERAL (
  SELECT g.passed, g.score
  FROM public.gqa_results g
  WHERE g.user_id = p.user_id AND g.module_id = p.module_id
  ORDER BY g.attempted_at DESC
  LIMIT 1
) gqa ON true
GROUP BY p.user_id, p.module_id, pa.total_attempts, pa.best_score, pa.avg_score, gqa.passed, gqa.score;
