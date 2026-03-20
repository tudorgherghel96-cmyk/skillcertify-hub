DELETE FROM lesson_cards WHERE id = '39df5470-890b-4961-8461-d2a7def4b8ad';

UPDATE lesson_cards SET card_position = card_position - 1 WHERE lesson_id = '1.4' AND card_position > 7;