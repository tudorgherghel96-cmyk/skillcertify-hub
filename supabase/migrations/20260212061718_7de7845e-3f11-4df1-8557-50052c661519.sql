
-- Create concepts table
CREATE TABLE public.concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id integer NOT NULL CHECK (module_id BETWEEN 1 AND 5),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  learning_outcome_ref text,
  difficulty_weight integer DEFAULT 1 CHECK (difficulty_weight BETWEEN 1 AND 3),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;

-- Concepts are read-only reference data, publicly readable by authenticated users
CREATE POLICY "Authenticated users can read concepts"
  ON public.concepts FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage concepts (via SQL editor / service role)
-- No INSERT/UPDATE/DELETE policies for regular users

-- Index for fast module lookups
CREATE INDEX idx_concepts_module_id ON public.concepts (module_id);
CREATE INDEX idx_concepts_slug ON public.concepts (slug);
