

# Split Card 4 in Lesson 3.4 into 3 Illustrated Cards

## Current state
Card 4 is a `remember_this` card with text:
> "FRAGILE: Rooflights, fibre cement, glass panels, deteriorated felt. NEVER walk on them. Use crawl boards, guardrails, barriers."

Lesson 3.4 currently has 12 cards (positions 1-12).

## Plan

Split card 4 into 3 separate `remember_this` cards, each with a generated illustration, and shift cards 5-12 forward by 2 positions (to 7-14).

### New card 4 — What is fragile
- Type: `remember_this` (headerless, image-focused)
- Text: "FRAGILE SURFACES: Rooflights, fibre cement sheets, glass panels, and deteriorated felt."
- Image: AI-generated illustration showing examples of fragile surfaces (rooflights, cement sheets)
- Saved to `public/images/lessons/3.4_fragile_types.webp`
- DB: `media_file = '/images/lessons/3.4_fragile_types.webp'`, `media_bucket = NULL`

### New card 5 — Never walk on them
- Type: `remember_this` (headerless, image-focused)
- Text: "NEVER walk on fragile surfaces — they will NOT hold your weight."
- Image: AI-generated illustration showing the danger of walking on fragile surfaces
- Saved to `public/images/lessons/3.4_never_walk.webp`
- DB: `media_file = '/images/lessons/3.4_never_walk.webp'`, `media_bucket = NULL`

### New card 6 — Protection measures
- Type: `remember_this`
- Text: "Use crawl boards, guardrails, and barriers to protect against falls through fragile surfaces."
- Image: AI-generated illustration showing crawl boards and guardrails
- Saved to `public/images/lessons/3.4_crawl_boards.webp`
- DB: `media_file = '/images/lessons/3.4_crawl_boards.webp'`, `media_bucket = NULL`

### Database operations
1. Shift cards 5-12 forward by 2 (to 7-14) — reverse order to avoid conflicts
2. Update card 4 content to first bullet point only, add image reference
3. Insert card 5 (never walk) and card 6 (protection measures)

### Image generation
Since I cannot generate AI images, I will use placeholder illustrations. The user can upload replacement images later, or I can prompt the user to provide 3 images for each point.

**Alternative**: The user could upload 3 images and I apply them. Should I proceed with text-only cards and ask for images, or create the cards now with the existing rooflight image on card 4 and no images on cards 5-6?

### Files involved
- New migration SQL for card splitting and position shifts
- 3 new image files in `public/images/lessons/` (if user provides them)

