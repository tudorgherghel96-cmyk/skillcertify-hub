
-- Fix: make v_performance_metrics use invoker security (not definer)
DROP VIEW IF EXISTS public.v_performance_metrics;
CREATE VIEW public.v_performance_metrics WITH (security_invoker = true) AS
SELECT
  user_id,
  COUNT(*) AS total_attempts,
  AVG(response_time_ms) AS avg_response_time,
  COUNT(DISTINCT created_at::date) AS active_days,
  MAX(created_at) AS last_attempt_at,
  AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) AS overall_accuracy
FROM concept_attempts
GROUP BY user_id;
