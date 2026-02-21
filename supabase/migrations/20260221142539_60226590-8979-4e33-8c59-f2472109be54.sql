
-- ============================================================
-- Fix image-to-caption mismatches by swapping media_file values
-- DATA-ONLY migration: no schema changes
-- ============================================================

-- === LESSON 1.1 (Hazards and Risks) — 3-way rotation ===
-- pos 4 caption "Trailing cables": was wet floor (photo_1) → now trailing cables (photo_5)
-- pos 7 caption "Can you spot the hazards?": was brick stack (photo_2) → now wet floor (photo_1)
-- pos 16 caption "Materials stacked incorrectly": was trailing cables (photo_5) → now brick stack (photo_2)
UPDATE lesson_cards SET media_file = '1.1_photo_5.webp' WHERE lesson_id = '1.1' AND card_position = 4;
UPDATE lesson_cards SET media_file = '1.1_photo_1.webp' WHERE lesson_id = '1.1' AND card_position = 7;
UPDATE lesson_cards SET media_file = '1.1_photo_2.webp' WHERE lesson_id = '1.1' AND card_position = 16;

-- === LESSON 1.7 (Electrical Safety, Fire Safety & PPE) ===
-- pos 9 caption "Fire extinguisher types — know the colours": was live cable (photo_1) → now fire extinguishers (photo_5)
-- pos 21 caption "CO2 for ELECTRICAL fires...": was overhead cables (photo_2) → now live cable (photo_1) for electrical content
-- pos 23 caption "80dB hearing protection": was fire extinguishers (photo_5) → now hearing protection (4.3_photo_3)
UPDATE lesson_cards SET media_file = '1.7_photo_5.webp' WHERE lesson_id = '1.7' AND card_position = 9;
UPDATE lesson_cards SET media_file = '1.7_photo_1.webp' WHERE lesson_id = '1.7' AND card_position = 21;
UPDATE lesson_cards SET media_file = '4.3_photo_3.webp' WHERE lesson_id = '1.7' AND card_position = 23;

-- === LESSON 1.4 (Dynamic Risk Assessment) & 1.5 (Reporting Accidents) ===
-- 1.4 pos 12 caption "dynamic RA on the spot": was Accident/Near Miss cards (photo_2) → now dynamic conditions (1.6_photo_2)
-- 1.5 pos 14 caption "Near misses MUST be reported": was electrical hazard sign (photo_3) → now Accident/Near Miss cards (1.4_photo_2)
UPDATE lesson_cards SET media_file = '1.6_photo_2.webp' WHERE lesson_id = '1.4' AND card_position = 12;
UPDATE lesson_cards SET media_file = '1.4_photo_2.webp' WHERE lesson_id = '1.5' AND card_position = 14;

-- === LESSON 2.3 (TILE Assessment) & 2.4 (Team Lifting & Mechanical Aids) ===
-- 2.3 pos 7 caption "Assess the environment before lifting": was mechanical aids (2.3_photo_1) → now tidy vs cluttered (2.4_photo_1)
-- 2.4 pos 7 caption "Mechanical aids reduce manual handling risk": was tidy vs cluttered (2.4_photo_1) → now mechanical aids (2.3_photo_1)
UPDATE lesson_cards SET media_file = '2.4_photo_1.webp' WHERE lesson_id = '2.3' AND card_position = 7;
UPDATE lesson_cards SET media_file = '2.3_photo_1.webp' WHERE lesson_id = '2.4' AND card_position = 7;

-- 2.4 pos 11 caption "Wheelbarrows, sack trucks, pallet trucks": was gas cylinders (2.4_photo_2) → now pallet truck (2.3_photo_2)
UPDATE lesson_cards SET media_file = '2.3_photo_2.webp' WHERE lesson_id = '2.4' AND card_position = 11;
