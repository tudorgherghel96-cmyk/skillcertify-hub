UPDATE lesson_cards
SET content_json = jsonb_set(content_json, '{text}', '"TRAFFIC MANAGEMENT: 1) Primary purpose is SEGREGATION — keeping pedestrians and vehicles apart 2) Dedicated pedestrian walkways must be clearly marked 3) One-way systems and speed limits control vehicle movement 4) Physical barriers separate work zones from traffic routes"')
WHERE lesson_id = '5.3' AND card_position = 5;