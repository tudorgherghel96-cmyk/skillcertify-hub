

# Fix Card 7 (Lesson 1.2) — Use Uploaded Risk Assessment Image

## Current State
Card 7 in lesson 1.2 (id: `e69a098a-e51c-449c-a712-64ae3667e61a`) shows `1.2_photo_1.webp` from Supabase storage. The user has provided a new image to use instead.

## Problem
The media pipeline (`getLessonMediaUrl`) always constructs Supabase storage URLs. Simply placing the image in `public/` won't work without a small code change.

## Plan

### 1. Copy uploaded image into the project
Copy `user-uploads://risk_assessmrnt_photo.png` to `public/images/risk-assessment-form.png`.

### 2. Update `getLessonMediaUrl` to support local paths
Add a check at the top of the function: if `file` starts with `/` (absolute local path), return it directly instead of constructing a Supabase storage URL. This is a 2-line change in `src/lib/media.ts`.

### 3. Update the database
Run a migration to set `media_file` to `/images/risk-assessment-form.png` for this card. The leading `/` signals the media function to treat it as a local path.

```sql
UPDATE lesson_cards
SET media_file = '/images/risk-assessment-form.png'
WHERE id = 'e69a098a-e51c-449c-a712-64ae3667e61a';
```

### Technical Detail
The change to `getLessonMediaUrl` is minimal and backward-compatible:
```typescript
if (file.startsWith('/')) return file; // local public asset
```
All existing cards using bucket filenames continue to work unchanged.

