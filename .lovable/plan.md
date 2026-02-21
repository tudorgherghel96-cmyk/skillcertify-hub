

# Media Migration to `all-media` Bucket

## Overview

Migrate all media references from the old `lesson-images` and `lesson-videos` buckets to the new unified `all-media` bucket containing 282 re-encoded files with adaptive quality (720p/480p video pairs with .jpg posters). This must preserve video autoplay, smooth scroll-snap scrolling, and all existing UX behaviors.

## What Changes

### 1. New media utility (`src/utils/mediaUtils.ts`)

A single source of truth for building media URLs from the `all-media` bucket:
- `getMediaUrl(filename)` -- builds a public URL for any file
- `getVideoUrl(baseName, quality?)` -- appends `_720p.mp4` or `_480p.mp4` based on connection quality
- `getPosterUrl(baseName)` -- appends `.jpg` for poster/thumbnail
- `getFallbackUrl(url)` -- converts a 720p URL to 480p for error fallback
- `getVideoQuality()` -- reads `navigator.connection` to pick 720p vs 480p

### 2. Update `src/lib/media.ts` -- Redirect to `all-media` bucket

- `getLessonMediaUrl(file, bucket)`: Instead of constructing URLs from `lesson-images`/`lesson-videos`, route everything through `all-media`. For video files (`.mp4`), strip the extension, lowercase, and construct the quality-aware URL. For images, just lowercase the filename and point at `all-media`.
- `mediaUrl(path)`: Point at `all-media` bucket instead of `lesson-images`
- `getLessonVideoUrl(lessonId)`: This is only used by `WelcomeVideo` and `SlideRenderer`/`LessonMedia`. Since there's no welcome video in the new bucket, keep legacy behavior for `welcome` and update the rest.

### 3. Update `VideoSlide.tsx` -- Add 720p/480p fallback with poster

Currently the video `src` comes from `card.mediaUrl`. The enrichment in `LessonPlayer.tsx` calls `getLessonMediaUrl(media_file, media_bucket)` which will now return a 720p URL from `all-media`.

Add fallback logic: if the 720p video errors, try 480p. If both fail, show the poster image (same base name + `.jpg`). This happens inside `VideoSlide` since it already has error handling.

Key constraint: **autoplay must still work**. The current `useEffect` that calls `vid.play()` when `isActive` changes will remain untouched. Only the `onError` handler changes to attempt the 480p fallback before showing the error state.

### 4. Update `BRollSlide.tsx` -- Same 720p/480p fallback

Add the same fallback pattern. B-roll videos auto-advance on end, so the `onEnded` callback stays intact.

### 5. Update `LessonPlayer.tsx` -- Enrichment logic

The `getLessonMediaUrl` call already handles the mapping. The DB stores `media_file: "M1-L7-C02-teach-110v.mp4"` and `media_bucket: "lesson-videos"`. The updated `getLessonMediaUrl` will:
1. Detect video files by extension
2. Strip `.mp4`, lowercase the base name
3. Return quality-aware URL from `all-media`

For image files (`media_bucket: "lesson-images"`), it lowercases and serves from `all-media`.

### 6. Update `src/data/mediaMap.ts` -- Point at `all-media`

- `mediaUrl()` already calls `lib/media.ts` which will be updated
- `moduleThumbnails`: The hero images now exist as lowercase in `all-media` (e.g., `hero-m1-l1-construction-site-hazards.jpeg`). Update the filenames to lowercase and bucket to `all-media`.

### 7. Update `vite.config.ts` -- PWA caching rules

Replace `course-media` URL patterns with `all-media`:
- Images: match `/all-media/.*\.(webp|png|jpg|jpeg)$/i`
- Videos: match `/all-media/.*\.(mp4|webm)$/i`

### 8. Update `src/lib/offlineStorage.ts`

