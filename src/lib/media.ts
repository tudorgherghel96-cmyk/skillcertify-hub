/**
 * Returns a public URL for a media asset stored in /public/media/.
 * Usage: mediaUrl('module1/1.1_photo_1.jpeg')
 */
export function mediaUrl(path: string): string {
  return `/media/${path}`;
}
