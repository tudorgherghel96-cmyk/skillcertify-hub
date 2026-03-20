

# Add Missing Video for Card 12 (Lesson 1.7)

## Context
Card 12 (id: `07b8200d-3d44-4ffc-b7d1-cbdb0118decf`) is a "lean_in" video card about CO2 fire extinguishers. It references `M1-L7-C05-lean-in-co2.mp4` in the `final-correct-media` bucket, but the file is missing. The user has uploaded the actual video.

## Plan

1. **Copy the video** to `public/videos/lessons/m1-l7-c05-lean-in-co2.mp4`

2. **Update the database** to point to the local path:
   - Set `media_file = '/videos/lessons/m1-l7-c05-lean-in-co2.mp4'`
   - Set `media_bucket = NULL` (local asset, no bucket needed)

### Files changed
- `public/videos/lessons/m1-l7-c05-lean-in-co2.mp4` — new video asset
- Database migration — update card 12 media reference

