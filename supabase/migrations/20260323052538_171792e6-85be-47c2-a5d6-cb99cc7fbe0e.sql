
-- Remove the orphaned image-only card 11
DELETE FROM lesson_cards WHERE lesson_id = '3.1' AND card_position = 11 AND card_type = 'image';

-- Ensure card 12 has the correct content_json with the text the component reads
UPDATE lesson_cards
SET content_json = '{"text":"Working at height includes working near unguarded openings, trenches, and floor voids. There is NO minimum height — even ground-level work near a void counts as working at height.","title":"No Minimum Height"}'::jsonb,
    card_type = 'remember_this'
WHERE lesson_id = '3.1' AND card_position = 12;

-- Shift cards down to fill the gap from deleted card 11
UPDATE lesson_cards SET card_position = card_position - 1
WHERE lesson_id = '3.1' AND card_position >= 12;
