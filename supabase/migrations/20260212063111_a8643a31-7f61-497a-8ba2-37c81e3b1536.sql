
CREATE OR REPLACE FUNCTION public.compute_readiness(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_total_lessons integer := 21;
  v_total_modules integer := 5;
  v_lessons_done integer;
  v_k numeric;
  v_s numeric;
  v_t numeric;
  v_c numeric;
  v_e numeric;
  v_readiness integer;
  v_tier text;
  v_weak_modules integer[];
  v_gates jsonb;
  v_next_action text;
  v_streak integer;
  v_total_attempts bigint;
  -- concept-level blending
  v_concept_avg numeric;
  v_concept_count integer;
  v_k_blended numeric;
  v_s_blended numeric;
BEGIN
  -- K: Knowledge (lessons completed / total)
  SELECT COALESCE(COUNT(*), 0) INTO v_lessons_done
  FROM public.progress
  WHERE user_id = p_user_id AND completed = true;
  v_k := LEAST(100, (v_lessons_done::numeric / v_total_lessons) * 100);

  -- S: Skills (avg of best practice scores per module)
  SELECT COALESCE(AVG(best), 0) INTO v_s
  FROM (
    SELECT MAX(percentage) AS best
    FROM public.practice_attempts
    WHERE user_id = p_user_id
    GROUP BY module_id
  ) sub;

  -- Concept-level memory scores (avg of compute_concept_state memory_score)
  SELECT COALESCE(AVG(cs.memory_score), 0), COALESCE(COUNT(*), 0)
  INTO v_concept_avg, v_concept_count
  FROM public.compute_concept_state(p_user_id) cs;

  -- Blend K: 50% module-level + 50% concept-level (concept accuracy as knowledge proxy)
  IF v_concept_count > 0 THEN
    v_k_blended := v_k * 0.5 + (v_concept_avg * 100) * 0.5;
    v_s_blended := v_s * 0.5 + (v_concept_avg * 100) * 0.5;
  ELSE
    -- No concept data yet, fall back to module-only
    v_k_blended := v_k;
    v_s_blended := v_s;
  END IF;

  -- T: Test readiness (% GQA modules passed)
  SELECT COALESCE(COUNT(DISTINCT module_id), 0)::numeric / v_total_modules * 100 INTO v_t
  FROM public.gqa_results
  WHERE user_id = p_user_id AND passed = true;

  -- C: Consistency (streak, 7-day = 100)
  SELECT COALESCE(current_streak, 0) INTO v_streak
  FROM public.streaks
  WHERE user_id = p_user_id
  LIMIT 1;
  v_c := LEAST(100, (v_streak::numeric / 7) * 100);

  -- E: Experience (total attempts, cap at 50 = 100%)
  SELECT COALESCE(COUNT(*), 0) INTO v_total_attempts
  FROM public.practice_attempts
  WHERE user_id = p_user_id;
  v_e := LEAST(100, (v_total_attempts::numeric / 50) * 100);

  -- Weighted readiness using blended scores
  v_readiness := ROUND(v_k_blended * 0.25 + v_s_blended * 0.25 + v_t * 0.25 + v_c * 0.15 + v_e * 0.10);

  -- Tier
  v_tier := CASE
    WHEN v_readiness >= 90 THEN 'Expert'
    WHEN v_readiness >= 75 THEN 'Proficient'
    WHEN v_readiness >= 55 THEN 'Competent'
    WHEN v_readiness >= 30 THEN 'Developing'
    ELSE 'Beginner'
  END;

  -- Weak modules: best practice < 60% or no practice at all
  SELECT ARRAY_AGG(DISTINCT m) INTO v_weak_modules
  FROM (
    SELECT module_id AS m FROM public.practice_attempts
    WHERE user_id = p_user_id
    GROUP BY module_id
    HAVING MAX(percentage) < 60
    UNION
    SELECT gs.id AS m FROM generate_series(1, 5) gs(id)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.practice_attempts pa
      WHERE pa.user_id = p_user_id AND pa.module_id = gs.id
    )
  ) sub;

  -- Gates
  SELECT COALESCE(jsonb_agg(gate), '[]'::jsonb) INTO v_gates
  FROM (
    SELECT 'Complete Module ' || gs.id || ' lessons' AS gate
    FROM generate_series(1, 5) gs(id)
    WHERE (SELECT COUNT(*) FROM public.progress WHERE user_id = p_user_id AND module_id = gs.id AND completed = true) = 0
    UNION ALL
    SELECT 'Pass Module ' || gs.id || ' GQA' AS gate
    FROM generate_series(1, 5) gs(id)
    WHERE NOT EXISTS (SELECT 1 FROM public.gqa_results WHERE user_id = p_user_id AND module_id = gs.id AND passed = true)
    AND EXISTS (SELECT 1 FROM public.progress WHERE user_id = p_user_id AND module_id = gs.id AND completed = true)
  ) sub;

  -- Next action
  IF v_lessons_done = 0 THEN
    v_next_action := 'Start Module 1 lessons';
  ELSIF v_lessons_done < v_total_lessons THEN
    v_next_action := 'Complete more lessons';
  ELSIF v_t < 100 THEN
    v_next_action := 'Pass remaining GQA tests';
  ELSIF v_s_blended < 80 THEN
    v_next_action := 'Improve practice scores to 80%+';
  ELSE
    v_next_action := 'Take the CSCS mock test';
  END IF;

  RETURN jsonb_build_object(
    'readiness', v_readiness,
    'tier', v_tier,
    'knowledge_score', ROUND(v_k_blended),
    'skills_score', ROUND(v_s_blended),
    'test_readiness_score', ROUND(v_t),
    'consistency_score', ROUND(v_c),
    'experience_score', ROUND(v_e),
    'weak_modules', COALESCE(v_weak_modules, ARRAY[]::integer[]),
    'gates', v_gates,
    'next_action', v_next_action
  );
END;
$function$;
