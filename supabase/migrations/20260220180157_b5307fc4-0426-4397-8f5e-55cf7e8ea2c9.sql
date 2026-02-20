
-- ── user_lesson_progress ──────────────────────────────────────────────────────
-- Tracks per-lesson card progress, XP earned, and quiz answers
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id            uuid            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid            NOT NULL,
  lesson_id     text            NOT NULL,
  cards_completed  integer      NOT NULL DEFAULT 0,
  total_cards   integer         NOT NULL DEFAULT 0,
  quiz_answers  jsonb           NOT NULL DEFAULT '{}'::jsonb,
  xp_earned     integer         NOT NULL DEFAULT 0,
  completed_at  timestamptz     NULL,
  created_at    timestamptz     NOT NULL DEFAULT now(),
  updated_at    timestamptz     NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON public.user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON public.user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON public.user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ── user_xp ──────────────────────────────────────────────────────────────────
-- Cumulative XP ledger (separate from user_gamification for clean accounting)
CREATE TABLE IF NOT EXISTS public.user_xp (
  user_id    uuid        NOT NULL PRIMARY KEY,
  total_xp   integer     NOT NULL DEFAULT 0,
  level      integer     NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp"
  ON public.user_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp"
  ON public.user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own xp"
  ON public.user_xp FOR UPDATE
  USING (auth.uid() = user_id);

-- ── daily_xp_log ─────────────────────────────────────────────────────────────
-- One row per user per day to power the 7-day bar chart on Profile
CREATE TABLE IF NOT EXISTS public.daily_xp_log (
  id         uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL,
  log_date   date        NOT NULL DEFAULT CURRENT_DATE,
  xp_earned  integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

ALTER TABLE public.daily_xp_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily xp log"
  ON public.daily_xp_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily xp log"
  ON public.daily_xp_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily xp log"
  ON public.daily_xp_log FOR UPDATE
  USING (auth.uid() = user_id);
