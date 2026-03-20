

# Fix Misplaced Accident Book Image

## Problem
The previous migration updated card 7 in lesson **1.4** (Dynamic Risk Assessment, "Changing conditions require reassessment") instead of card 7 in lesson **1.5** (Reporting Accidents). Two cards need fixing.

## Steps

### 1. Revert lesson 1.4 card 7 back to original image
Update card `39df5470-890b-4961-8461-d2a7def4b8ad` to restore `1.4_photo_1.webp` (its original media file).

### 2. Move accident book image to lesson 1.5 card 7
Update card `b68092fa-ed99-4d08-9b7f-b0201f4507e1` to use `/images/accident-book-reporting.webp`.

Both changes via a single SQL data update — no code changes needed.

