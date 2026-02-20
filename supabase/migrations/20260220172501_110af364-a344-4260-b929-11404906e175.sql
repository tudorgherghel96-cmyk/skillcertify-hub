
-- Create old-content-images bucket (lesson-videos and lesson-images already exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('old-content-images', 'old-content-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for old-content-images: public read, authenticated write
CREATE POLICY "Public read old-content-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'old-content-images');

CREATE POLICY "Auth upload old-content-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'old-content-images' AND auth.role() = 'authenticated');

-- Create lesson_cards table
CREATE TABLE public.lesson_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id text NOT NULL,
  module_id integer NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  card_position integer NOT NULL,
  card_type text NOT NULL CHECK (card_type IN (
    'hero', 'video', 'broll', 'image', 'remember_this', 'test_tip',
    'key_term', 'quick_check', 'multi_select', 'drag_drop', 'tap_to_reveal',
    'split_screen', 'scenario', 'speed_drill', 'pattern_card', 'lesson_complete'
  )),
  media_file text,
  media_bucket text CHECK (media_bucket IN ('lesson-videos', 'lesson-images', 'old-content-images')),
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  fourth_wall_effect text CHECK (fourth_wall_effect IN (
    'point_down', 'lean_in', 'hold_up', 'split_screen_compare'
  )),
  effect_overlay_text text,
  xp_value integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Indexes for fast lookup by lesson
CREATE INDEX idx_lesson_cards_lesson_id ON public.lesson_cards (lesson_id, card_position);
CREATE INDEX idx_lesson_cards_module_id ON public.lesson_cards (module_id);

-- Enable RLS
ALTER TABLE public.lesson_cards ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read lesson cards
CREATE POLICY "Authenticated users can read lesson cards"
ON public.lesson_cards FOR SELECT
USING (auth.role() = 'authenticated');

-- Only admins/service role can insert/update/delete
CREATE POLICY "Service role can manage lesson cards"
ON public.lesson_cards FOR ALL
USING (auth.role() = 'service_role');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_lesson_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_lesson_cards_updated_at
BEFORE UPDATE ON public.lesson_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_lesson_cards_updated_at();
