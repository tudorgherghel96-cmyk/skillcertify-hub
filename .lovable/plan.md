

# Fix: Lesson Navigation Stuck + Videos Not Loading

## Problems Found

### Bug 1: Gesture fires in BOTH directions simultaneously
In `LessonFlow.tsx` line 78-79, the velocity check `vy > 0.3` has no direction guard:

```text
if (sy === -1 || my < -80 || vy > 0.3) go(1);   // next
if (sy ===  1 || my >  80 || vy > 0.3) go(-1);   // prev
```

`vy` (velocity) is always a positive number. So when velocity exceeds 0.3, **both** `go(1)` and `go(-1)` fire on the same gesture -- the slide jumps forward then immediately back, making it look stuck.

Additionally, the handler fires on **every drag frame** (not just when the gesture ends), which can cause repeated triggers mid-drag.

### Bug 2: Videos fail silently, showing "Video coming soon"
The video slide tries to load from Supabase Storage (e.g. `videos/1.1_video_web.mp4`). If those files haven't been uploaded yet, the `<video>` element fires `onError`, which shows a blank "Video coming soon" placeholder. The user sees an empty slide and thinks navigation is broken.

---

## Fixes

### 1. Fix gesture handler (LessonFlow.tsx)

- Only process the gesture on the **final** frame (`last === true`)
- Use the **direction** value `dy` from `@use-gesture/react` to determine swipe direction, rather than checking velocity without direction
- Keep `swipe` detection as the primary trigger (`sy`), with `movement`/`velocity` as secondary fallback that respects direction

```text
Before:  vy > 0.3 triggers BOTH next and prev
After:   vy > 0.3 triggers next only when dy < 0 (upward), prev only when dy > 0 (downward)
         Handler only fires on last: true
```

### 2. Auto-skip missing video slides (SlideRenderer.tsx)

- When a video fails to load, instead of showing a dead "Video coming soon" screen, automatically signal to skip (or show a brief message then allow swiping through)
- Better approach: make the video error state not block navigation -- show a compact fallback with the lesson title and a "Swipe to continue" hint

### 3. Prevent video slide from blocking the flow (buildSlidesFromI18n)

- As an optional safety measure, only insert video slides when video files are known to exist (or keep them but make the fallback non-blocking, which is the simpler fix)

---

## Technical Details

### File: `src/components/lesson/LessonFlow.tsx`

Replace the `useDrag` handler (lines 76-87) with:

```typescript
const bind = useDrag(
  ({ last, swipe: [, sy], movement: [, my], velocity: [, vy], direction: [, dy] }) => {
    if (!last) return; // only act on gesture end
    if (sy === -1) return go(1);
    if (sy ===  1) return go(-1);
    // fallback: large movement or fast velocity WITH correct direction
    if ((Math.abs(my) > 80 || vy > 0.3) && dy !== 0) {
      dy < 0 ? go(1) : go(-1);
    }
  },
  {
    axis: "y",
    filterTaps: true,
    threshold: 10,
    swipe: { distance: 80, velocity: 0.3 },
  }
);
```

### File: `src/components/lesson/SlideRenderer.tsx`

Update the `VideoSlide` error state (lines 103-113) to show a non-blocking fallback with a swipe hint instead of a dead end.

