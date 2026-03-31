

# 4 UX Improvements to the Lesson/Slide Viewer

## 1. Scroll Indicator (Bobbing Arrow)

**File: `src/components/lesson/SwipeContainer.tsx`**

Add a floating down-arrow indicator at the bottom of each slide. It will:
- Be absolutely positioned at the bottom-center of the swipe container
- Use a CSS `@keyframes bob` animation (translateY 0→8px loop)
- Hide when `currentIndex === cards.length - 1` (last slide)
- Hide on `lesson_complete` and `quiz_card` card types
- Semi-transparent white chevron (▼ or ChevronDown icon) with subtle glow

## 2. Sound Button — Move Higher

**File: `src/components/lesson/VideoSlide.tsx`**

Move the mute toggle from `bottom: 16, right: 16` to `top: 16, right: 16` — near the top of the video frame. This makes it more visible and accessible, matching the "tap for sound" button position. Also increase size slightly (44px) and improve default opacity from 0.6 to 0.8.

## 3. Video End State Overlay

**File: `src/components/lesson/VideoSlide.tsx`**

Add an `ended` state. When the `<video>` fires `onEnded`:
- Show a centered replay icon overlay (↻) with "Video complete — tap to replay" text
- Tapping it resets `currentTime = 0` and replays
- Semi-transparent dark backdrop so it's clear the video has stopped

## 4. Progress Tracking Bug — Off-by-One

**File: `src/pages/LessonPlayer.tsx`** (line 251-253)

The bug: `saveCardProgress` stores `cards_completed = cardIndex + 1`. On restore, `savedIdx = progressData.cards_completed` is used directly as the resume index — but it's already +1, so the user lands one card ahead.

Fix: Change line 253 from `setResumeCardIndex(savedIdx)` to `setResumeCardIndex(savedIdx - 1)` so the user resumes on the exact card they last viewed.

---

## Technical Summary

| Change | File | What |
|--------|------|------|
| Scroll indicator | SwipeContainer.tsx | Add bobbing ▼ arrow, hide on last slide |
| Sound button | VideoSlide.tsx | Move mute toggle to top-right |
| Video end state | VideoSlide.tsx | Add `ended` state with replay overlay |
| Resume bug | LessonPlayer.tsx | `savedIdx - 1` instead of `savedIdx` |

