
-- Step 1: Update card 17 to image-only (remove caption/test tip)
UPDATE lesson_cards
SET content_json = '{"alt": "Construction waste and services hazard"}'::jsonb,
    updated_at = now()
WHERE id = 'eb98277e-eba9-48d4-a390-5f7bf3f3bd3c';

-- Step 2: Bump lesson_complete 19→20
UPDATE lesson_cards
SET card_position = 20, updated_at = now()
WHERE id = 'a8a5d481-605c-405c-aa36-2145deb3b9bf';

-- Step 3: Bump quiz 18→19
UPDATE lesson_cards
SET card_position = 19, updated_at = now()
WHERE id = 'e81f4ddf-b792-4ef3-a3cd-55e2da73ff3b';

-- Step 4: Insert new card 18 with buried waste image and caption
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, content_json, xp_value)
VALUES (
  '1.1',
  1,
  18,
  'image',
  '/images/buried-waste-hazard.webp',
  '{"alt": "Buried waste hazard on construction site", "caption": "Waste and buried services are hidden hazards. TEST TIP: The exam tests whether you can identify BOTH visible and hidden hazards."}'::jsonb,
  0
);
