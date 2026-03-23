

# Add Images to Card 4 (Lesson 2.3) TILE Tap-to-Reveal

## What
Card 4 is a `tap_to_reveal` with 4 panels for T-I-L-E. Add the uploaded images as icons on each panel's front face.

## Image mapping
- **T (Task)** — Worker with bricks on pallet (Screenshot_2026-03-23_at_11.25.04.png)
- **I (Individual)** — Two workers communicating/signaling (Screenshot_2026-03-23_at_11.24.57.png)
- **L (Load)** — Worker lifting concrete blocks (Screenshot_2026-03-23_at_11.24.49.png)
- **E (Environment)** — Worker with wheelbarrow indoors (Screenshot_2026-03-23_at_11.25.10.png)

## Steps

1. **Copy and optimize** the 4 uploaded images to `public/images/lessons/2.3_tile_{t,i,l,e}.webp` (800px, WebP)
2. **Update database** — add `icon` field to each panel in `content_json`:
```sql
UPDATE lesson_cards SET content_json = '{"panels":[
  {"label":"T","content":"Task — what does the job involve?","icon":"/images/lessons/2.3_tile_t.webp"},
  {"label":"I","content":"Individual — are YOU fit?","icon":"/images/lessons/2.3_tile_i.webp"},
  {"label":"L","content":"Load — heavy, awkward, grip?","icon":"/images/lessons/2.3_tile_l.webp"},
  {"label":"E","content":"Environment — wet, narrow, steps?","icon":"/images/lessons/2.3_tile_e.webp"}
]}'::jsonb WHERE lesson_id = '2.3' AND card_position = 4;
```

No component changes needed — `TapToReveal` already detects image paths in the `icon` field and renders `<img>` tags.

### Files changed
- `public/images/lessons/2.3_tile_t.webp` — new optimized image
- `public/images/lessons/2.3_tile_i.webp` — new optimized image
- `public/images/lessons/2.3_tile_l.webp` — new optimized image
- `public/images/lessons/2.3_tile_e.webp` — new optimized image
- SQL data update for card 4 content_json

