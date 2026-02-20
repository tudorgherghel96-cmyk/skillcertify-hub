-- Allow anonymous (unauthenticated) users to read lesson cards
-- This is required for the play-first lesson 1.1 experience
CREATE POLICY "Anyone can read lesson cards"
  ON public.lesson_cards
  FOR SELECT
  USING (true);