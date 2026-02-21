-- Swap COSHH lesson images: routes of entry diagram should match routes caption
UPDATE public.lesson_cards SET media_file = '4.1_photo_3.webp' WHERE lesson_id = '4.1' AND card_position = 11;
UPDATE public.lesson_cards SET media_file = '4.1_photo_1.webp' WHERE lesson_id = '4.1' AND card_position = 12;