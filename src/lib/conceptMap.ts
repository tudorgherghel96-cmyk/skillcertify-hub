import { supabase } from "@/integrations/supabase/client";

let conceptCache: Record<string, string> | null = null;

/**
 * Fetches concept slug → UUID mapping, cached after first call.
 */
export async function getConceptIdMap(): Promise<Record<string, string>> {
  if (conceptCache) return conceptCache;
  const { data } = await supabase.from("concepts").select("id, slug");
  const map: Record<string, string> = {};
  if (data) {
    for (const row of data) {
      map[row.slug] = row.id;
    }
  }
  conceptCache = map;
  return map;
}
