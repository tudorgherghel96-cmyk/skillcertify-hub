import { getMediaUrl, getVideoUrl, getVideoQuality } from "@/utils/mediaUtils";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

/**
 * Returns the public URL for a lesson card media file.
 * Routes everything through the unified `final-correct-media` bucket.
 *
 * For videos (bucket = "lesson-videos"): strips trailing .mp4, lowercases,
 * and returns quality-aware URL (720p or 480p).
 * For images (bucket = "lesson-images"): lowercases and serves from final-correct-media.
 */
export function getLessonMediaUrl(
  file: string | null,
  bucket: string | null,
): string {
  if (!file || !bucket) return "";

  if (bucket === "lesson-videos") {
    // Strip only the trailing .mp4 extension, preserve embedded .mp4 in base name
    const baseName = file.endsWith(".mp4")
      ? file.slice(0, -4).toLowerCase()
      : file.toLowerCase();
    return getVideoUrl(baseName, getVideoQuality());
  }

  // Images: lowercase and serve from final-correct-media
  return getMediaUrl(file.toLowerCase());
}

/**
 * Legacy helper — points at final-correct-media bucket now.
 * Paths like "module1_1/1.1_photo_1.webp" → just use the filename part lowercased.
 */
export function mediaUrl(path: string): string {
  // Legacy paths include folder prefixes like "module1_1/". Strip them.
  const filename = path.includes("/") ? path.split("/").pop()! : path;
  return getMediaUrl(filename.toLowerCase());
}

/**
 * Legacy video helper — kept for WelcomeVideo backward compat.
 * "welcome" still points at old lesson-videos bucket; everything else goes through all-media.
 */
export function getLessonVideoUrl(lessonId: string): string {
  if (lessonId === "welcome") {
    return `${SUPABASE_URL}/storage/v1/object/public/lesson-videos/welcome_video_1_web.mp4`;
  }
  const baseName = `${lessonId}_video_web`.toLowerCase();
  return getVideoUrl(baseName, getVideoQuality());
}
