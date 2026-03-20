

# Replace Card 17 Image and Update Caption

## What
Replace card 17's image (`1.2_photo_3.webp`) with the uploaded `5_steps_risk.jpeg` infographic, optimized for fast loading. Update the caption to remove the "5 steps" description but keep the TEST TIP.

## Steps

### 1. Optimize and copy the image
Copy `user-uploads://5_steps_risk.jpeg` to `public/images/five-steps-risk-assessment.webp`, converting to WebP and resizing to ~800px width for fast loading on mobile.

### 2. Update database
Run a migration to update card 17 with the new local image path and revised caption:

```sql
UPDATE lesson_cards
SET media_file = '/images/five-steps-risk-assessment.webp',
    content_json = jsonb_set(
      content_json::jsonb,
      '{caption}',
      '"TEST TIP: You MUST know all 5 steps for the exam."'
    )
WHERE id = '9aa06162-f77d-4525-b356-ec0fcb12b0bd';
```

No code changes needed — the existing `getLessonMediaUrl` local path support handles it.

