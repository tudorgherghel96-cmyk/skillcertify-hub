const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

/**
 * Build a public URL for any file in a specific bucket.
 */
function bucketUrl(bucket: string, filename: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
}

/**
 * Returns the public URL for a lesson card media file.
 * Routes media to their ORIGINAL buckets (lesson-videos, lesson-images).
 *
 * For videos (bucket = "lesson-videos"): serves the file directly from lesson-videos.
 * For images (bucket = "lesson-images"): serves the file directly from lesson-images.
 */
export function getLessonMediaUrl(
  file: string | null,
  bucket: string | null,
): string {
  if (!file || !bucket) return "";

  // Use the original bucket directly — files live in their original buckets
  return bucketUrl(bucket, file);
}

/**
 * Legacy helper — images from lesson-images bucket.
 * Paths like "module1_1/1.1_photo_1.webp" → just use the filename part.
 */
export function mediaUrl(path: string): string {
  const filename = path.includes("/") ? path.split("/").pop()! : path;
  return bucketUrl("lesson-images", filename);
}

/**
 * Legacy video helper — kept for WelcomeVideo backward compat.
 */
export function getLessonVideoUrl(lessonId: string): string {
  if (lessonId === "welcome") {
    return bucketUrl("lesson-videos", "welcome_video_1_web.mp4");
  }
  return bucketUrl("lesson-videos", `${lessonId}_video_web.mp4`);
}
