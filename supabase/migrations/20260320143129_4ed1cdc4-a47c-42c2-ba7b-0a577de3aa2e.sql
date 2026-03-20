UPDATE lesson_cards
SET media_file = '/images/lessons/ppe-site-sign.webp',
    media_bucket = NULL,
    content_json = '{"alt": "Hard hat and safety boots always required on site. Other PPE depends on risk assessment."}'::jsonb
WHERE id = '978e705e-ca83-4be0-a3ac-c96d9dfdc2c0';