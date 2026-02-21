-- Fix: "Multiple hazards in one scene" (1.1 pos 11) should show the hazards photo, not the risk assessment form
UPDATE public.lesson_cards SET media_file = '1.1_photo_4.webp' WHERE lesson_id = '1.1' AND card_position = 11;
-- "A completed risk assessment form" (1.2 pos 7) keeps 1.2_photo_1.webp (already correct)