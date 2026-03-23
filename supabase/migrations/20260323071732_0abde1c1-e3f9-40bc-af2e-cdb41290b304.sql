UPDATE lesson_cards
SET content_json = jsonb_set(
  jsonb_set(content_json, '{left_image}', '"/images/lessons/3.5_harness_only.webp"'),
  '{right_image}', '"/images/lessons/3.5_guardrails_harness.webp"'
)
WHERE lesson_id = '3.5' AND card_position = 6;