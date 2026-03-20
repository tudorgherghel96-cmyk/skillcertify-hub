UPDATE lesson_cards
SET content_json = '{
  "items": [
    { "text": "Red Circle", "icon": "prohibition" },
    { "text": "Yellow Triangle", "icon": "warning" },
    { "text": "Blue Circle", "icon": "mandatory" },
    { "text": "Green Rectangle", "icon": "safe_condition" }
  ],
  "targets": ["Prohibition — Do NOT", "Warning — Danger", "Mandatory — You MUST", "Safe Condition — Safety info"]
}'::jsonb
WHERE id = '8628f6fa-a5a3-4499-861c-1c52b96cded6';