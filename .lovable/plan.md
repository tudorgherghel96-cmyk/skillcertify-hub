

# Fix Card 6 Match Pairs Properly

## What I found
- The database for lesson `4.4`, card `6` is correct: it contains 6 hazard/disease pairs in `content_json.pairs`.
- `PatternCard.tsx` already contains a shuffle, but the user is still seeing the pairs as effectively unchanged and the interaction still feels broken.
- Unlike other interactive cards (`DragDrop`, etc.), `PatternCard` is missing the stronger mobile interaction protections already used elsewhere:
  - no `touchAction: "none"` wrapper
  - no pointer/touch event handling to stop the swipe container from interfering
- The current shuffle is also not robust enough for this use case because it can still return the original order.

## Likely root cause
This is now a UI interaction issue, not a data issue:
1. The parent swipe/scroll container is still interfering with taps on mobile.
2. The shuffle needs to guarantee the right column is not shown in the original order.

## Implementation plan
1. Update `src/components/lesson/cards/PatternCard.tsx` to follow the same interaction pattern as the working interactive cards:
   - add a top-level wrapper with `touchAction: "none"` / `userSelect: "none"`
   - stop pointer/touch propagation on the interactive area
   - make hazard/disease buttons explicitly mobile-safe

2. Replace the current shuffle with a “shuffle until different” approach:
   - shuffle the diseases list on mount
   - if the shuffled order matches the original order and there is more than 1 item, reshuffle (or rotate) so the list is visibly randomized
   - keep `correct_pairs` unchanged

3. Keep the existing pair mapping from `SwipeContainer.tsx`, but make the card logic independent from display order:
   - hazards stay in learning order on the left
   - diseases render in guaranteed-random order on the right
   - match checking still uses IDs only

4. Add a small completion hook path while in the file:
   - call `onComplete?.()` reliably when all pairs are matched
   - keep success feedback and XP display stable after completion

5. QA target after implementation:
   - open `/lesson/4/4`
   - go to card 6 on mobile width
   - confirm the right column is not pre-aligned
   - confirm tapping a hazard then a disease works consistently without the swipe container hijacking the gesture

## Files to update
- `src/components/lesson/cards/PatternCard.tsx`

## Expected result
Card 6 in Dust & Chemicals will:
- show the disease side in a truly randomized order
- allow matching reliably on mobile
- no longer feel pre-solved or unresponsive

