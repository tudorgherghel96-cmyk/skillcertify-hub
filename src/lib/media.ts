import { supabase } from "@/integrations/supabase/client";

const BUCKET = 'course-media';

/**
 * Returns the public URL for a file in the course-media bucket.
 * Uses the Supabase SDK — no manual URL construction.
 */
export function mediaUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
