
-- Pass probability RPC with weak-area clustering and time projection
CREATE OR REPLACE FUNCTION public.compute_pass_probability(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_avg_accuracy numeric;
  v_avg_speed numeric;
  v_mock_score numeric;
  v_readiness numeric;
  v_prob numeric;
  v_confidence text;
  v_weakest_module integer;
  v_weak_concepts jsonb;
  v_total_concepts integer;
  v_mastered_concepts integer;
  v_remaining integer;
  v_daily_rate numeric;
  v_days_to_ready numeric;
  v_total_attempts bigint;
  v_days_since_last numeric;
BEGIN
  -- Average concept accuracy
  SELECT COALESCE(AVG(accuracy), 0)
  INTO v_avg_accuracy
  FROM v_concept_memory
  WHERE user_id = p_user_id;

  -- Average response time
  SELECT COALESCE(AVG(response_time_ms), 0)
  INTO v_avg_speed
  FROM concept_attempts
  WHERE user_id = p_user_id;

  -- Mock performance (avg score ratio)
  SELECT COALESCE(AVG(CASE WHEN total > 0 THEN score::numeric / total ELSE 0 END), 0)
  INTO v_mock_score
  FROM mock_attempts
  WHERE user_id = p_user_id;

  -- Latest readiness score
  SELECT COALESCE(r.readiness::numeric / 100, 0)
  INTO v_readiness
  FROM (
    SELECT readiness FROM readiness_snapshots
    WHERE user_id = p_user_id
    ORDER BY computed_at DESC LIMIT 1
  ) r;

  -- If no snapshot, compute live
  IF v_readiness = 0 THEN
    SELECT COALESCE((compute_readiness(p_user_id)->>'readiness')::numeric / 100, 0)
    INTO v_readiness;
  END IF;

  -- Weighted probability
  v_prob := (0.35 * v_avg_accuracy)
          + (0.25 * v_mock_score)
          + (0.30 * v_readiness)
          + (0.10 * LEAST(1, GREATEST(0, 1 - (v_avg_speed - 5000) / 15000.0)));

  v_prob := GREATEST(0, LEAST(1, v_prob));

  v_confidence := CASE
    WHEN v_prob >= 0.9 THEN 'Very High'
    WHEN v_prob >= 0.8 THEN 'High'
    WHEN v_prob >= 0.7 THEN 'Moderate'
    WHEN v_prob >= 0.5 THEN 'Low'
    ELSE 'Very Low'
  END;

  -- Weakest module by worst avg concept accuracy
  SELECT cs.module_id INTO v_weakest_module
  FROM (
    SELECT c.module_id, AVG(vm.accuracy) as avg_acc
    FROM v_concept_memory vm
    JOIN concepts c ON c.id = vm.concept_id
    WHERE vm.user_id = p_user_id
    GROUP BY c.module_id
    ORDER BY avg_acc ASC
    LIMIT 1
  ) cs;

  -- Weak concepts (memory_score < 0.6)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'slug', c.slug,
    'name', c.name,
    'module_id', c.module_id,
    'memory_score', ROUND(cst.memory_score::numeric, 2)
  )), '[]'::jsonb)
  INTO v_weak_concepts
  FROM compute_concept_state(p_user_id) cst
  JOIN concepts c ON c.id = cst.concept_id
  WHERE cst.memory_score < 0.6;

  -- Time-to-ready projection
  SELECT COUNT(*) INTO v_total_concepts FROM concepts;
  SELECT COUNT(*) INTO v_mastered_concepts
  FROM compute_concept_state(p_user_id)
  WHERE memory_score >= 0.75;

  v_remaining := v_total_concepts - v_mastered_concepts;

  -- Daily mastery rate (concepts mastered per day of activity)
  SELECT COUNT(DISTINCT created_at::date)
  INTO v_total_attempts
  FROM concept_attempts
  WHERE user_id = p_user_id;

  IF v_total_attempts > 0 AND v_mastered_concepts > 0 THEN
    v_daily_rate := v_mastered_concepts::numeric / v_total_attempts;
    v_days_to_ready := CASE WHEN v_daily_rate > 0 THEN CEIL(v_remaining / v_daily_rate) ELSE NULL END;
  ELSE
    v_days_to_ready := NULL;
  END IF;

  -- Days since last study
  SELECT EXTRACT(epoch FROM (now() - MAX(created_at))) / 86400.0
  INTO v_days_since_last
  FROM concept_attempts
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'probability', ROUND(v_prob * 100, 1),
    'confidence', v_confidence,
    'weakest_module', v_weakest_module,
    'weak_concepts', v_weak_concepts,
    'days_to_ready', v_days_to_ready,
    'avg_response_time_ms', ROUND(v_avg_speed),
    'total_study_days', v_total_attempts,
    'days_since_last_study', ROUND(COALESCE(v_days_since_last, 0)::numeric, 1),
    'concepts_mastered', v_mastered_concepts,
    'concepts_total', v_total_concepts
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_pass_probability(uuid) TO authenticated;

-- Performance metrics view
CREATE OR REPLACE VIEW public.v_performance_metrics AS
SELECT
  user_id,
  COUNT(*) AS total_attempts,
  AVG(response_time_ms) AS avg_response_time,
  COUNT(DISTINCT created_at::date) AS active_days,
  MAX(created_at) AS last_attempt_at,
  AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) AS overall_accuracy
FROM concept_attempts
GROUP BY user_id;
