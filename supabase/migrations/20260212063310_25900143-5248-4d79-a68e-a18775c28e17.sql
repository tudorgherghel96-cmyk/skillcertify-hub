
CREATE OR REPLACE FUNCTION public.get_boost_concepts(p_user_id uuid)
RETURNS TABLE (
  concept_id uuid,
  slug text,
  priority numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    vm.concept_id,
    c.slug,
    (1 - vm.accuracy)
    + (extract(epoch FROM (now() - COALESCE(vm.last_correct_at, now() - interval '30 days'))) / 86400.0 / 7.0)
    + (vm.median_response / 15000.0)
    AS priority
  FROM v_concept_memory vm
  JOIN concepts c ON c.id = vm.concept_id
  WHERE vm.user_id = p_user_id
  ORDER BY priority DESC
  LIMIT 5;
$$;

GRANT EXECUTE ON FUNCTION public.get_boost_concepts(uuid) TO authenticated;
