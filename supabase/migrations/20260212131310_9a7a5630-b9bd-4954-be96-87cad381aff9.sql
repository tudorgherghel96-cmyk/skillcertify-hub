
-- Upgrade compute_pass_probability to logistic regression model
CREATE OR REPLACE FUNCTION public.compute_pass_probability(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_mastery numeric;
  v_mock_score numeric;
  v_readiness numeric;
  v_avg_speed numeric;
  v_streak integer;
  v_spacing_decay numeric;
  v_z numeric;
  v_prob numeric;
  v_confidence text;
  v_weakest_module integer;
  v_weak_concepts jsonb;
  v_total_concepts integer;
  v_mastered_concepts integer;
  v_remaining integer;
  v_daily_rate numeric;
  v_days_to_ready numeric;
  v_active_days bigint;
  v_days_since_last numeric;
  v_fragile_count integer;
  v_mock_trend jsonb;
BEGIN
  -- Concept mastery (avg memory_score from compute_concept_state for true decay-adjusted mastery)
  SELECT COALESCE(AVG(cs.memory_score), 0)
  INTO v_mastery
  FROM compute_concept_state(p_user_id) cs;

  -- Mock performance (avg score ratio)
  SELECT COALESCE(AVG(CASE WHEN total > 0 THEN score::numeric / total ELSE 0 END), 0)
  INTO v_mock_score
  FROM mock_attempts
  WHERE user_id = p_user_id;

  -- Readiness score (live compute, not cached)
  SELECT COALESCE((compute_readiness(p_user_id)->>'readiness')::numeric / 100, 0)
  INTO v_readiness;

  -- Average response time
  SELECT COALESCE(AVG(response_time_ms), 0)
  INTO v_avg_speed
  FROM concept_attempts
  WHERE user_id = p_user_id;

  -- Consistency (streak)
  SELECT COALESCE(current_streak, 0) INTO v_streak
  FROM streaks WHERE user_id = p_user_id LIMIT 1;

  -- Spacing decay penalty: avg time since last correct across all concepts
  SELECT COALESCE(AVG(
    CASE WHEN vm.last_correct_at IS NOT NULL
      THEN EXTRACT(epoch FROM (now() - vm.last_correct_at)) / 86400.0 / 14.0
      ELSE 1.0
    END
  ), 1.0)
  INTO v_spacing_decay
  FROM v_concept_memory vm
  WHERE vm.user_id = p_user_id;
  v_spacing_decay := LEAST(1.0, v_spacing_decay); -- cap at 1.0

  -- LOGISTIC MODEL: z = weighted sum of features
  v_z := (1.2 * v_mastery)
       + (0.9 * v_mock_score)
       + (0.6 * v_readiness)
       - (0.00002 * v_avg_speed)        -- response time penalty
       - (0.3 * v_spacing_decay)         -- spacing decay penalty
       + (0.2 * LEAST(1, v_streak::numeric / 7)); -- consistency bonus

  -- Logistic function: P = 1 / (1 + e^-z)
  v_prob := 1.0 / (1.0 + exp(-v_z));

  v_confidence := CASE
    WHEN v_prob >= 0.9 THEN 'Very High'
    WHEN v_prob >= 0.8 THEN 'High'
    WHEN v_prob >= 0.7 THEN 'Moderate'
    WHEN v_prob >= 0.5 THEN 'Low'
    ELSE 'Very Low'
  END;

  -- Weakest module
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

  -- Weak concepts with memory_score < 0.6 (Fragile state)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'slug', c.slug,
    'name', c.name,
    'module_id', c.module_id,
    'memory_score', ROUND(cst.memory_score::numeric, 2),
    'accuracy', ROUND(cst.accuracy::numeric, 2),
    'state', cst.state
  ) ORDER BY cst.memory_score ASC), '[]'::jsonb)
  INTO v_weak_concepts
  FROM compute_concept_state(p_user_id) cst
  JOIN concepts c ON c.id = cst.concept_id
  WHERE cst.memory_score < 0.6;

  -- Fragile count
  SELECT COUNT(*) INTO v_fragile_count
  FROM compute_concept_state(p_user_id)
  WHERE state = 'Fragile';

  -- Time-to-ready projection
  SELECT COUNT(*) INTO v_total_concepts FROM concepts;
  SELECT COUNT(*) INTO v_mastered_concepts
  FROM compute_concept_state(p_user_id)
  WHERE memory_score >= 0.75;

  v_remaining := v_total_concepts - v_mastered_concepts;

  SELECT COUNT(DISTINCT created_at::date) INTO v_active_days
  FROM concept_attempts WHERE user_id = p_user_id;

  IF v_active_days > 0 AND v_mastered_concepts > 0 THEN
    v_daily_rate := v_mastered_concepts::numeric / v_active_days;
    v_days_to_ready := CASE WHEN v_daily_rate > 0 THEN CEIL(v_remaining / v_daily_rate) ELSE NULL END;
  ELSE
    v_days_to_ready := NULL;
  END IF;

  -- Days since last study
  SELECT EXTRACT(epoch FROM (now() - MAX(created_at))) / 86400.0
  INTO v_days_since_last
  FROM concept_attempts WHERE user_id = p_user_id;

  -- Mock trend (last 10 mocks)
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'score', sub.pct,
    'date', sub.d
  )), '[]'::jsonb) INTO v_mock_trend
  FROM (
    SELECT ROUND(score::numeric / NULLIF(total, 0) * 100, 1) as pct,
           attempted_at::date as d
    FROM mock_attempts
    WHERE user_id = p_user_id AND total > 0
    ORDER BY attempted_at DESC
    LIMIT 10
  ) sub;

  RETURN jsonb_build_object(
    'probability', ROUND(v_prob * 100, 1),
    'confidence', v_confidence,
    'weakest_module', v_weakest_module,
    'weak_concepts', v_weak_concepts,
    'fragile_count', v_fragile_count,
    'days_to_ready', v_days_to_ready,
    'avg_response_time_ms', ROUND(v_avg_speed),
    'total_study_days', v_active_days,
    'days_since_last_study', ROUND(COALESCE(v_days_since_last, 0)::numeric, 1),
    'concepts_mastered', v_mastered_concepts,
    'concepts_total', v_total_concepts,
    'mock_trend', v_mock_trend
  );
END;
$$;
