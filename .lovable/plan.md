
# Complete Lesson Player Rebuild — TikTok-Style Vertical Snap Scroll

## What's Being Deleted

All existing lesson player files will be replaced:
- `src/pages/LessonPlayer.tsx` — rewritten from scratch
- `src/components/LessonSwipeView.tsx` — deleted, replaced by new architecture
- All `src/components/cards/*.tsx` — deleted, replaced with new `src/components/lesson/` hierarchy

## New File Structure

```text
src/pages/LessonPlayer.tsx                          (main page, data loading, exit modal)

src/components/lesson/
  SwipeContainer.tsx                                (CSS scroll-snap engine, IntersectionObserver)
  VideoSlide.tsx                                    (video cards with mute/fourth-wall overlays)
  HeroSlide.tsx                                     (first card, cover image)
  ImageSlide.tsx                                    (supplementary image cards)
  BRollSlide.tsx                                    (auto-advance b-roll)
  InteractiveSlide.tsx                              (dark wrapper for all interactive cards)
  cards/
    QuickCheck.tsx
    DragDrop.tsx
    TapToReveal.tsx
    SplitScreen.tsx
    MultiSelect.tsx
    SpeedDrill.tsx
    Scenario.tsx
    PatternCard.tsx
    RememberThis.tsx
    TestTip.tsx
    KeyTerm.tsx
    LessonComplete.tsx
  overlays/
    LeanInCallout.tsx
    HoldUpCard.tsx
  ui/
    ProgressBar.tsx
    NavHeader.tsx
    MuteToggle.tsx
```

## The Core Engine: SwipeContainer.tsx

The fundamental change is replacing the framer-motion/use-gesture drag system with **native CSS scroll-snap**. This is the exact same mechanism TikTok uses and is fully GPU-accelerated on iOS/Android.

```text
Container styles (critical):
  height: 100dvh
  overflow-y: scroll
  overflow-x: hidden
  scroll-snap-type: y mandatory
  -webkit-overflow-scrolling: touch
  overscroll-behavior: none

Each slide:
  height: 100dvh
  scroll-snap-align: start
  scroll-snap-stop: always
  overflow: hidden
```

**Active card detection**: An `IntersectionObserver` with `threshold: 0.5` watches each slide. When a slide is >50% visible, it becomes "active" — its video plays. When it scrolls away, the video pauses. This is the correct approach (no polling, no scroll events).

**Resume**: On load, if `cards_completed > 0`, the container uses `scrollTo({ top: savedIndex * window.innerHeight, behavior: 'instant' })` after the DOM renders.

**Progress saving**: On every `IntersectionObserver` callback (card becomes active), upsert `user_lesson_progress` with the new `cards_completed` value.

## Data Flow

`LessonPlayer.tsx` owns:
- Fetching `lesson_cards` from Supabase
- Fetching saved progress from `user_lesson_progress`
- Mute state (single `useState` shared down via props)
- Session XP total
- Streak data
- Exit modal (leave lesson confirmation)
- Calling `useXpProgress` hooks (unchanged — this hook works perfectly)
- Calling `useProgress`, `useGamification`, `useTelemetry` on lesson completion

`SwipeContainer.tsx` owns:
- The scroll DOM element
- IntersectionObserver lifecycle
- Notifying parent of current index changes
- Triggering progress save on index change

## What Stays Untouched

- `src/hooks/useXpProgress.ts` — all DB write logic is preserved exactly
- `src/contexts/` — all contexts unchanged  
- `src/integrations/supabase/` — unchanged
- `src/lib/media.ts` — `getLessonMediaUrl()` still used for URL construction
- `App.tsx` — routes unchanged, still renders `<LessonPlayer />`
- `src/components/layout/BottomNav.tsx` — already has the `/lesson/` hide logic from the previous fix

## Interactive Cards — Key Decisions

All interactive cards are rebuilt in `src/components/lesson/cards/` with the exact styling from the spec:

- **QuickCheck**: Dark glassmorphism options (`rgba(255,255,255,0.06)`), min-height 60px, green/red feedback with XP badge float animation using CSS keyframes (not framer-motion)
- **DragDrop**: Touch-based drag using `touchstart/touchmove/touchend`, `touch-action: none`, floating copy follows finger. NOT the HTML5 drag API.
- **TapToReveal**: 2x2 grid, CSS 3D flip with `perspective: 1000px`, `backface-visibility: hidden`
- **SpeedDrill**: SVG circular countdown, 2×2 grid of answer buttons
- **LessonComplete**: CSS confetti particles (keyframe animation, ~60 coloured divs positioned randomly), animated XP counter using `requestAnimationFrame`