Cache name stays the same (it's just a string key). No functional change needed since the URLs will change automatically via the media utilities.

### 9. Update `DownloadTopicButton.tsx`

Currently gathers URLs via `lessonMedia` images + `getLessonVideoUrl()`. These will automatically resolve to `all-media` after the media utility updates. No direct changes needed.

### 10. Update `WelcomeVideo.tsx`

No welcome video exists in `all-media`. Keep `getLessonVideoUrl("welcome")` pointing at the old `lesson-videos` bucket as a special case, or hide the component if the video 404s (it already does this via `onError`).

---

## What Does NOT Change (Preserving Existing UX)

- **Scroll-snap behavior**: `SwipeContainer` CSS (`scroll-snap-type: y mandatory`, `WebkitOverflowScrolling: touch`) is untouched
- **Video autoplay**: `VideoSlide`'s `useEffect` that calls `vid.play()` on `isActive` stays the same
- **B-roll auto-advance**: `BRollSlide`'s `onEnded` callback stays intact
- **Mute toggle**: Global mute state passed through `SwipeContainer` is unchanged
- **IntersectionObserver**: Card detection logic in `SwipeContainer` is unchanged
- **Fourth-wall overlays**: `LeanInCallout` and `HoldUpCard` in `VideoSlide` remain
- **Interactive cards**: All quiz, drag-drop, tap-to-reveal cards have no media changes

---

## Technical Details

### DB filename to `all-media` mapping

The `lesson_cards` table stores:
- Videos: `media_file = "M1-L7-C02-teach-110v.mp4"`, `media_bucket = "lesson-videos"`
- Images: `media_file = "1.7_photo_1.webp"`, `media_bucket = "lesson-images"`
- Heroes: `media_file = "hero-M1-L7-electrical-fire-ppe.jpeg"`, `media_bucket = "lesson-images"`

The `all-media` bucket has:
- Videos: `m1-l7-c02-teach-110v_720p.mp4`, `m1-l7-c02-teach-110v_480p.mp4`, `m1-l7-c02-teach-110v.jpg`
- Images: `1.1_photo_1.webp` (same name, already lowercase)
- Heroes: `hero-m1-l1-construction-site-hazards.jpeg` (lowercase)

Mapping rule in `getLessonMediaUrl`:
- If bucket is `lesson-videos`: strip `.mp4`, lowercase, append `_720p.mp4` (or `_480p.mp4` based on quality)
- If bucket is `lesson-images`: lowercase the filename, serve from `all-media`

### Special case: `m1-l7-c05-lean-in-co2.mp4`

This file has `.mp4` embedded in its base name. The DB stores `M1-L7-C05-lean-in-co2.mp4`. When we strip `.mp4` and lowercase, we get `m1-l7-c05-lean-in-co2` -- but the actual files are `m1-l7-c05-lean-in-co2.mp4_720p.mp4`. So the stripping logic must only strip a trailing `.mp4`, not embedded ones. Since the DB value ends in `.mp4` and the actual base name also ends in `.mp4`, we need to be careful: strip only the extension, and the base name `m1-l7-c05-lean-in-co2.mp4` is correct as-is for lookup.

### Video preloading

Add lightweight preloading: when a video card becomes active, fetch the next video card's 720p URL in the background using the Cache API. This is additive and doesn't affect scrolling.

### Files Modified

1. **NEW**: `src/utils/mediaUtils.ts` -- media URL builder with quality detection
2. `src/lib/media.ts` -- redirect all URLs to `all-media` bucket
3. `src/components/lesson/VideoSlide.tsx` -- add 720p to 480p fallback on error
4. `src/components/lesson/BRollSlide.tsx` -- add 720p to 480p fallback on error
5. `src/data/mediaMap.ts` -- lowercase hero filenames for `moduleThumbnails`
6. `vite.config.ts` -- update PWA cache URL patterns to match `all-media`
7. `src/lib/offlineStorage.ts` -- minor: update cache name constant if needed

### No DB Changes Required

All mapping is handled in frontend code. The `lesson_cards` table data stays the same.
