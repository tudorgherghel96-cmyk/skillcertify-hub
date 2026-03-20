

# Fix Text Overflow on Triangle FlipCard

## Problem
The "🔥 Side 1" text on the front of the triangle layout cards overflows outside the 90×90px card boundary.

## Fix
In `src/components/lesson/cards/TapToReveal.tsx`, update the `FlipCard` component's front face:

1. Add `overflow: hidden` to the front face container
2. Reduce font size from 12px to 11px for the icon variant label
3. Add `overflow: hidden` to the back face as well for safety

These are small style tweaks in the `FlipCard` function (lines ~47-70).

### Files changed
- `src/components/lesson/cards/TapToReveal.tsx` — add overflow hidden + reduce font size on FlipCard faces

