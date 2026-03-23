UPDATE lesson_cards
SET content_json = '{"text": "DRUGS, ALCOHOL & SUBSTANCE MISUSE: 1) Zero tolerance on site — never work under the influence 2) Impairs judgment and slows reaction times 3) Prescribed medication — if it causes drowsiness, MUST inform your supervisor BEFORE starting work"}'::jsonb
WHERE lesson_id = '4.5' AND card_position = 4;