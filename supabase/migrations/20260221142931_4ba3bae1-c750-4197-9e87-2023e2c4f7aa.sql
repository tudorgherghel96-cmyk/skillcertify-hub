
-- ============================================================
-- Batch 2: Fix image-to-caption mismatches
-- ============================================================

-- === Scaffolding Safety 3.3: swap pos 5 (scafftag) ↔ pos 9 (full scaffold) ===
UPDATE lesson_cards SET media_file = '3.3_photo_1.webp' WHERE lesson_id = '3.3' AND card_position = 5;
UPDATE lesson_cards SET media_file = '3.3_photo_2.webp' WHERE lesson_id = '3.3' AND card_position = 9;

-- === Fragile Surfaces 3.4: swap pos 5 (void) ↔ pos 9 (fragile roof) ===
UPDATE lesson_cards SET media_file = '3.4_photo_1.webp' WHERE lesson_id = '3.4' AND card_position = 5;
UPDATE lesson_cards SET media_file = '3.4_photo_2.webp' WHERE lesson_id = '3.4' AND card_position = 9;

-- === COSHH 4.1: swap pos 6 (substances) ↔ pos 11 (GHS symbols) ===
UPDATE lesson_cards SET media_file = '4.1_photo_2.webp' WHERE lesson_id = '4.1' AND card_position = 6;
UPDATE lesson_cards SET media_file = '4.1_photo_1.webp' WHERE lesson_id = '4.1' AND card_position = 11;

-- === Asbestos 4.2: swap pos 4 (types infographic) ↔ pos 9 (warning signs) ===
UPDATE lesson_cards SET media_file = '4.2_photo_1.webp' WHERE lesson_id = '4.2' AND card_position = 4;
UPDATE lesson_cards SET media_file = '4.2_photo_2.webp' WHERE lesson_id = '4.2' AND card_position = 9;

-- === Asbestos 4.2 pos 10: image is CORRECT (cutaway), caption is WRONG ===
-- Exception: updating caption since drugs/alcohol text is in completely wrong lesson
UPDATE lesson_cards SET content_json = jsonb_set(content_json, '{caption}', '"Where asbestos is found in pre-2000 buildings — ceiling tiles, pipe lagging, roof sheets, floor tiles, and boiler insulation. Always assume materials contain asbestos until proven otherwise."')
WHERE lesson_id = '4.2' AND card_position = 10;

-- === Noise & Vibration 4.3 pos 5: mental health poster → hearing protection ===
UPDATE lesson_cards SET media_file = '4.3_photo_3.webp' WHERE lesson_id = '4.3' AND card_position = 5;

-- === Banksman 5.1: rotate all 3 image positions ===
-- pos 6 "hand signals": blind spots → banksman guiding
UPDATE lesson_cards SET media_file = '5.1_photo_2.webp' WHERE lesson_id = '5.1' AND card_position = 6;
-- pos 11 "exclusion zones": banksman → exclusion zone crane (from 5.2)
UPDATE lesson_cards SET media_file = '5.2_photo_1.webp' WHERE lesson_id = '5.1' AND card_position = 11;
-- pos 12 "blind spots/eye contact": → blind spots diagram
UPDATE lesson_cards SET media_file = '5.1_photo_1.webp' WHERE lesson_id = '5.1' AND card_position = 12;

-- === Machine Guarding 5.2: exclusion zone crane → emergency stop for LOTO ===
UPDATE lesson_cards SET media_file = '5.2_photo_3.webp' WHERE lesson_id = '5.2' AND card_position = 5;
-- pos 11 lost its image (photo_3 moved to pos 5), use banksman signals
UPDATE lesson_cards SET media_file = '5.2_photo_4.webp' WHERE lesson_id = '5.2' AND card_position = 11;
