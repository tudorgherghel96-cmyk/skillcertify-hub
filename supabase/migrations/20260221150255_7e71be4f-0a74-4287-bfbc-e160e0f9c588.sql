
-- ============================================================
-- BATCH FIX: All remaining image-caption mismatches
-- ============================================================

-- === 1.4/1.5/1.6 CLUSTER: Photos were numbered by original lesson order,
-- but DB lessons were reorganised. Fix by swapping media_file values. ===

-- 1.4 (Dynamic Risk Assessment)
-- pos 7: had 1.4_photo_1 (near miss hammer) → needs dynamic RA image
UPDATE lesson_cards SET media_file = '1.6_photo_1.webp'
WHERE lesson_id = '1.4' AND card_position = 7;

-- 1.5 (Accident Reporting)
-- pos 7: had 1.5_photo_2 (prohibition sign) → needs near miss/accident image
UPDATE lesson_cards SET media_file = '1.4_photo_1.webp'
WHERE lesson_id = '1.5' AND card_position = 7;

-- pos 13: had 1.5_photo_1 (all four signs) → needs RIDDOR graphic
UPDATE lesson_cards SET media_file = '1.4_photo_4.webp'
WHERE lesson_id = '1.5' AND card_position = 13;

-- 1.6 (Safety Signs)
-- pos 7: had 1.6_photo_1 (sunny vs rainy dynamic risk) → needs all four signs
UPDATE lesson_cards SET media_file = '1.5_photo_1.webp'
WHERE lesson_id = '1.6' AND card_position = 7;

-- pos 14: had 1.6_photo_2 (worker stopping work) → needs yellow warning triangle
UPDATE lesson_cards SET media_file = '1.5_photo_3.webp'
WHERE lesson_id = '1.6' AND card_position = 14;

-- pos 15: had 1.6_photo_3 (unexpected pipes) → needs green safe condition sign
UPDATE lesson_cards SET media_file = '1.5_photo_5.webp'
WHERE lesson_id = '1.6' AND card_position = 15;

-- === INDIVIDUAL FIXES ===

-- 1.2: swap pos 7 (site photo) ↔ pos 16 (clipboard RA form)
-- pos 7 caption "A completed risk assessment form" needs the clipboard image
-- pos 16 caption "RA by competent person" can use site photo
UPDATE lesson_cards SET media_file = '1.2_photo_1.webp'
WHERE lesson_id = '1.2' AND card_position = 7;

UPDATE lesson_cards SET media_file = '1.2_photo_2.webp'
WHERE lesson_id = '1.2' AND card_position = 16;

-- 1.3 pos 14: had 1.3_photo_3 (excavator near cables)
-- Caption "RAMS...workers must sign" → needs signing checklist image
UPDATE lesson_cards SET media_file = '1.3_photo_4.webp'
WHERE lesson_id = '1.3' AND card_position = 14;

-- 2.3 pos 14: had 2.3_photo_3 (reporting faulty equipment)
-- Caption "Plan the lift, feet apart..." → needs lifting technique image
-- Using 2.2_photo_4 (worker carrying box close to body) which matches "keep load close"
UPDATE lesson_cards SET media_file = '2.2_photo_4.webp'
WHERE lesson_id = '2.3' AND card_position = 14;
