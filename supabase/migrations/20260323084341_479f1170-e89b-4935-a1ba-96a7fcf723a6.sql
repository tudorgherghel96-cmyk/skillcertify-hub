UPDATE lesson_cards
SET media_bucket = NULL,
    media_file = '/images/lessons/5.2_card10_hivis.webp',
    content_json = '{"alt": "Workers in high-visibility clothing near plant", "caption": "Workers must wear high-visibility clothing near plant to be seen by operators."}'::jsonb
WHERE lesson_id = '5.2' AND card_position = 10;