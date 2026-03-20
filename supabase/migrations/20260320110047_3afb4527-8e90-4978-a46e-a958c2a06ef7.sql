UPDATE lesson_cards
SET content_json = jsonb_build_object(
  'left', 'No goggles, no ear protection, no gloves — exposed to flying debris, loud noise, and chemical burns.',
  'right', 'Full PPE: goggles, ear defenders, gloves, dust mask — every hazard covered and protected.',
  'left_image', '/images/lessons/no-ppe.webp',
  'right_image', '/images/lessons/full-ppe.webp',
  'title', 'Which worker is protected?',
  'takeaway', 'Full PPE isn''t optional — each item protects against a specific hazard. Missing even one piece leaves you exposed.'
)
WHERE id = '75d1e411-9e5d-4d13-b71d-fe68da1562d6';