-- Shift cards 5-12 forward by 2 positions in lesson 3.4 (reverse order)
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.4' AND card_position = 12;
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '3.4' AND card_position = 11;
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '3.4' AND card_position = 10;
UPDATE lesson_cards SET card_position = 11 WHERE lesson_id = '3.4' AND card_position = 9;
UPDATE lesson_cards SET card_position = 10 WHERE lesson_id = '3.4' AND card_position = 8;
UPDATE lesson_cards SET card_position = 9 WHERE lesson_id = '3.4' AND card_position = 7;
UPDATE lesson_cards SET card_position = 8 WHERE lesson_id = '3.4' AND card_position = 6;
UPDATE lesson_cards SET card_position = 7 WHERE lesson_id = '3.4' AND card_position = 5;

-- Update card 4: first bullet point only, with generated illustration
UPDATE lesson_cards 
SET content_json = '{"text": "FRAGILE SURFACES: Rooflights, fibre cement sheets, glass panels, and deteriorated felt."}'::jsonb,
    media_file = '/images/lessons/3.4_fragile_types.webp',
    media_bucket = NULL
WHERE lesson_id = '3.4' AND card_position = 4;

-- Insert card 5: Never walk warning
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, media_file, media_bucket, xp_value)
VALUES ('3.4', 3, 5, 'remember_this', '{"text": "NEVER walk on fragile surfaces — they will NOT hold your weight."}', '/images/lessons/3.4_never_walk.webp', NULL, 0);

-- Insert card 6: Protection measures
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, media_file, media_bucket, xp_value)
VALUES ('3.4', 3, 6, 'remember_this', '{"text": "Use crawl boards, guardrails, and barriers to protect against falls through fragile surfaces."}', '/images/lessons/3.4_crawl_boards.webp', NULL, 0);