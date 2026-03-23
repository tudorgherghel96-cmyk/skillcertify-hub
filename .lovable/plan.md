

# Fix PatternCard: Shuffle Diseases & Fix Interaction on Card 6 (Lesson 4.4)

## Problem
1. **Pre-aligned pairs**: The normalization in `SwipeContainer.tsx` maps hazards and diseases from the same `pairs` array using the same index, so they appear in matching order — no challenge.
2. **Interaction not working**: The user reports the card doesn't work. This is likely because the items appear already matched visually, and the tap interaction may be blocked by the swipe container's touch handling.

## Root cause
In `SwipeContainer.tsx` lines 276-281, both `pcHazards` and `pcDiseases` are mapped with `rawPairs.map((p, i) => ...)` — same order, same indices. The component itself does not shuffle either list.

## Fix
Add a Fisher-Yates shuffle to the `diseases` array inside `PatternCard.tsx` using `useMemo`, so the right column is randomized on mount while keeping `correct_pairs` mapping intact.

### Changes

**`src/components/lesson/cards/PatternCard.tsx`**
- Import `useMemo`
- Wrap `diseases` in a `useMemo` shuffle (Fisher-Yates) before rendering, similar to how `DragDrop` shuffles its items
- This ensures the right-side "Disease" column is randomized while the `correct_pairs` lookup still works correctly

No database changes needed — this is purely a UI rendering fix.

