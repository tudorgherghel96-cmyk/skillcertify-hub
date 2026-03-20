UPDATE lesson_cards SET card_position = card_position + 1 WHERE lesson_id = '1.7' AND card_position >= 6;

INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, xp_value, content_json)
VALUES ('1.7', 1, 6, 'remember_this', 5, '{"text": "THE FIRE TRIANGLE: Fire needs THREE things to burn — remove any one to stop the fire. 1) HEAT — sparks, hot works, electrical faults, friction 2) FUEL — wood, paper, flammable liquids, gas, dust 3) OXYGEN — always present in the air (about 21%). A fire extinguisher works by removing one side of the triangle."}'::jsonb);