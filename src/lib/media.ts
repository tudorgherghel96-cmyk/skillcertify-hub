import { supabase } from "@/integrations/supabase/client";

const BUCKET = 'course-media';

/**
 * Returns the public URL for a file in the course-media bucket.
 */
export function mediaUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Auto-resolve video URL based on lessonId (e.g. "2.1" → videos/2.1_video_web.mp4)
 */
export function getLessonVideoUrl(lessonId: string): string {
  const filename = lessonId === "welcome"
    ? "welcome_video_1_web.mp4"
    : `${lessonId}_video_web.mp4`;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`videos/${filename}`);
  return data.publicUrl;
}
