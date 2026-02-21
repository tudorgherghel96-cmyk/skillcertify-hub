

# Fix iPhone Status Bar Overlap

## Problem

On iPhone (especially with notch/Dynamic Island), the TopNav header overlaps with the iOS status bar. The app uses `viewport-fit=cover` and `black-translucent` status bar style, which means content extends behind the status bar. The TopNav needs to add top padding to push below the safe area.

## Changes

### 1. `src/components/layout/TopNav.tsx`

Add `safe-area-inset-top` padding to the header element so the nav content sits below the iPhone status bar:

- Change the `<header>` className from `sticky top-0 z-50 border-b bg-card` to include `pt-[env(safe-area-inset-top)]`
- This pushes the nav bar content (logo, language picker) below the status bar on iPhones
- On devices without a notch/safe area, `env(safe-area-inset-top)` resolves to `0px`, so no impact

### 2. `src/components/layout/AppLayout.tsx` (no change needed)

The `TopNav` is `sticky top-0`, so adding padding inside it is sufficient. No layout changes needed.

## What Does NOT Change

- Bottom navigation (already has `safe-area-bottom`)
- LessonPlayer NavHeader (already handles safe area independently)
- Scroll behavior, routing, or any other component

