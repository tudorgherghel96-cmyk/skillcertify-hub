import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

/**
 * Returns the public URL for a lesson card media file.
 * Only two buckets: "lesson-videos" (mp4) and "lesson-images" (jpeg/webp).
 */
export function getLessonMediaUrl(
  file: string | null,
  bucket: string | null,
): string {
  if (!file || !bucket) return "";
  // Direct URL construction — avoids a round-trip SDK call
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${file}`;
}

/**
 * Legacy helper — kept for backward compat. Points at lesson-images bucket.
 */
export function mediaUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/lesson-images/${path}`;
}

/**
 * Legacy video helper — kept for backward compat.
 */
export function getLessonVideoUrl(lessonId: string): string {
  const filename = lessonId === "welcome"
    ? "welcome_video_1_web.mp4"
    : `${lessonId}_video_web.mp4`;
  return `${SUPABASE_URL}/storage/v1/object/public/lesson-videos/${filename}`;
}
