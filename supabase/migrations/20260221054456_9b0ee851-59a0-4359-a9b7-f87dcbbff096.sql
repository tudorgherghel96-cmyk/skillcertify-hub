-- Create lesson_quiz_attempts table
CREATE TABLE public.lesson_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  passed boolean NOT NULL,
  answers_json jsonb DEFAULT '{}'::jsonb,
  attempted_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lesson_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Users can insert their own attempts
CREATE POLICY "Users can insert own quiz attempts"
ON public.lesson_quiz_attempts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can select their own attempts
CREATE POLICY "Users can view own quiz attempts"
ON public.lesson_quiz_attempts
FOR SELECT
USING (auth.uid() = user_id);