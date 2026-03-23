-- Shift existing cards 14 → 15, 13 → 14, 12 → 13 to make room
UPDATE lesson_cards SET card_position = 15 WHERE lesson_id = '3.1' AND card_position = 14;
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.1' AND card_position = 13;
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '3.1' AND card_position = 12;

-- Card 11: image only
UPDATE lesson_cards SET content_json = '{"alt":"Working at height near floor openings","caption":""}'::jsonb WHERE lesson_id = '3.1' AND card_position = 11;

-- Insert new card 12 with the text content
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, xp_value)
VALUES ('3.1', 3, 12, 'remember_this', '{"title":"No Minimum Height","items":["Working at height includes working near unguarded openings, trenches, and floor voids.","There is NO minimum height — even 1 metre counts.","Report any defects in safety equipment immediately.","Cooperate with your employer''s safety policies and use equipment correctly."]}'::jsonb, 0);