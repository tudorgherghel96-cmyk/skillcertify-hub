
-- User gamification table
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  daily_xp INTEGER NOT NULL DEFAULT 0,
  daily_goal INTEGER NOT NULL DEFAULT 50, -- XP target per day
  level INTEGER NOT NULL DEFAULT 1,
  milestones_achieved JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_review_prompt TIMESTAMPTZ,
  daily_xp_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_freezes_available INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification" ON public.user_gamification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification" ON public.user_gamification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification" ON public.user_gamification
  FOR UPDATE USING (auth.uid() = user_id);

-- Lesson strength tracking for progress decay
CREATE TABLE public.lesson_strength (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  strength INTEGER NOT NULL DEFAULT 100,
  last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id, lesson_id)
);

ALTER TABLE public.lesson_strength ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson strength" ON public.lesson_strength
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson strength" ON public.lesson_strength
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson strength" ON public.lesson_strength
  FOR UPDATE USING (auth.uid() = user_id);
