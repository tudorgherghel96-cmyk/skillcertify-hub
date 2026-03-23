

# Fix Missing Mechanical Aids Image on Card 11 (Lesson 2.4)

## Problem
The migration correctly updated card 11's `media_file` to `/images/lessons/2.4_mechanical_aids.webp`, but the actual image file was never saved to `public/images/lessons/`. The file doesn't exist, so the card shows "Image unavailable".

## Fix
1. Re-process the original uploaded image (`Mechanical_aids_reduce_202603231149.jpeg`) into an optimized WebP file at `public/images/lessons/2.4_mechanical_aids.webp`
2. No database changes needed — card 11 already points to the correct path

### Files changed
- `public/images/lessons/2.4_mechanical_aids.webp` — create the missing image file

