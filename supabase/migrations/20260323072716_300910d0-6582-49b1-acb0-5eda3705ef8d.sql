UPDATE lesson_cards 
SET card_type = 'remember_this', 
    content_json = '{"text": "THREE TYPES OF ASBESTOS: 1) Blue (Crocidolite) — most dangerous 2) Brown (Amosite) — commonly found in insulation 3) White (Chrysotile) — most common, found in cement sheets and brake linings"}'::jsonb
WHERE lesson_id = '4.2' AND card_position = 9;