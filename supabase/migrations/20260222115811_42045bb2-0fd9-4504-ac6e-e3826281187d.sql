UPDATE lesson_cards SET card_type = 'scenario', content_json = '{
  "scenario": "Look at the image. Can you spot the hazards on this construction site?",
  "question": "Which of the following is the MOST significant hazard visible?",
  "options": [
    {"text": "Trailing cables across the walkway"},
    {"text": "Workers not wearing hi-vis clothing"},
    {"text": "Unsecured materials stored at height"},
    {"text": "No warning signs displayed"}
  ],
  "correct_index": 0,
  "feedback_correct": "Correct! Trailing cables are a major trip hazard and can also cause electrical injuries if damaged.",
  "feedback_wrong": {
    "1": "Hi-vis is important but trailing cables pose an immediate trip and electrical hazard.",
    "2": "Unsecured materials at height are dangerous, but the most visible hazard here is trailing cables.",
    "3": "Warning signs matter, but the immediate physical hazard of trailing cables is more significant."
  }
}'::jsonb WHERE id = '2fc42d71-88ac-4cff-a7b2-061a24277e51'