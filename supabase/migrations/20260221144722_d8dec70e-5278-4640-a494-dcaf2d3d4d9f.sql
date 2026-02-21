
-- === Ladders 3.2: swap pos 6 (photo_2) ↔ pos 10 (photo_1) ===
UPDATE lesson_cards SET media_file = '3.2_photo_1.webp' WHERE lesson_id = '3.2' AND card_position = 6;
UPDATE lesson_cards SET media_file = '3.2_photo_2.webp' WHERE lesson_id = '3.2' AND card_position = 10;

-- === Asbestos 4.2 pos 9: caption about flammable materials belongs in COSHH, not Asbestos ===
-- Fix caption to match asbestos context (image is 4.2_photo_2 = three types infographic)
UPDATE lesson_cards SET content_json = jsonb_set(content_json, '{caption}', '"Three types of asbestos: Blue (Crocidolite) — most dangerous, Brown (Amosite) — commonly found in insulation, White (Chrysotile) — most common, found in cement sheets and brake linings."')
WHERE lesson_id = '4.2' AND card_position = 9;

-- === Noise & Vibration 4.3 pos 10: caption about suspected asbestos belongs in Asbestos lesson ===
UPDATE lesson_cards SET content_json = jsonb_set(content_json, '{caption}', '"Prolonged noise exposure causes permanent hearing damage. The action levels: 80dB — hearing protection must be made available. 85dB — hearing protection is mandatory and exposure must be reduced."')
WHERE lesson_id = '4.3' AND card_position = 10;

-- === Noise & Vibration 4.3 pos 11: caption about chemical PPE/COSHH belongs in COSHH lesson ===
UPDATE lesson_cards SET content_json = jsonb_set(content_json, '{caption}', '"Hand-Arm Vibration Syndrome (HAVS) — caused by prolonged use of vibrating tools like breakers and grinders. Symptoms include tingling, numbness, and white fingers. Limit exposure time and use anti-vibration gloves."')
WHERE lesson_id = '4.3' AND card_position = 11;
