
-- Shift cards 11+ up by 1
UPDATE lesson_cards SET card_position = card_position + 100
WHERE lesson_id = '3.2' AND card_position >= 11;

UPDATE lesson_cards SET card_position = card_position - 99
WHERE lesson_id = '3.2' AND card_position >= 111;

-- Insert new image card at position 11
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, media_file, media_bucket, xp_value)
VALUES ('3.2', 3, 11, 'image', '{"alt":"Common hazards when working at height","caption":"Common hazards: falling tools/debris, unstable ladders, overhead cables, fragile roofs, and internal floor voids."}'::jsonb, '/images/lessons/3.2_common_hazards.webp', NULL, 0);
