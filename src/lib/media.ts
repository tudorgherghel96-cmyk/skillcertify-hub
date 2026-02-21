import { getMediaUrl, getVideoUrl, getVideoQuality } from "@/utils/mediaUtils";

/**
 * Returns the public URL for a lesson card media file.
 * All media lives in the unified `final-correct-media` bucket.
 *
 * For videos (.mp4 files): strips trailing .mp4, lowercases,
 * and returns quality-aware URL (720p or 480p).
 * For images: lowercases and serves from final-correct-media.
 */
export function getLessonMediaUrl(
  file: string | null,
  bucket: string | null,
): string {
  if (!file || !bucket) return "";

  // Detect video by file extension
  if (file.toLowerCase().endsWith(".mp4")) {
    const baseName = file.slice(0, -4).toLowerCase();
    return getVideoUrl(baseName, getVideoQuality());
  }

  // Images: lowercase and serve from final-correct-media
  return getMediaUrl(file.toLowerCase());
}

/**
 * Legacy helper — points at final-correct-media bucket.
 * Paths like "module1_1/1.1_photo_1.webp" → just use the filename part lowercased.
 */
export function mediaUrl(path: string): string {
  const filename = path.includes("/") ? path.split("/").pop()! : path;
  return getMediaUrl(filename.toLowerCase());
}

/**
 * Legacy video helper — kept for WelcomeVideo backward compat.
 */
export function getLessonVideoUrl(lessonId: string): string {
  if (lessonId === "welcome") {
    return getVideoUrl("welcome_video_1_web", getVideoQuality());
  }
  return getVideoUrl(`${lessonId}_video_web`.toLowerCase(), getVideoQuality());
}
