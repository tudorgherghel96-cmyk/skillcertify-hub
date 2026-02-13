
-- Add streak_frozen column to streaks table
ALTER TABLE public.streaks ADD COLUMN IF NOT EXISTS streak_frozen boolean NOT NULL DEFAULT false;
