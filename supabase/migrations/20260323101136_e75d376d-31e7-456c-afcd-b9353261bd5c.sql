
-- =============================================
-- Performance indexes on frequently queried columns
-- =============================================

-- User-scoped tables: index on user_id
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_module ON public.progress (user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_id ON public.practice_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_module ON public.practice_attempts (user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_gqa_results_user_id ON public.gqa_results (user_id);
CREATE INDEX IF NOT EXISTS idx_gqa_results_user_module ON public.gqa_results (user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_cscs_results_user_id ON public.cscs_results (user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks (user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON public.user_gamification (user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON public.user_xp (user_id);
CREATE INDEX IF NOT EXISTS idx_daily_xp_log_user_id ON public.daily_xp_log (user_id);
CREATE INDEX IF NOT EXISTS idx_daily_xp_log_user_date ON public.daily_xp_log (user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_lesson_strength_user_id ON public.lesson_strength (user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_strength_composite ON public.lesson_strength (user_id, module_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON public.badges (user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_id ON public.assessment_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_concept_attempts_user_id ON public.concept_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_concept_attempts_concept_id ON public.concept_attempts (concept_id);
CREATE INDEX IF NOT EXISTS idx_mock_attempts_user_id ON public.mock_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON public.user_lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON public.user_lesson_progress (user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_quiz_attempts_user_id ON public.lesson_quiz_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_readiness_snapshots_user_id ON public.readiness_snapshots (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles (id);

-- Lesson cards: indexed for lesson_id lookups
CREATE INDEX IF NOT EXISTS idx_lesson_cards_lesson_id ON public.lesson_cards (lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_cards_lesson_position ON public.lesson_cards (lesson_id, card_position);
CREATE INDEX IF NOT EXISTS idx_lesson_cards_module_id ON public.lesson_cards (module_id);

-- Concepts
CREATE INDEX IF NOT EXISTS idx_concepts_module_id ON public.concepts (module_id);
CREATE INDEX IF NOT EXISTS idx_concepts_slug ON public.concepts (slug);

-- =============================================
-- RLS policy optimization: wrap auth.uid() in subselect
-- This prevents Postgres from re-evaluating auth.uid() per row
-- =============================================

-- progress table
DROP POLICY IF EXISTS "Users can view own progress" ON public.progress;
CREATE POLICY "Users can view own progress" ON public.progress FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.progress;
CREATE POLICY "Users can insert own progress" ON public.progress FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;
CREATE POLICY "Users can update own progress" ON public.progress FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- practice_attempts table
DROP POLICY IF EXISTS "Users can view own attempts" ON public.practice_attempts;
CREATE POLICY "Users can view own attempts" ON public.practice_attempts FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.practice_attempts;
CREATE POLICY "Users can insert own attempts" ON public.practice_attempts FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- gqa_results table
DROP POLICY IF EXISTS "Users can view own gqa" ON public.gqa_results;
CREATE POLICY "Users can view own gqa" ON public.gqa_results FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own gqa results" ON public.gqa_results;
CREATE POLICY "Users can insert own gqa results" ON public.gqa_results FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- cscs_results table
DROP POLICY IF EXISTS "Users can view own cscs" ON public.cscs_results;
CREATE POLICY "Users can view own cscs" ON public.cscs_results FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own cscs results" ON public.cscs_results;
CREATE POLICY "Users can insert own cscs results" ON public.cscs_results FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- streaks table
DROP POLICY IF EXISTS "Users can manage own streak" ON public.streaks;
CREATE POLICY "Users can manage own streak" ON public.streaks FOR ALL USING ((SELECT auth.uid()) = user_id);

-- user_gamification table
DROP POLICY IF EXISTS "Users can view own gamification" ON public.user_gamification;
CREATE POLICY "Users can view own gamification" ON public.user_gamification FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own gamification" ON public.user_gamification;
CREATE POLICY "Users can insert own gamification" ON public.user_gamification FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own gamification" ON public.user_gamification;
CREATE POLICY "Users can update own gamification" ON public.user_gamification FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- user_xp table
DROP POLICY IF EXISTS "Users can view own xp" ON public.user_xp;
CREATE POLICY "Users can view own xp" ON public.user_xp FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own xp" ON public.user_xp;
CREATE POLICY "Users can insert own xp" ON public.user_xp FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own xp" ON public.user_xp;
CREATE POLICY "Users can update own xp" ON public.user_xp FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- daily_xp_log table
DROP POLICY IF EXISTS "Users can view own daily xp log" ON public.daily_xp_log;
CREATE POLICY "Users can view own daily xp log" ON public.daily_xp_log FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own daily xp log" ON public.daily_xp_log;
CREATE POLICY "Users can insert own daily xp log" ON public.daily_xp_log FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own daily xp log" ON public.daily_xp_log;
CREATE POLICY "Users can update own daily xp log" ON public.daily_xp_log FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- lesson_strength table
DROP POLICY IF EXISTS "Users can view own lesson strength" ON public.lesson_strength;
CREATE POLICY "Users can view own lesson strength" ON public.lesson_strength FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson strength" ON public.lesson_strength;
CREATE POLICY "Users can insert own lesson strength" ON public.lesson_strength FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own lesson strength" ON public.lesson_strength;
CREATE POLICY "Users can update own lesson strength" ON public.lesson_strength FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- badges table
DROP POLICY IF EXISTS "Users can view own badges" ON public.badges;
CREATE POLICY "Users can view own badges" ON public.badges FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own badges" ON public.badges;
CREATE POLICY "Users can insert own badges" ON public.badges FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- assessment_attempts table
DROP POLICY IF EXISTS "Users can view own assessment attempts" ON public.assessment_attempts;
CREATE POLICY "Users can view own assessment attempts" ON public.assessment_attempts FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own assessment attempts" ON public.assessment_attempts;
CREATE POLICY "Users can insert own assessment attempts" ON public.assessment_attempts FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- concept_attempts table
DROP POLICY IF EXISTS "Users can view own concept attempts" ON public.concept_attempts;
CREATE POLICY "Users can view own concept attempts" ON public.concept_attempts FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own concept attempts" ON public.concept_attempts;
CREATE POLICY "Users can insert own concept attempts" ON public.concept_attempts FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

-- mock_attempts table
DROP POLICY IF EXISTS "Users can view own mock attempts" ON public.mock_attempts;
CREATE POLICY "Users can view own mock attempts" ON public.mock_attempts FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own mock attempts" ON public.mock_attempts;
CREATE POLICY "Users can insert own mock attempts" ON public.mock_attempts FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- user_lesson_progress table
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON public.user_lesson_progress FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users can insert own lesson progress" ON public.user_lesson_progress FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.user_lesson_progress;
CREATE POLICY "Users can update own lesson progress" ON public.user_lesson_progress FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- lesson_quiz_attempts table
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.lesson_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts" ON public.lesson_quiz_attempts FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON public.lesson_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts" ON public.lesson_quiz_attempts FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- readiness_snapshots table
DROP POLICY IF EXISTS "Users can view own snapshots" ON public.readiness_snapshots;
CREATE POLICY "Users can view own snapshots" ON public.readiness_snapshots FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own snapshots" ON public.readiness_snapshots;
CREATE POLICY "Users can insert own snapshots" ON public.readiness_snapshots FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((SELECT auth.uid()) = id);

-- user_roles table
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING ((SELECT auth.uid()) = user_id);
