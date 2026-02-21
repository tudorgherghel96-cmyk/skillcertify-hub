const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const MEDIA_BUCKET = "final-correct-media";

/**
 * Detect connection quality and return video tier.
 */
export function getVideoQuality(): "720p" | "480p" {
  const conn = (navigator as any).connection;
  if (conn) {
    if (["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return "480p";
    if (conn.saveData) return "480p";
  }
  return "720p";
}

/**
 * Build a public URL for any file in the all-media bucket.
 */
export function getMediaUrl(filename: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${filename}`;
}

/**
 * Build video URL with quality tier.
 * Pass the base name WITHOUT quality suffix, e.g. "m1-l7-c02-teach-110v"
 */
export function getVideoUrl(baseName: string, quality?: "720p" | "480p"): string {
  const q = quality || getVideoQuality();
  return getMediaUrl(`${baseName}_${q}.mp4`);
}

/**
 * Get the poster/thumbnail .jpg for a video card.
 */
export function getPosterUrl(baseName: string): string {
  return getMediaUrl(`${baseName}.jpg`);
}

/**
 * Convert a 720p URL to its 480p fallback. Returns null if not a 720p URL.
 */
export function getFallbackUrl(url: string): string | null {
  if (url.includes("_720p.")) {
    return url.replace("_720p.", "_480p.");
  }
  return null;
}

/**
 * Extract the video base name from a URL (strip _720p.mp4 or _480p.mp4 suffix).
 */
export function getBaseNameFromUrl(url: string): string | null {
  const match = url.match(/\/([^/]+)_(?:720p|480p)\.mp4$/);
  return match ? match[1] : null;
}
