
# Fix Plan: Lesson Player Issues

## Issues Identified from Screenshots

### 1. Quiz: Correct answer always falls on "B"
The database stores all quiz questions with `correct: "b"`. The question order is shuffled, but the **options within each question are not shuffled**. This means the correct answer is always in the same position (B).

**Fix:** In `LessonQuiz.tsx`, shuffle each question's options array when initializing, and update the `correct` field to point to the new position of the correct option.

### 2. Quiz: Remove "Confirm Answer" button -- single tap to answer
Currently the user must tap an option, then tap "Confirm Answer". The user wants a single tap: selecting an option immediately locks it in and shows feedback.

**Fix:** In `LessonQuiz.tsx`, remove the two-step flow. When the user taps an option, immediately set `confirmed = true` and record the answer. Show the "Next Question" button right away.

### 3. Quiz results: Remove "Continue" button
The quiz results screen (card 18/19) shows a "Continue" button, but the user still needs to scroll down to the LessonComplete trophy page (card 19). The Continue button is redundant and confusing.

**Fix:** In `LessonQuiz.tsx` results screen, remove the "Continue" button. Instead, auto-save the result when quiz is passed, and show a "Swipe up to continue" hint so the user scrolls to the LessonComplete card naturally.

### 4. Confetti appears on video cards (should only show at lesson end)
The `Confetti` component in `LessonComplete.tsx` uses `position: fixed`, which means the confetti particles render over the entire screen and remain visible when the user scrolls back to other cards.

**Fix:** In `LessonComplete.tsx`, change confetti from `position: fixed` to `position: absolute` so it stays scoped within the LessonComplete card only.

### 5. Image captions containing "TEST TIP:" should be split
Multiple image cards (across many lessons) have captions like: "Waste and buried services are hidden hazards. TEST TIP: The exam tests whether you can identify BOTH visible and hidden hazards." The TEST TIP portion should be displayed as a distinct, styled callout rather than as part of the plain caption text.

**Fix:** In `ImageSlide.tsx`, detect "TEST TIP:" in the caption string. Render the part before it as the normal caption, and the part after it in a styled amber test-tip box (matching the existing TestTip design language).

### 6. Hero slide: Module pills cut off by nav header
The "Module 1 of 5" and "~4 min" pills at the top of the hero image are positioned at `top: 100px`, which gets partially hidden behind the fixed nav header. Also, `durationLabel` is not being passed because the DB field is `duration` but the code looks for `duration_label`.

**Fix:** In `HeroSlide.tsx`, increase the pill `top` offset to prevent clipping. In `SwipeContainer.tsx`, also pass `content.duration` as fallback for `durationLabel`.

### 7. "Can you spot the hazards?" image card needs options (Content issue)
Card 7 is stored as an `image` type in the database with no options. The user wants selectable options below the image. This requires either changing the card type in the database or enhancing the ImageSlide to support optional quiz-like options.

**Fix (code-side):** This is primarily a content/database issue. I will note this as a follow-up item -- the card type in the database needs to be changed from `image` to `scenario` or `quick_check` with proper options and correct answer fields.

### 8. Card 11 shows wrong photo (Content issue)
The image for "Multiple hazards in one scene" shows paint cans instead of a completed risk assessment form. This is a media asset mapping issue in the database.

**Fix:** This is a content issue -- the correct image file needs to be uploaded and the database `media_file` field updated. Not a code fix.

---

## Technical Details

### Files to modify:

**`src/components/lesson/cards/LessonQuiz.tsx`**
- Add option shuffling: when initializing questions state, shuffle each question's `options` array and update `correct` to match the new position of the correct option
- Remove the Confirm button: when user taps an option, immediately call `setConfirmed(true)` and record the answer
- Results screen: remove the "Continue" button, auto-save result on mount of results screen if passed, add "Swipe up" hint instead

**`src/components/lesson/cards/LessonComplete.tsx`**
- Change `Confetti` particles from `position: "fixed"` to `position: "absolute"` so they stay within the LessonComplete card bounds

**`src/components/lesson/ImageSlide.tsx`**
- Parse caption for "TEST TIP:" substring
- Render the main caption normally and the test tip portion in a styled amber callout box below the caption

**`src/components/lesson/HeroSlide.tsx`**
- Increase the module/duration pill `top` offset from 100 to ~120 to clear the nav header on all devices

**`src/components/lesson/SwipeContainer.tsx`**
- Fix durationLabel prop: pass `(content.duration_label || content.duration) as string` as fallback

### Content/data follow-ups (not code fixes):
- Card 7 (lesson 1.1): Needs to be changed from `image` type to `scenario` or `quick_check` with options added to `content_json`
- Card 11 (lesson 1.1): Needs correct media file (completed risk assessment form image)
