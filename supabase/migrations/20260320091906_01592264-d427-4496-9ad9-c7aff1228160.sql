UPDATE lesson_cards
SET content_json = jsonb_set(content_json, '{time_per_question}', '5')
WHERE id = 'c3002dfd-35a0-41cb-a33a-89d6770bb3c9';