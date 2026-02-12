-- Add spaced recall scheduling column to concept_attempts
ALTER TABLE public.concept_attempts
ADD COLUMN next_review_at timestamptz;

-- Index for efficient "due today" queries
CREATE INDEX idx_concept_attempts_review
ON public.concept_attempts (user_id, next_review_at)
WHERE next_review_at IS NOT NULL;
