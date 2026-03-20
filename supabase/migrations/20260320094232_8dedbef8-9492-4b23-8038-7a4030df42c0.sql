UPDATE lesson_cards
SET content_json = content_json || '{"layout": "triangle"}'::jsonb
WHERE id = '171d2556-9935-4b3b-b0cd-3fc6dba7000b';