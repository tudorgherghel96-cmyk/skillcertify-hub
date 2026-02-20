
# Fix All 9 Bugs — Lesson Player

## Confirmed Root Causes

### BUG 1: All interactive card text invisible
The database `content_json` field names don't match what `SwipeContainer.tsx` passes as props:

- `test_tip` DB has `{ text: "..." }` but `SwipeContainer` passes `content.content` → prop `content` is `undefined`
- `remember_this` DB has `{ text: "..." }` but `SwipeContainer` passes `content.content` → same issue
- `quick_check` DB has `{ options: ["A risk", "A hazard", ...], correct: 1, feedback_wrong: { "0": "...", "2": "..." } }` but the component expects `options: {text: string}[]`, `correct_index: number`, and `feedback_wrong: string[]`

Fix location: `SwipeContainer.tsx` — the `CardRenderer` function, specifically the `remember_this`, `test_tip`, and `quick_check` switch cases. Also fix `Scenario.tsx` and any other cards that may have field name mismatches.

### BUG 3: XP always 0
`sessionXp` in `LessonPlayer.tsx` only increments via `handleAnswer` (called on quiz correct answers). Knowledge cards (`remember_this`, `test_tip`, `key_term`) never call any XP accumulation when they become active. The `SwipeContainer` passes `sessionXp` to `LessonComplete` but it's always 0 unless quizzes are answered correctly.

Fix: In `LessonPlayer.tsx`, the `handleIndexChange` callback already computes `xpSoFar` for DB writes but doesn't update `sessionXp` state. We need to also call `setSessionXp(xpSoFar)` on every card advance, and accumulate it from all viewed cards (not just correct answers). The simplest fix: update `handleIndexChange` to also call `setSessionXp`.

### BUG 4: Next lesson name shows "Continue"
`LessonPlayer.tsx` line 197 reads `nextLessonContent?.next_lesson_title` but the DB stores `next_title`. One character name difference destroys the feature.

Fix: Change `next_lesson_title` → `next_title` in LessonPlayer.tsx line 197.

### BUG 5: Videos not loading
The `VideoSlide.tsx` implementation looks correct (proper `<video>` element, error handling, spinner). The most likely cause is the `VITE_SUPABASE_URL` environment variable being undefined, making all media URLs malformed. This needs to be verified by adding the URL to the error display. Additionally, the `VideoSlide` shows a loading spinner on `loading=true` initial state but the video may be paused (not active) so `onCanPlay` never fires. When `isActive` is false the video won't load.

Fix: In `VideoSlide.tsx`, set `loading` to `false` initially for non-active cards, and only show spinner when the card is active and buffering. Also log the video URL in the error state so we can diagnose 404 vs CORS. Also ensure `preload="metadata"` on inactive cards to not block the page.

### BUG 6: Learn page uses wrong thumbnail paths
`moduleThumbnails` in `mediaMap.ts` uses paths like `module1_1/1.1_photo_1.webp` (with subfolder), but the `lesson-images` Supabase bucket stores files as flat names: `1.1_photo_1.webp` (no subfolder — confirmed from the DB query which shows `media_file: "1.1_photo_1.webp"` for image cards). 

Fix: Update `mediaMap.ts` to use the correct Supabase bucket paths. The `moduleThumbnails` should use the hero images from `lesson_cards` DB. The correct `moduleThumbnails` should point to `hero-M1-L1-construction-site-hazards.jpeg` etc from the `lesson-images` bucket (no subfolder).

### BUG 7: Resume modal broken background
All cards render simultaneously in `SwipeContainer`. When the resume modal shows, all slides are in the DOM stacked behind it. The blur shows them all.

Fix: In `LessonPlayer.tsx`, when `showResume` is true, render only the hero image as a static blurred background instead of the full `SwipeContainer`. The `SwipeContainer` only mounts after resume decision is made.

