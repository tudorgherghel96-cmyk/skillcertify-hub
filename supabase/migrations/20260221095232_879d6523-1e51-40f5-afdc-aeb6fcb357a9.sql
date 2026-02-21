-- Drop the check constraint that restricts bucket names
ALTER TABLE public.lesson_cards DROP CONSTRAINT IF EXISTS lesson_cards_media_bucket_check;

-- Update all lesson_cards to use the unified final-correct-media bucket
UPDATE public.lesson_cards
SET media_bucket = 'final-correct-media'
WHERE media_bucket IN ('lesson-images', 'lesson-videos', 'course-media', 'course-images', 'course-videos');

-- Add new check constraint allowing only final-correct-media
ALTER TABLE public.lesson_cards ADD CONSTRAINT lesson_cards_media_bucket_check
  CHECK (media_bucket IS NULL OR media_bucket = 'final-correct-media');
