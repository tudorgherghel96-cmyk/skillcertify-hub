-- Delete current card 12 (remember_this)
DELETE FROM lesson_cards WHERE lesson_id = '3.1' AND card_position = 12 AND card_type = 'remember_this';

-- Shift card 13 (image) down to 12
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '3.1' AND card_position = 13 AND card_type = 'image';

-- Insert remember_this at position 13
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, xp_value)
VALUES ('3.1', 3, 13, 'remember_this', '{"title":"No Minimum Height","items":["Working at height includes working near unguarded openings, trenches, and floor voids.","There is NO minimum height — even 1 metre counts.","Report any defects in safety equipment immediately.","Cooperate with your employer''s safety policies and use equipment correctly."]}'::jsonb, 0);