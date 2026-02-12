
-- Cohort benchmarking: average stats across all users
CREATE OR REPLACE FUNCTION public.get_cohort_benchmark()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_avg_accuracy numeric;
  v_avg_speed numeric;
  v_avg_readiness numeric;
  v_total_users bigint;
  v_avg_prob numeric;
BEGIN
  -- Total active users (anyone with concept attempts)
  SELECT COUNT(DISTINCT user_id) INTO v_total_users FROM concept_attempts;

  IF v_total_users = 0 THEN
    RETURN jsonb_build_object(
      'avg_probability', 0,
      'avg_accuracy', 0,
      'avg_response_time_ms', 0,
      'total_users', 0
    );
  END IF;

  -- Avg concept accuracy across all users
  SELECT COALESCE(AVG(accuracy), 0) INTO v_avg_accuracy FROM v_concept_memory;

  -- Avg response time across all users
  SELECT COALESCE(AVG(response_time_ms), 0) INTO v_avg_speed FROM concept_attempts;

  -- Avg readiness from snapshots (latest per user)
  SELECT COALESCE(AVG(r.readiness), 0) INTO v_avg_readiness
  FROM (
    SELECT DISTINCT ON (user_id) readiness
    FROM readiness_snapshots
    ORDER BY user_id, computed_at DESC
  ) r;

  -- Approximate avg probability using same formula
  v_avg_prob := (0.35 * v_avg_accuracy)
              + (0.25 * 0.5) -- assume avg mock ~50% as fallback
              + (0.30 * COALESCE(v_avg_readiness / 100, 0))
              + (0.10 * LEAST(1, GREATEST(0, 1 - (v_avg_speed - 5000) / 15000.0)));
  v_avg_prob := GREATEST(0, LEAST(1, v_avg_prob));

  RETURN jsonb_build_object(
    'avg_probability', ROUND(v_avg_prob * 100, 1),
    'avg_accuracy', ROUND(v_avg_accuracy * 100, 1),
    'avg_response_time_ms', ROUND(v_avg_speed),
    'total_users', v_total_users
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_cohort_benchmark() TO authenticated;
