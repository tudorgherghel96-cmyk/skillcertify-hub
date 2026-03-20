-- 1. Remove caption from card 14, keep image only
UPDATE lesson_cards
SET content_json = '{"alt": "Reporting accidents and near misses"}'::jsonb
WHERE id = '9a10e6a5-d78d-4b13-9c47-82a54060c9be';

-- 2. Bump quiz (15→16) and lesson_complete (16→17)
UPDATE lesson_cards
SET card_position = card_position + 1
WHERE lesson_id = '1.5' AND card_position >= 15;

-- 3. Insert new remember_this card at position 15
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, xp_value)
VALUES (
  '1.5', 1, 15, 'remember_this',
  '{"text": "Near misses MUST be reported — they help prevent future accidents. Fractures, amputations, and injuries causing 7+ days off work must be reported under RIDDOR."}'::jsonb,
  5
);