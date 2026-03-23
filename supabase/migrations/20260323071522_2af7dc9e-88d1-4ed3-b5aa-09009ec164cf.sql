
-- Shift cards 14 -> 15, 13 -> 14
UPDATE lesson_cards SET card_position = 15 WHERE lesson_id = '3.4' AND card_position = 14;
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.4' AND card_position = 13;

-- Insert new card 13
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, content_json, media_file, media_bucket, xp_value)
VALUES (
  '3.4', 3, 13, 'image',
  '{"alt": "Worker on ladder for short-duration task", "caption": "Ladders should only be used for short-duration, low-risk tasks."}'::jsonb,
  '/images/lessons/3.4_ladders_short_duration.webp',
  NULL,
  0
);
