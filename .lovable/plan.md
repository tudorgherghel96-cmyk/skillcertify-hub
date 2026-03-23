
Restore that content as a single `remember_this` card in Lesson 3.1 instead of splitting it across separate cards.

## What I found
- The current DB state for lesson `3.1` is:
  - card 11 = `image`
  - card 12 = `remember_this` with `media_file: /images/lessons/3.1_voids_openings.webp`
  - card 13 = quiz
- The renderer for `remember_this` currently only passes:
  - `content.text` / `content.content`
  - `content.illustrations`
- It does not currently pass the card’s `mediaUrl`, and `RememberThis.tsx` does not support a single hero image block above the text.
- Earlier migrations changed this content from one image-caption style card into split cards, which is why the original “image + remember this message together” behavior was lost.

## Plan
1. Update the Lesson 3.1 data so the “Working at height includes working near unguarded openings, trenches, and floor voids” content lives on one `remember_this` card again.
   - Keep it at card 12, since that card already points to the uploaded image path.
   - Store the remember-this text in the field shape the component actually reads (`text` or `content`), not only `title/items`.

2. Extend the `remember_this` rendering flow to support a single top image.
   - Pass `card.mediaUrl` from `SwipeContainer` into `RememberThis`.
   - Add an optional `heroImage` prop in `RememberThis.tsx`.
   - Render the image near the top of the card, under the brain icon / “Remember This” label, so it still clearly reads as a remember-this card.

3. Keep the remember-this visual treatment intact.
   - Preserve the icon/header at the top.
   - Show the uploaded image as the main visual.
   - Render the text below in a clear stacked layout so the key warning remains prominent and easy to scan on mobile.

4. Clean up the lesson flow.
   - Ensure card 12 is the combined remember-this card.
   - Ensure card 11 remains whatever precedes it and card 13 remains the quiz, with no duplicate or empty replacement card left behind.

## Technical details
```text
Current issue:
remember_this card has image in media_file
but component ignores mediaUrl
and content_json shape is partly incompatible with current renderer

Required implementation:
LessonPlayer -> mediaUrl already exists
SwipeContainer remember_this case -> pass heroImage={card.mediaUrl}
RememberThis -> accept optional heroImage and render it
DB data -> set card 12 content_json to include a text string the component reads
```

## Files likely involved
- `src/components/lesson/SwipeContainer.tsx`
- `src/components/lesson/cards/RememberThis.tsx`
- data update for `lesson_cards` where `lesson_id = '3.1'` and `card_position = 12`

## Expected result
Card 12 in “What is Working at Height” will again be a proper `Remember This` card with:
- the brain icon and “Remember This” heading
- the uploaded image on the same card
- the full warning text: “Working at height includes working near unguarded openings, trenches, and floor voids.”
- the rest of the reminder content underneath in a readable format
