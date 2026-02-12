
DROP FUNCTION IF EXISTS public.compute_concept_state(uuid);

CREATE OR REPLACE FUNCTION public.compute_concept_state(p_user_id uuid)
RETURNS TABLE (
  concept_id uuid,
  accuracy numeric,
  memory_score numeric,
  state text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec record;
  decay numeric;
  score numeric;
BEGIN
  FOR rec IN
    SELECT * FROM v_concept_memory WHERE user_id = p_user_id
  LOOP
    IF rec.last_correct_at IS NULL THEN
      decay := 0;
    ELSE
      decay := exp(-extract(epoch FROM (now() - rec.last_correct_at)) / 86400 / 7);
    END IF;

    score := rec.accuracy * decay;

    RETURN QUERY
    SELECT
      rec.concept_id,
      rec.accuracy,
      score,
      CASE
        WHEN score < 0.6 THEN 'Fragile'
        WHEN score < 0.75 THEN 'Developing'
        WHEN score < 0.9 THEN 'Stable'
        ELSE 'Automatic'
      END;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_concept_state(uuid) TO authenticated;
