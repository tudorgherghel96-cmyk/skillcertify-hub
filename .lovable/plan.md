

# Add Illustrations to Card 13 (Lesson 2.2) Split Screen

## Problem
Card 13 in lesson 2.2 is a `split_screen` comparing bad vs good lifting technique but has no images — just text. Card 11 in lesson 2.1 (Manual Handling) has a similar layout but includes custom illustrations for each option.

## What to do

### 1. Generate 2 illustrations
Using the AI image generation tool, create two images in a similar style to the lesson 2.1 card 11 illustrations:

- **Option A (Bad)**: Worker with rounded back, jerky twisting motion, spine under stress — red/warning tones
- **Option B (Good)**: Worker with straight back, smooth leg-driven lift, load held close, feet repositioning — green/positive tones

Save as optimized WebP files:
- `public/images/lessons/2.2_bad_technique.webp`
- `public/images/lessons/2.2_good_technique.webp`

### 2. Update database
Add `left_image` and `right_image` paths to the card's `content_json`:
```sql
UPDATE lesson_cards SET content_json = jsonb_build_object(
  'left', 'Rounded back, jerky, twisting spine.',
  'left_image', '/images/lessons/2.2_bad_technique.webp',
  'right', 'Straight back, smooth legs, load close, feet move.',
  'right_image', '/images/lessons/2.2_good_technique.webp'
) WHERE lesson_id = '2.2' AND card_position = 13;
```

### Files changed
- `public/images/lessons/2.2_bad_technique.webp` — new illustration (bad technique)
- `public/images/lessons/2.2_good_technique.webp` — new illustration (good technique)
- 1 SQL migration — add image paths to content_json

