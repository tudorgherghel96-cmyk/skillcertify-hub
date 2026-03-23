

# Fix Card 6 (Lesson 4.4) — Switch to DragDrop Component

## Problem
`PatternCard` is a tap-to-match component with no drag support. The user wants drag-and-drop. The project already has a fully working `DragDrop` component with mouse and touch drag handlers, hit-testing, and a floating drag ghost.

## Solution
Change the `pattern_card` case in `SwipeContainer.tsx` to render `DragDrop` instead of `PatternCard`. The normalization already produces `hazards` and `diseases` arrays with IDs — just map them to `items` and `targets` for DragDrop.

## Changes

**`src/components/lesson/SwipeContainer.tsx`** — lines 273-294

Replace the `pattern_card` case to use `DragDrop`:
- Map `pcHazards` → `items` (left column, draggable)
- Map `pcDiseases` → `targets` (right column, drop zones)
- Pass `pcPairs` as `correct_pairs`
- Keep `xp_value`

The existing `DragDrop` component already handles:
- Fisher-Yates shuffle of items
- Touch drag with floating ghost element
- Mouse drag support
- Hit-test drop detection
- Correct/wrong feedback with haptics
- Completion callback

No changes needed to `DragDrop.tsx` — it already works correctly for other cards.

