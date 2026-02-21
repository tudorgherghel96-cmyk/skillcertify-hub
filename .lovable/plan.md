

# Switch Media Bucket from `all-media` to `final-correct-media`

## Overview

A single constant change propagated through 2 files, plus updating 2 regex patterns in the PWA config. No logic changes -- autoplay, scroll-snap, mute, and fallback behavior are completely untouched.

## Changes

### 1. `src/utils/mediaUtils.ts` (line 2)

Change the bucket constant:
- From: `const MEDIA_BUCKET = "all-media";`
- To: `const MEDIA_BUCKET = "final-correct-media";`

This is the single source of truth -- all `getMediaUrl()`, `getVideoUrl()`, `getPosterUrl()` calls automatically use the new bucket.

### 2. `vite.config.ts` (lines 75 and 85)

Update the two PWA runtime caching regex patterns to match the new bucket name:
- Image pattern: `all-media` to `final-correct-media`
- Video pattern: `all-media` to `final-correct-media`

### 3. Comments only (no functional change)

Update comments in `src/lib/media.ts` and `src/data/mediaMap.ts` that reference "all-media" to say "final-correct-media" for accuracy.

## What Does NOT Change

- Video autoplay logic (`VideoSlide` useEffect with `vid.play()`)
- Scroll-snap smooth scrolling (`scroll-snap-type: y mandatory`)
- 720p to 480p fallback chain
- Mute toggle, B-roll auto-advance, fourth-wall overlays
- IntersectionObserver card detection
- All card rendering and interactive components
- No database changes

