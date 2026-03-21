UPDATE lesson_cards 
SET content_json = '{"left":"Bending at waist — rounded back, strain on spine.","right":"Bending at knees — straight back, legs take the load.","left_image":"/images/lessons/2.1_option_a.webp","right_image":"/images/lessons/2.1_option_b.webp"}'::jsonb,
    media_bucket = NULL
WHERE module_id = 2 AND lesson_id = '2.1' AND card_position = 11;