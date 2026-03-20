-- Fix misplaced accident book image: revert 1.4 and update 1.5
UPDATE lesson_cards SET media_file = '1.4_photo_1.webp' WHERE id = '39df5470-890b-4961-8461-d2a7def4b8ad';
UPDATE lesson_cards SET media_file = '/images/accident-book-reporting.webp' WHERE id = 'b68092fa-ed99-4d08-9b7f-b0201f4507e1';