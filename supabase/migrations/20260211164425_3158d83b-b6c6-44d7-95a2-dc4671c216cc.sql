
-- ============================================================
-- Readiness Index v1: tables, view, RPC
-- ============================================================

-- 1. mock_attempts table
CREATE TABLE IF NOT EXISTS public.mock_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  score integer,
  total integer,
  duration_seconds integer,
  attempted_at timestamptz DEFAULT now()
);
ALTER TABLE public.mock_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own mock attempts" ON public.mock_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mock attempts" ON public.mock_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. readiness_snapshots table (cache)
CREATE TABLE IF NOT EXISTS public.readiness_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  readiness integer CHECK (readiness >= 0 AND readiness <= 100),
  tier text,
  components jsonb,
  weak_modules integer[],
  gates jsonb,
  next_action text,
  computed_at timestamptz DEFAULT now()
);
ALTER TABLE public.readiness_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own snapshots" ON public.readiness_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshots" ON public.readiness_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. v_module_stats view
CREATE OR REPLACE VIEW public.v_module_stats AS
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

-- 4. compute_readiness RPC
CREATE OR REPLACE FUNCTION public.compute_readiness(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_lessons integer := 21; -- 8+4+4+3+2
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
  v_module_scores jsonb;
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

  -- T: Test readiness (% GQA modules passed)
  SELECT COALESCE(COUNT(DISTINCT module_id), 0)::numeric / v_total_modules * 100 INTO v_t
  FROM public.gqa_results
  WHERE user_id = p_user_id AND passed = true;

  -- C: Consistency (streak)
  SELECT COALESCE(current_streak, 0) INTO v_streak
  FROM public.streaks
  WHERE user_id = p_user_id
  LIMIT 1;
  -- Normalize: 7-day streak = 100
  v_c := LEAST(100, (v_streak::numeric / 7) * 100);

  -- E: Experience (total attempts, cap at 50 = 100%)
  SELECT COALESCE(COUNT(*), 0) INTO v_total_attempts
  FROM public.practice_attempts
  WHERE user_id = p_user_id;
  v_e := LEAST(100, (v_total_attempts::numeric / 50) * 100);

  -- Weighted readiness
  v_readiness := ROUND(v_k * 0.25 + v_s * 0.25 + v_t * 0.25 + v_c * 0.15 + v_e * 0.10);

  -- Tier
  v_tier := CASE
    WHEN v_readiness >= 90 THEN 'Expert'
    WHEN v_readiness >= 75 THEN 'Proficient'
    WHEN v_readiness >= 55 THEN 'Competent'
    WHEN v_readiness >= 30 THEN 'Developing'
    ELSE 'Beginner'
  END;

  -- Weak modules: best practice < 60% or incomplete lessons
  SELECT ARRAY_AGG(DISTINCT m) INTO v_weak_modules
  FROM (
    -- modules with low practice scores
    SELECT module_id AS m FROM public.practice_attempts
    WHERE user_id = p_user_id
    GROUP BY module_id
    HAVING MAX(percentage) < 60
    UNION
    -- modules with no practice at all but having some progress
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
  ELSIF v_s < 80 THEN
    v_next_action := 'Improve practice scores to 80%+';
  ELSE
    v_next_action := 'Take the CSCS mock test';
  END IF;

  RETURN jsonb_build_object(
    'readiness', v_readiness,
    'tier', v_tier,
    'knowledge_score', ROUND(v_k),
    'skills_score', ROUND(v_s),
    'test_readiness_score', ROUND(v_t),
    'consistency_score', ROUND(v_c),
    'experience_score', ROUND(v_e),
    'weak_modules', COALESCE(v_weak_modules, ARRAY[]::integer[]),
    'gates', v_gates,
    'next_action', v_next_action
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_readiness(uuid) TO authenticated;
