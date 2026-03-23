
The image is still not showing because Card 5 is not actually pointing at the local replacement image.

## What I found
- Lesson `3.4`, card `5` currently has:
  - `media_bucket = 'final-correct-media'`
  - `media_file = '3.4_photo_1.webp'`
- That means the app is still trying to load the old Supabase bucket asset.
- The lesson player code is working as intended:
  - if `media_file` starts with `/`, it uses the local public asset
  - otherwise it builds a Supabase Storage URL
- The session replay confirms the image request fails and the card falls back to **“Image unavailable”**.
- So this is a **data/config issue**, not an `ImageSlide` rendering bug.

## Plan
1. Update the `lesson_cards` row for lesson `3.4`, card `5` so it uses the local asset path instead of the storage bucket.
   - Set `media_file` to the local path for the replacement image
   - Set `media_bucket` to `NULL`

2. Keep the card as an `image` card with the existing caption unless you want that text changed too.

3. Verify the card now resolves through the local-path branch of `getLessonMediaUrl`, which should stop the broken bucket lookup and display the image properly.

## Technical details
```text
Current broken state:
media_bucket = final-correct-media
media_file   = 3.4_photo_1.webp

Expected fixed state:
media_bucket = NULL
media_file   = /images/lessons/3.4_rooflights_fragile.webp
```

## Why this happened
A previous image conversion may have succeeded, but the database row for card 5 still points to the old storage object. Since the code prefers the DB record, the new local file is never used.

## Expected result
Card 5 in “Fragile Surfaces” will load the replacement rooflights image instead of showing “Image unavailable”.
