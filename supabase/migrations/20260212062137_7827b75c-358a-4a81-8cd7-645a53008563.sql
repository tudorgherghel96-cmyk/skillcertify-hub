
-- Step 2B: Concept Attempts telemetry table
CREATE TABLE public.concept_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  concept_id uuid NOT NULL REFERENCES public.concepts(id),
  is_correct boolean NOT NULL,
  response_time_ms integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.concept_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own concept attempts"
  ON public.concept_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own concept attempts"
  ON public.concept_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_concept_attempts_user ON public.concept_attempts (user_id);
CREATE INDEX idx_concept_attempts_concept ON public.concept_attempts (concept_id);
CREATE INDEX idx_concept_attempts_user_concept ON public.concept_attempts (user_id, concept_id);

-- Step 2C: Memory View
CREATE VIEW public.v_concept_memory
WITH (security_invoker = on)
AS
SELECT
  user_id,
  concept_id,
  avg(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) AS accuracy,
  percentile_cont(0.5) WITHIN GROUP (ORDER BY response_time_ms) AS median_response,
  max(CASE WHEN is_correct THEN created_at END) AS last_correct_at,
  count(*) AS attempts
FROM public.concept_attempts
GROUP BY user_id, concept_id;

-- Wave 3: compute_concept_state function
CREATE OR REPLACE FUNCTION public.compute_concept_state(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb := '[]'::jsonb;
  v_concept record;
  v_accuracy numeric;
  v_median_ms numeric;
  v_last_correct timestamptz;
  v_attempts bigint;
  v_spacing_decay numeric;
  v_speed_factor numeric;
  v_score numeric;
  v_state text;
  v_hours_since numeric;
  v_concept_scores jsonb := '[]'::jsonb;
  v_avg_concept_score numeric := 0;
  v_count integer := 0;
BEGIN
  FOR v_concept IN
    SELECT c.id AS concept_id, c.module_id, c.slug, c.name, c.difficulty_weight,
           m.accuracy, m.median_response, m.last_correct_at, m.attempts
    FROM public.concepts c
    LEFT JOIN public.v_concept_memory m
      ON m.concept_id = c.id AND m.user_id = p_user_id
  LOOP
    -- Default values for unattempted concepts
    IF v_concept.attempts IS NULL OR v_concept.attempts = 0 THEN
      v_concept_scores := v_concept_scores || jsonb_build_object(
        'concept_id', v_concept.concept_id,
        'slug', v_concept.slug,
        'name', v_concept.name,
        'module_id', v_concept.module_id,
        'score', 0,
        'state', 'Fragile',
        'accuracy', 0,
        'attempts', 0,
        'median_ms', 0,
        'last_correct_at', null
      );
      v_count := v_count + 1;
      CONTINUE;
    END IF;

    v_accuracy := v_concept.accuracy;
    v_median_ms := v_concept.median_response;
    v_last_correct := v_concept.last_correct_at;
    v_attempts := v_concept.attempts;

    -- Spacing decay: halves every 7 days since last correct answer
    IF v_last_correct IS NOT NULL THEN
      v_hours_since := EXTRACT(EPOCH FROM (now() - v_last_correct)) / 3600.0;
      v_spacing_decay := POWER(0.5, v_hours_since / 168.0); -- 168h = 7 days
    ELSE
      v_spacing_decay := 0.3; -- never got one right
    END IF;

    -- Speed factor: 1.0 if ≤3s, scales down to 0.5 at 10s+
    v_speed_factor := GREATEST(0.5, LEAST(1.0, 1.0 - ((v_median_ms - 3000.0) / 14000.0)));

    -- Composite score
    v_score := v_accuracy * 0.6 * v_spacing_decay + v_speed_factor * 0.4;
    v_score := LEAST(1.0, GREATEST(0.0, v_score));

    -- Classify state
    v_state := CASE
      WHEN v_score >= 0.9 AND v_median_ms < 4000 THEN 'Automatic'
      WHEN v_score >= 0.75 THEN 'Stable'
      WHEN v_score >= 0.6 THEN 'Developing'
      ELSE 'Fragile'
    END;

    v_concept_scores := v_concept_scores || jsonb_build_object(
      'concept_id', v_concept.concept_id,
      'slug', v_concept.slug,
      'name', v_concept.name,
      'module_id', v_concept.module_id,
      'score', ROUND(v_score * 100),
      'state', v_state,
      'accuracy', ROUND(v_accuracy * 100),
      'attempts', v_attempts,
      'median_ms', ROUND(v_median_ms),
      'last_correct_at', v_last_correct
    );

    v_avg_concept_score := v_avg_concept_score + v_score;
    v_count := v_count + 1;
  END LOOP;

  -- Average concept-level score (0-100)
  IF v_count > 0 THEN
    v_avg_concept_score := ROUND((v_avg_concept_score / v_count) * 100);
  END IF;

  RETURN jsonb_build_object(
    'concept_score', v_avg_concept_score,
    'total_concepts', v_count,
    'concepts', v_concept_scores
  );
END;
$$;
