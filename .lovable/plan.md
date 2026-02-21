

# Fix Broken Lesson Buttons and Trophy Icon

## Problem 1: Interactive Buttons Not Working (Quiz Answers, Next Lesson)

**Root cause**: In `LessonPlayer.tsx`, the content area has `paddingTop: calc(55px + safe-area-inset-top)` with `overflow: hidden`. But the `SwipeContainer` inside uses `height: 100dvh` for both the container and each slide. This means each slide extends ~55px below the visible screen area, and the parent clips it. Any buttons near the bottom of a slide are invisible and untappable.

**Fix**: Change the SwipeContainer and slide heights from `100dvh` to `100%`, so they correctly fill only the available space after the nav header.

### Files to change:

**`src/components/lesson/SwipeContainer.tsx`**
- Change container `height: "100dvh"` to `height: "100%"`
- Change each slide `height: "100dvh"` to `height: "100%"`
- Update `scrollTo` calculations to use `container.clientHeight` instead of `window.innerHeight`

**`src/components/lesson/cards/LessonComplete.tsx`**
- Add `e.stopPropagation()` on the Next button click to prevent scroll container from intercepting touch events

**`src/components/lesson/cards/QuickCheck.tsx`**
- Add `e.stopPropagation()` on option button clicks

**`src/components/lesson/cards/Scenario.tsx`**
- Add `e.stopPropagation()` on option button clicks

---

## Problem 2: Trophy with SkillCertify Icon

Replace the emoji trophy/graduation cap on the LessonComplete screen with an inline SVG of the SkillCertify shield+checkmark+graduation cap logo, rendered in gold/gradient colors.

### File to change:

**`src/components/lesson/cards/LessonComplete.tsx`**
- Replace `{isLastLesson ? "graduation cap emoji" : "trophy emoji"}` with an SVG component based on the SkillCertify logo (shield with graduation cap and checkmark)
- Style with a gold gradient fill to match the achievement theme

---

## Summary of Changes

| File | Change |
|------|--------|
| `SwipeContainer.tsx` | Fix height from `100dvh` to `100%`, use `clientHeight` for scroll calculations |
| `LessonComplete.tsx` | Add `e.stopPropagation()` on button, replace emoji with SkillCertify SVG icon |
| `QuickCheck.tsx` | Add `e.stopPropagation()` on answer buttons |
| `Scenario.tsx` | Add `e.stopPropagation()` on answer buttons |

