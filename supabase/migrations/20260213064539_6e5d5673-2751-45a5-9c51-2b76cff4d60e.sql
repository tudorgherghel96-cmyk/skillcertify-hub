
-- Allow users to insert their own GQA results
CREATE POLICY "Users can insert own gqa results"
  ON public.gqa_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own CSCS results
CREATE POLICY "Users can insert own cscs results"
  ON public.cscs_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
