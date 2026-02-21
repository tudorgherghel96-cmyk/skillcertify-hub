-- Swap mismatched photos between lessons 2.3 and 2.4
-- 2.3 pos 7 "Assess the environment" should show the environment/TILE photo
UPDATE public.lesson_cards SET media_file = '2.3_photo_1.webp' WHERE lesson_id = '2.3' AND card_position = 7;
-- 2.4 pos 7 "Mechanical aids" should show the mechanical aids photo  
UPDATE public.lesson_cards SET media_file = '2.4_photo_1.webp' WHERE lesson_id = '2.4' AND card_position = 7;
-- 2.4 pos 11 "Wheelbarrows, sack trucks, pallet trucks" should show mechanical aids equipment
UPDATE public.lesson_cards SET media_file = '2.4_photo_2.webp' WHERE lesson_id = '2.4' AND card_position = 11;