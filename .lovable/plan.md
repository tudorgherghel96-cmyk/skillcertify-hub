

# Make Card 6 (RememberThis with 8 Steps) Compact — Fit on One Screen

## Problem
Card 6 in lesson 2.2 has 8 numbered steps, each with a 56×56px illustration, generous padding/gaps, and a large header section. With 8 items this overflows the viewport (844px minus ~55px nav = ~789px usable).

## Changes in `src/components/lesson/cards/RememberThis.tsx`

Detect when there are many items (≥6) with illustrations and switch to a **compact layout**:

1. **Reduce header** — Smaller emoji (28px), tighter margins, combine "Remember This" label + title into less vertical space, reduce divider margins
2. **Compact item grid** — Switch from single-column `gap-4` to a **2-column grid** (`grid-cols-2 gap-2`) when item count ≥ 6 and illustrations exist
3. **Smaller illustration tiles** — Each tile: 40×40px image (down from 56×56), step number overlay, text at 12px (down from 16px), padding `px-2 py-2` (down from `px-4 py-3`)
4. **Reduce line-height** — From 1.8 to 1.4 in compact mode
5. **Outer padding** — `py-4 px-3` instead of `py-10 px-5` in compact mode

This keeps all 8 steps + illustrations visible in a ~700px content area. Photos remain clearly visible at 40×40px rounded thumbnails.

### Files changed
- `src/components/lesson/cards/RememberThis.tsx`