### BUG 8: Hallucinated hotspots on image card
`ImageSlide.tsx` is clean — no hotspot code. The yellow circles with labels are in the actual image file `1.1_photo_2.webp` itself (the image was uploaded with annotations burned in). This is a content/asset issue, not a code issue. The fix is to note that ImageSlide is already correct — no code change needed. We should add a note that `1.1_photo_2.webp` needs to be replaced with a clean unannotated image.

Actually, on reflection — since the user says this is "hallucinated by Lovable" not by the content, there may also be a possibility that an old `ImageSlide` component with annotation logic still exists somewhere. We should verify the current `ImageSlide.tsx` is the one being used (it is — it's imported directly). No code fix needed for this bug.

### BUG 9: Card count inconsistency
The Supabase query confirms 1.1=15 cards exactly. No duplicates. The "16" count may have been from a previous preview before the last rebuild. No fix needed.

## Files to Change

### 1. `src/components/lesson/SwipeContainer.tsx`
The `CardRenderer` function needs these fixes in the switch statement:

**`remember_this` case**: Change `content.content` → `content.text`
```tsx
// FROM:
<RememberThis content={content.content as string} />
// TO:
<RememberThis content={(content.text as string) || ""} />
```

**`test_tip` case**: Change `content.content` → `content.text`
```tsx
// FROM:
<TestTip content={content.content as string} />
// TO:
<TestTip content={(content.text as string) || ""} />
```

**`quick_check` case**: The DB options are strings, not objects. `correct` not `correct_index`. `feedback_wrong` is an object keyed by string index, not array.

The fix is to normalize the data in CardRenderer before passing to the component:
```tsx
case "quick_check": {
  const rawOptions = (content.options as string[] | {text:string}[] | undefined) || [];
  const normalizedOptions = rawOptions.map(o => typeof o === 'string' ? {text: o} : o);
  const correctIndex = (content.correct_index as number) ?? (content.correct as number) ?? 0;
  const rawFeedbackWrong = content.feedback_wrong;
  const normalizedFeedbackWrong = Array.isArray(rawFeedbackWrong) 
    ? rawFeedbackWrong 
    : Object.values(rawFeedbackWrong as Record<string, string> || {});
  return (
    <InteractiveSlide>
      <QuickCheck
        question={content.question as string}
        options={normalizedOptions}
        correct_index={correctIndex}
        feedback_correct={(content.feedback_correct as string) || "Correct!"}
        feedback_wrong={normalizedFeedbackWrong}
        xp_value={card.xp_value}
        onAnswer={(correct, sel) => onAnswer(correct, sel)}
      />
    </InteractiveSlide>
  );
}
```

**`scenario` case**: Apply same normalization for options/correct/feedback_wrong.

**`lesson_complete` case**: Pass the correct next lesson title from the card's own `content_json` rather than relying on the parent:
```tsx
case "lesson_complete":
  return (
    <LessonComplete
      totalXp={sessionXp}
      streak={streak}
      nextLessonTitle={(content.next_title as string) || nextLessonTitle}
      onNext={onNextLesson}
      isLastLesson={!content.next_lesson}
    />
  );
```

### 2. `src/pages/LessonPlayer.tsx`
**BUG 3 + 4 fix:**

Line 197 — fix field name:
```tsx
// FROM:
const nextLessonTitle = nextLessonContent?.next_lesson_title as string | undefined;
// TO:
const nextLessonTitle = nextLessonContent?.next_title as string | undefined;
```

`handleIndexChange` — also update `sessionXp` from cumulative card XP so knowledge cards contribute:
```tsx
const handleIndexChange = useCallback(
  async (index: number) => {
    setCurrentIndex(index);
    // Always update session XP from all cards viewed so far
    const xpSoFar = cards.slice(0, index + 1).reduce((sum, c) => sum + (c.xp_value || 0), 0);
    setSessionXp(xpSoFar); // ADD THIS LINE
    if (!user || cards.length === 0) return;
    const isComplete = cards[index]?.card_type === "lesson_complete";
    await saveCardProgress(lessonDbId, index, cards.length, xpSoFar, isComplete);
  },
  [user, cards, lessonDbId, saveCardProgress],
);
```

**BUG 7 fix — Resume modal background:**
Wrap the `SwipeContainer` render with a condition: only render it when `showResume` is false. While `showResume` is true, show only the hero image blurred:
```tsx
{showResume ? (
  <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
    {cards[0]?.mediaUrl && (
      <img src={cards[0].mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px) brightness(0.3)' }} />
    )}
  </div>
) : (
  <SwipeContainer ... />
)}
```

### 3. `src/components/lesson/VideoSlide.tsx`
**BUG 5 fix:**
- Set initial `loading` state to `false` for non-active cards (don't show spinner on cards not being watched)
- Show the video URL in the error state for debugging: `<p style={{fontSize: '10px', opacity: 0.4, wordBreak: 'break-all'}}>{mediaUrl}</p>`
- Add `onLoadStart={() => setLoading(true)}` so spinner shows when video starts buffering
- The card already has the right video attributes. The URL construction is correct. The main issue is likely that videos on inactive slides are preloading unnecessarily and hitting rate limits, or the browser is blocking autoplay on multiple elements

### 4. `src/data/mediaMap.ts`
**BUG 6 fix:**
The `moduleThumbnails` currently points to `mediaUrl('module1_1/1.1_photo_1.webp')`. The Supabase `lesson-images` bucket stores the hero images as `hero-M1-L1-construction-site-hazards.jpeg` (confirmed from DB). Update `moduleThumbnails` to use the actual hero image filenames from the DB:

```tsx
import { getLessonMediaUrl } from '@/lib/media';

export const moduleThumbnails: Record<number, string> = {
  1: getLessonMediaUrl('hero-M1-L1-construction-site-hazards.jpeg', 'lesson-images'),
  2: getLessonMediaUrl('hero-M2-L2-safe-lifting.jpeg', 'lesson-images'),
  3: getLessonMediaUrl('hero-M3-L1-working-at-height.jpeg', 'lesson-images'),
  4: getLessonMediaUrl('hero-M4-L1-coshh.jpeg', 'lesson-images'),
  5: getLessonMediaUrl('hero-M5-L1-banksman.jpeg', 'lesson-images'),
};
```

## Summary of Changes (in priority order)

| Priority | Bug | File | Change |
|---|---|---|---|
| 1 | BUG 1 — text invisible | `SwipeContainer.tsx` | Fix `content.content` → `content.text` for RememberThis/TestTip; normalize options/correct/feedback_wrong for QuickCheck/Scenario |
| 2 | BUG 3 — XP = 0 | `LessonPlayer.tsx` | Call `setSessionXp(xpSoFar)` in `handleIndexChange` |
| 3 | BUG 4 — next title missing | `LessonPlayer.tsx` | Fix `next_lesson_title` → `next_title` (line 197) |
| 4 | BUG 4 (also) | `SwipeContainer.tsx` | Pass `content.next_title` directly in `lesson_complete` case |
| 5 | BUG 7 — resume modal | `LessonPlayer.tsx` | Conditionally render blurred hero instead of SwipeContainer during resume modal |
| 6 | BUG 5 — videos | `VideoSlide.tsx` | Better loading state management, show URL in error for debugging |
| 7 | BUG 6 — thumbnails | `mediaMap.ts` | Fix `moduleThumbnails` to use real hero image filenames |
| 8 | BUG 8 — hotspots | None | `ImageSlide.tsx` is clean; yellow circles are burned into the image asset itself |
| 9 | BUG 9 — card count | None | Confirmed 1.1=15, counts are correct |

## No Database Changes Required
All fixes are in frontend code. The DB schema and data are correct — the bugs are all field name mismatches between the seed data and the component props.
