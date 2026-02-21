-- Swap fire extinguishers and hearing protection images
UPDATE public.lesson_cards SET media_file = '4.3_photo_3.webp' WHERE lesson_id = '1.7' AND card_position = 9;
UPDATE public.lesson_cards SET media_file = '1.7_photo_5.webp' WHERE lesson_id = '1.7' AND card_position = 23;