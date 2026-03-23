-- Shift cards 6-14 forward by 1 in lesson 3.1 (reverse order to avoid conflicts)
UPDATE lesson_cards SET card_position = 15 WHERE lesson_id = '3.1' AND card_position = 14;
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.1' AND card_position = 13;
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '3.1' AND card_position = 12;
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '3.1' AND card_position = 11;
UPDATE lesson_cards SET card_position = 11 WHERE lesson_id = '3.1' AND card_position = 10;
UPDATE lesson_cards SET card_position = 10 WHERE lesson_id = '3.1' AND card_position = 9;
UPDATE lesson_cards SET card_position = 9 WHERE lesson_id = '3.1' AND card_position = 8;
UPDATE lesson_cards SET card_position = 8 WHERE lesson_id = '3.1' AND card_position = 7;
UPDATE lesson_cards SET card_position = 7 WHERE lesson_id = '3.1' AND card_position = 6;

-- Insert new "Example of internal void" image card at position 6
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, xp_value)
VALUES ('3.1', 3, 6, 'image', '3.4_photo_2.webp', 'final-correct-media', '{"caption": "Example of internal void", "alt": "Example of an internal void on a construction site"}', 0);