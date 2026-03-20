

# Replace Card 16 Image with Uploaded Photo

## What
Replace the current `1.2_photo_2.webp` image on card 16 (lesson 1.2) with the user's uploaded photo (`test_tip_risk_ass.jpeg`), optimized for fast loading.

## Steps

### 1. Optimize and copy the image
Copy `user-uploads://test_tip_risk_ass.jpeg` to `public/images/risk-assessment-competent-person.webp`, converting to WebP for smaller file size and faster loading. If WebP conversion isn't available at copy time, copy as JPEG and ensure it's reasonably sized.

### 2. Update database
Run a migration to point card 16 at the local image:
```sql
UPDATE lesson_cards
SET media_file = '/images/risk-assessment-competent-person.webp'
WHERE id = '94054296-e70a-4a1f-85c7-3bf56100e968';
```

The existing `getLessonMediaUrl` local path support (leading `/`) handles the rest — no code changes needed.

