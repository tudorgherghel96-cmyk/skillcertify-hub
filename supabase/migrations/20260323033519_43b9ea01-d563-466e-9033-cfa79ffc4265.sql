UPDATE lesson_cards 
SET content_json = jsonb_set(
  content_json, 
  '{illustrations}', 
  '["/images/lessons/2.2_step_1.webp","/images/lessons/2.2_step_2.webp","/images/lessons/2.2_step_3.webp","/images/lessons/2.2_step_4.webp","/images/lessons/2.2_step_5.webp","/images/lessons/2.2_step_6.webp","/images/lessons/2.2_step_7.webp","/images/lessons/2.2_step_8.webp"]'::jsonb
)
WHERE lesson_id = '2.2' AND card_position = 6;