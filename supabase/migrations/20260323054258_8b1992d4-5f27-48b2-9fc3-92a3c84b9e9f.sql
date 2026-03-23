
-- Temporarily shift cards to high positions to avoid unique constraint conflicts
UPDATE lesson_cards SET card_position = card_position + 100
WHERE lesson_id = '3.1' AND card_position >= 12;

-- Now set them back +1 from original
UPDATE lesson_cards SET card_position = card_position - 99
WHERE lesson_id = '3.1' AND card_position >= 112;

-- Update card 11: first bullet only, no title
UPDATE lesson_cards
SET content_json = '{"text":"Working at height includes working near unguarded openings, trenches, and floor voids."}'::jsonb
WHERE lesson_id = '3.1' AND card_position = 11;

-- Insert new card 12: second bullet with Remember This header
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, xp_value)
VALUES ('3.1', 3, 12, 'remember_this',
  '{"text":"There is NO minimum height — even ground-level work near a void counts as working at height.","title":"No Minimum Height"}'::jsonb,
  0);