## Fourth-Wall Effects

These are implemented as overlay components rendered inside `VideoSlide.tsx`:

- **lean_in**: `LeanInCallout.tsx` — listens to `onTimeUpdate` prop, fades in at `currentTime >= 2`
- **hold_up**: `HoldUpCard.tsx` — fades in at `currentTime >= 1.5`
- **point_down**: Implemented differently with scroll-snap — when `currentTime > duration - 2`, a sticky overlay div at the bottom of the video slide shows "80px peek" of the next card's top visually. This is simpler than trying to override scroll-snap.

## Video Rules (Strict)

- `playsInline`, `muted` (initially), `preload="auto"` on all `<video>` elements
- `controls` attribute omitted (no browser chrome)
- `objectFit: 'contain'` (not cover) — shows full 9:16 frame with black bars
- Videos **do not auto-advance** when ended — user must swipe (except BRoll which auto-advances after 1 second)
- Mute state is a single boolean lifted to `LessonPlayer.tsx`, passed down to all `VideoSlide`/`BRollSlide`

## Styling Baseline

Every card lives on a `#000` or `#0a0a0f` background. Colours:
- Gold `#f59e0b` — XP, primary accents
- Green `#10b981` — correct answers
- Red `#ef4444` — wrong answers  
- Blue `#3b82f6` — info/remember-this
- Purple `#a855f7` — test tips

Font: system stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

All touch targets minimum 44×44px.

## Files to Delete

- `src/components/LessonSwipeView.tsx`
- `src/components/cards/VideoCard.tsx`
- `src/components/cards/BRollCard.tsx`
- `src/components/cards/HeroImageCard.tsx`
- `src/components/cards/ImageCard.tsx`
- `src/components/cards/QuickCheckCard.tsx`
- `src/components/cards/RememberThisCard.tsx`
- `src/components/cards/TestTipCard.tsx`
- `src/components/cards/KeyTermCard.tsx`
- `src/components/cards/DragDropCard.tsx`
- `src/components/cards/TapToRevealCard.tsx`
- `src/components/cards/SplitScreenCard.tsx`
- `src/components/cards/ScenarioCard.tsx`
- `src/components/cards/MultiSelectCard.tsx`
- `src/components/cards/SpeedDrillCard.tsx`
- `src/components/cards/PatternCard.tsx`
- `src/components/cards/LessonCompleteCard.tsx`
- `src/components/cards/shared/XpBadge.tsx`
- `src/components/cards/shared/SwipeHint.tsx`

## Files to Create (24 new files)

1. `src/pages/LessonPlayer.tsx`
2. `src/components/lesson/SwipeContainer.tsx`
3. `src/components/lesson/VideoSlide.tsx`
4. `src/components/lesson/HeroSlide.tsx`
5. `src/components/lesson/ImageSlide.tsx`
6. `src/components/lesson/BRollSlide.tsx`
7. `src/components/lesson/InteractiveSlide.tsx`
8. `src/components/lesson/cards/QuickCheck.tsx`
9. `src/components/lesson/cards/DragDrop.tsx`
10. `src/components/lesson/cards/TapToReveal.tsx`
11. `src/components/lesson/cards/SplitScreen.tsx`
12. `src/components/lesson/cards/MultiSelect.tsx`
13. `src/components/lesson/cards/SpeedDrill.tsx`
14. `src/components/lesson/cards/Scenario.tsx`
15. `src/components/lesson/cards/PatternCard.tsx`
16. `src/components/lesson/cards/RememberThis.tsx`
17. `src/components/lesson/cards/TestTip.tsx`
18. `src/components/lesson/cards/KeyTerm.tsx`
19. `src/components/lesson/cards/LessonComplete.tsx`
20. `src/components/lesson/overlays/LeanInCallout.tsx`
21. `src/components/lesson/overlays/HoldUpCard.tsx`
22. `src/components/lesson/ui/ProgressBar.tsx`
23. `src/components/lesson/ui/NavHeader.tsx`
24. `src/components/lesson/ui/MuteToggle.tsx`

## Preserved Integrations (nothing changes in these)

- `useXpProgress` hook — called identically from the new `LessonPlayer.tsx`
- Supabase queries — same tables, same upsert patterns
- Route `/lesson/:moduleId/:lessonId` — unchanged in `App.tsx`
- `BottomNav` hide-on-lesson logic — already works
- `useProgress`, `useGamification`, `useTelemetry` contexts — called on lesson complete exactly as before

## No Database Changes Required

All existing tables (`lesson_cards`, `user_lesson_progress`, `progress`, `streaks`) are used exactly as-is. No migrations needed.
