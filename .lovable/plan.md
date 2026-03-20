

# Improve RememberThis Card Readability Across All Cards

## Problem
The current RememberThis card uses tight spacing, small text, and a subtle gradient background that makes content hard to read against the dark lesson player. The layout needs to be clearer, more digestible, and easier to follow.

## Changes

### `src/components/lesson/cards/RememberThis.tsx`
Redesign the card layout for maximum readability:

1. **Stronger background contrast** — switch from translucent gradient to a more solid dark background with a subtle blue tint border
2. **Larger, bolder text** — increase body text from 15px to 16px, bump line-height to 1.8
3. **Better item spacing** — increase gap between items from 12px (gap-3) to 16px (gap-4), add a subtle separator line or background card per item
4. **Item cards** — wrap each numbered/key-value item in its own rounded panel (rgba background) so items are visually distinct
5. **Larger number badges** — increase from h-6/w-6 to h-7/w-7 with slightly larger font
6. **Fallback text** — increase to 18px with more generous line-height (1.8)
7. **Better title styling** — add bottom margin, slightly larger size

### `src/components/lesson/RememberThis.tsx`
Delete this file — it's unused (not imported anywhere).

### Files changed
- `src/components/lesson/cards/RememberThis.tsx` — redesign for readability
- `src/components/lesson/RememberThis.tsx` — delete (unused)

