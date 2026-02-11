const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET = 'course-media';

export function mediaUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

// Usage: mediaUrl('module1/1.1_photo_1.jpeg')
