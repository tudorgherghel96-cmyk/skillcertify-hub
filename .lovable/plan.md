

# Update Lesson 1.4 Card 13 — Image Only with New Photo

## Current State
Card 13 (ID: `6f1d96a6-a20a-4013-98a6-436d8969e80c`) is an `image` card showing `1.4_photo_3.webp` with caption text about dynamic RA steps.

## Plan

### 1. Optimize uploaded image
Copy `Worker_stops_activity_202603201553.jpeg` to `public/images/worker-stops-dra.webp`, converting to WebP at 800px width for fast mobile loading.

### 2. Update card 13 — image only, no caption
Update card `6f1d96a6-a20a-4013-98a6-436d8969e80c`:
- Set `media_file` to `/images/worker-stops-dra.webp` (local path, no bucket needed)
- Set `media_bucket` to `NULL`
- Set `content_json` to `{"alt": "Worker stopped — Dynamic Risk Assessment procedure"}` (no caption)

Single migration, one SQL statement.

