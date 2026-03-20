

# Fix: Card 18 Image Not Loading

## Problem
The `getLessonMediaUrl` function returns `""` when `media_bucket` is `null`, even for local assets (paths starting with `/`). The new card 18 was inserted with `media_file = '/images/buried-waste-hazard.webp'` but no `media_bucket`, so the early guard `if (!file || !bucket) return ""` prevents the local path from being returned.

## Fix

### Option A (code fix — recommended)
In `src/lib/media.ts`, move the local path check before the null-bucket guard:

```ts
export function getLessonMediaUrl(file: string | null, bucket: string | null): string {
  if (!file) return "";
  if (file.startsWith("/")) return file; // local public asset
  if (!bucket) return "";
  // ... rest unchanged
}
```

This fixes this card and all future local assets. No database change needed.

### Technical Detail
One line reorder in `src/lib/media.ts` — move the `/` prefix check above the `!bucket` guard.

