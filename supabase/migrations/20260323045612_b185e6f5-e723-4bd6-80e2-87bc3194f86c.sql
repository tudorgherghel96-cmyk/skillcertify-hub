-- Swap images between card 7 and card 11 in lesson 2.4
-- Card 7 gets card 11's original bucket image
UPDATE lesson_cards SET media_file = '2.4_photo_2.webp', media_bucket = 'final-correct-media' WHERE lesson_id = '2.4' AND card_position = 7;
-- Card 11 gets the mechanical aids local image
UPDATE lesson_cards SET media_file = '/images/lessons/2.4_mechanical_aids.webp', media_bucket = NULL WHERE lesson_id = '2.4' AND card_position = 11;