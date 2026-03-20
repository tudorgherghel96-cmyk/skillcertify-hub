UPDATE lesson_cards
SET content_json = '{
  "panels": [
    { "front": "RED CIRCLE", "back": "Prohibition — Do NOT", "icon": "prohibition" },
    { "front": "YELLOW TRIANGLE", "back": "Warning — Danger", "icon": "warning" },
    { "front": "BLUE CIRCLE", "back": "Mandatory — You MUST", "icon": "mandatory" },
    { "front": "GREEN RECTANGLE", "back": "Safe Condition — Safety info", "icon": "safe_condition" }
  ]
}'::jsonb
WHERE id = '6d32bbf9-5271-49f5-9643-06605f7f7617';