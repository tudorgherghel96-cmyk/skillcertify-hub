UPDATE lesson_cards 
SET content_json = jsonb_build_object(
  'left', 'Rounded back, jerky, twisting spine.',
  'left_image', '/images/lessons/2.2_bad_technique.webp',
  'right', 'Straight back, smooth legs, load close, feet move.',
  'right_image', '/images/lessons/2.2_good_technique.webp',
  'takeaway', 'Good technique protects your spine — straight back, bend knees, keep load close, and move your feet to turn.',
  'left_label', '✗ Wrong',
  'right_label', '✓ Right'
)
WHERE lesson_id = '2.2' AND card_position = 13;