
-- Shift all cards at position >= 7 up by 3 to make room
UPDATE lesson_cards 
SET card_position = card_position + 3 
WHERE lesson_id = '2.2' AND card_position >= 7;

-- Card 7: Tap-to-Reveal (active recall of each step)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, xp_value, content_json)
VALUES ('2.2', 2, 7, 'tap_to_reveal', 10, '{
  "title": "Can you remember all 8 steps?",
  "layout": "grid",
  "panels": [
    {"front": "Step 1", "back": "Plan the lift", "icon": "/images/lessons/2.2_step_1.webp"},
    {"front": "Step 2", "back": "Feet shoulder-width apart", "icon": "/images/lessons/2.2_step_2.webp"},
    {"front": "Step 3", "back": "Bend knees, straight back", "icon": "/images/lessons/2.2_step_3.webp"},
    {"front": "Step 4", "back": "Firm grip with palms", "icon": "/images/lessons/2.2_step_4.webp"},
    {"front": "Step 5", "back": "Keep load close to body", "icon": "/images/lessons/2.2_step_5.webp"},
    {"front": "Step 6", "back": "Lift with LEGS", "icon": "/images/lessons/2.2_step_6.webp"},
    {"front": "Step 7", "back": "Move feet to turn (never twist)", "icon": "/images/lessons/2.2_step_7.webp"},
    {"front": "Step 8", "back": "Set down carefully", "icon": "/images/lessons/2.2_step_8.webp"}
  ]
}'::jsonb);

-- Card 8: Drag-and-Drop (sequence knowledge)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, xp_value, content_json)
VALUES ('2.2', 2, 8, 'drag_drop', 15, '{
  "items": ["Plan the lift", "Feet shoulder-width apart", "Bend knees, straight back", "Firm grip with palms", "Keep load close", "Lift with LEGS", "Move feet to turn", "Set down carefully"],
  "targets": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7", "Step 8"]
}'::jsonb);

-- Card 9: Speed Drill (rapid recall under pressure)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, xp_value, content_json)
VALUES ('2.2', 2, 9, 'speed_drill', 20, '{
  "time_per_question": 8,
  "questions": [
    {"question": "What is Step 1?", "options": ["Plan the lift", "Bend knees", "Firm grip", "Lift with legs"], "correct_index": 0},
    {"question": "What is Step 2?", "options": ["Set down carefully", "Feet shoulder-width apart", "Move feet to turn", "Plan the lift"], "correct_index": 1},
    {"question": "What is Step 3?", "options": ["Lift with legs", "Keep load close", "Bend knees, straight back", "Firm grip"], "correct_index": 2},
    {"question": "What is Step 4?", "options": ["Move feet to turn", "Firm grip with palms", "Plan the lift", "Set down carefully"], "correct_index": 1},
    {"question": "What is Step 5?", "options": ["Bend knees", "Lift with legs", "Keep load close to body", "Feet apart"], "correct_index": 2},
    {"question": "What is Step 6?", "options": ["Lift with LEGS", "Plan the lift", "Set down carefully", "Firm grip"], "correct_index": 0},
    {"question": "What is Step 7?", "options": ["Keep load close", "Bend knees", "Set down carefully", "Move feet to turn"], "correct_index": 3},
    {"question": "What is Step 8?", "options": ["Plan the lift", "Lift with legs", "Set down carefully", "Feet apart"], "correct_index": 2}
  ]
}'::jsonb);
