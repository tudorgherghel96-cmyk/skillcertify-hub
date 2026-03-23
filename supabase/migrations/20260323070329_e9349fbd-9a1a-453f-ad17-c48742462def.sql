
UPDATE lesson_cards 
SET content_json = '{"alt": "MEWPs authorised operators only", "caption": "MEWPs must only be operated by trained, authorised operators."}'::jsonb,
    media_file = '/images/lessons/3.4_mewps_authorised.webp',
    media_bucket = NULL
WHERE lesson_id = '3.4' AND card_position = 12;
