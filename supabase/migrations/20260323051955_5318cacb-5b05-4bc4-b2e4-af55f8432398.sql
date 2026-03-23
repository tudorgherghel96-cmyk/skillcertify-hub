-- Update card 12: new image + convert to remember_this with the content from card 13
UPDATE lesson_cards 
SET media_file = '/images/lessons/3.1_voids_openings.webp', 
    media_bucket = NULL,
    card_type = 'remember_this',
    content_json = '{"title":"No Minimum Height","items":["Working at height includes working near unguarded openings, trenches, and floor voids.","There is NO minimum height — even 1 metre counts.","Report any defects in safety equipment immediately.","Cooperate with your employer''s safety policies and use equipment correctly."]}'::jsonb
WHERE lesson_id = '3.1' AND card_position = 12;

-- Delete card 13 (the old remember_this)
DELETE FROM lesson_cards WHERE lesson_id = '3.1' AND card_position = 13 AND card_type = 'remember_this';

-- Shift remaining cards down
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '3.1' AND card_position = 14;
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.1' AND card_position = 15;