UPDATE lesson_cards
SET content_json = '{"alt": "Control measures for plant operations"}'::jsonb
WHERE lesson_id = '5.2' AND card_position = 11;