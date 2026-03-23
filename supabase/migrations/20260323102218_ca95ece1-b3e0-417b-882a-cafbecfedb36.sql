-- FIX 2: Reassign quiz questions to correct lessons
-- FIX 11: Update PPE hierarchy
-- FIX 14: Update scaffold inspection wording

-- ============ MODULE 3 QUIZ FIXES ============

-- 3.3: Currently has fall protection hierarchy questions → replace with scaffolding-focused quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "Who is allowed to erect scaffolding on a construction site?",
      "options": ["a) Any experienced worker", "b) A competent, trained scaffolder", "c) The site manager", "d) Any worker with a CSCS card"],
      "correct": "b",
      "explanation": "Only competent, trained scaffolders are permitted to erect, alter, or dismantle scaffolding.",
      "tip": "TEST TIP: Scaffolding work must always be done by a COMPETENT person."
    },
    {
      "question": "What are the THREE main components of scaffold edge protection?",
      "options": ["a) Guardrails, mid-rails, and toe boards", "b) Ladders, platforms, and nets", "c) Handrails, steps, and gates", "d) Barriers, cones, and tape"],
      "correct": "a",
      "explanation": "Guardrails (top), mid-rails (middle), and toe boards (bottom) are the three components of scaffold edge protection.",
      "tip": "TEST TIP: Remember — top, middle, bottom: guardrail, mid-rail, toe board."
    },
    {
      "question": "How often must scaffolding be inspected at minimum?",
      "options": ["a) At intervals not exceeding 7 days", "b) Every 14 days", "c) Once a month", "d) Only after bad weather"],
      "correct": "a",
      "explanation": "Scaffolding must be inspected before first use, at intervals not exceeding 7 days, and after any event that could affect its safety.",
      "tip": "TEST TIP: The key interval is 7 days maximum between inspections."
    },
    {
      "question": "What does a GREEN scaffold tag mean?",
      "options": ["a) Do not use — under construction", "b) Safe to use — inspected and passed", "c) Partially complete — use with caution", "d) Reserved for specific trades only"],
      "correct": "b",
      "explanation": "A green tag means the scaffold has been inspected and is safe to use. Red means do not use.",
      "tip": "TEST TIP: Green = Go (safe). Red = Stop (do not use)."
    },
    {
      "question": "Toe boards on scaffolding are used to:",
      "options": ["a) Provide a foothold for climbing", "b) Prevent materials falling off the edge", "c) Support the scaffold structure", "d) Mark the edge of the platform"],
      "correct": "b",
      "explanation": "Toe boards prevent tools, materials, and debris from falling off the scaffold platform onto workers below.",
      "tip": "TEST TIP: Toe boards protect people BELOW the scaffold."
    }
  ]
}'::jsonb WHERE id = 'd41c166f-a94c-4427-8ad5-ab3e8f6e7781';

-- 3.4: Currently has general WAH/regulations questions → replace with fragile surfaces quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "Which of the following is a fragile surface?",
      "options": ["a) Steel decking", "b) Concrete slab", "c) A rooflight", "d) Timber flooring"],
      "correct": "c",
      "explanation": "Rooflights (skylights) are a common fragile surface that cannot support a person''s weight.",
      "tip": "TEST TIP: Rooflights are one of the most common fragile surfaces on construction sites."
    },
    {
      "question": "When working near a fragile roof, you should:",
      "options": ["a) Walk carefully along the edges", "b) Test the surface by stepping on it gently", "c) Use crawling boards or staging to spread your weight", "d) Only work in dry weather"],
      "correct": "c",
      "explanation": "Crawling boards or staging must be used to spread your weight when working near fragile surfaces.",
      "tip": "TEST TIP: NEVER walk directly on a fragile surface — always use crawling boards."
    },
    {
      "question": "Fragile roof warning signs must be displayed:",
      "options": ["a) Only on the ground floor", "b) At access points to the roof", "c) Only inside the building", "d) Only when raining"],
      "correct": "b",
      "explanation": "Warning signs must be clearly visible at all access points to areas with fragile surfaces.",
      "tip": "TEST TIP: Workers must be warned BEFORE they reach the fragile area."
    },
    {
      "question": "An internal void (like an open lift shaft) should be protected by:",
      "options": ["a) Warning tape only", "b) A fixed, secured cover or guardrails", "c) A verbal warning to workers", "d) Placing tools near the edge as a reminder"],
      "correct": "b",
      "explanation": "Open voids must be physically protected with fixed covers or guardrails — verbal warnings alone are not sufficient.",
      "tip": "TEST TIP: Physical protection (covers/guardrails) is always required for voids."
    },
    {
      "question": "If you discover an unprotected opening or void on site, you should:",
      "options": ["a) Walk around it carefully", "b) Cover it with loose material", "c) Report it immediately and guard the area", "d) Ignore it if you are not working near it"],
      "correct": "c",
      "explanation": "Report unprotected openings immediately to your supervisor and guard the area to prevent others falling through.",
      "tip": "TEST TIP: Report AND guard — do both, not just one."
    }
  ]
}'::jsonb WHERE id = 'f37c2f78-a884-487a-937c-fd69c93555b9';

-- 3.5: Currently has ladder/scaffolding Qs → replace with fall protection hierarchy quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "The correct hierarchy for managing fall risks is:",
      "options": ["a) Arrest > Prevent > Avoid > Minimise", "b) Avoid > Prevent > Arrest > Minimise", "c) Minimise > Avoid > Prevent > Arrest", "d) Prevent > Arrest > Avoid > Minimise"],
      "correct": "b",
      "explanation": "The fall protection hierarchy is: AVOID working at height if possible, PREVENT falls with guardrails/edge protection, ARREST falls with harnesses, MINIMISE consequences with nets/airbags.",
      "tip": "TEST TIP: AVOID > PREVENT > ARREST > MINIMISE — in that order, always."
    },
    {
      "question": "A safety harness is an example of:",
      "options": ["a) Fall prevention", "b) Fall arrest", "c) Fall avoidance", "d) Fall minimisation"],
      "correct": "b",
      "explanation": "A safety harness arrests (stops) a fall after it has started. Guardrails PREVENT falls from starting.",
      "tip": "TEST TIP: Harness = arrest. Guardrails = prevention."
    },
    {
      "question": "Which is the MOST effective way to manage the risk of falls?",
      "options": ["a) Provide safety harnesses to all workers", "b) Install safety nets below the work area", "c) Avoid working at height altogether", "d) Give workers training on fall risks"],
      "correct": "c",
      "explanation": "Avoiding working at height is the most effective control — if you don''t work at height, you can''t fall.",
      "tip": "TEST TIP: The best protection is not being at height in the first place."
    },
    {
      "question": "Guardrails and edge protection are classified as:",
      "options": ["a) Fall arrest equipment", "b) Fall prevention measures", "c) Fall minimisation measures", "d) Personal protective equipment"],
      "correct": "b",
      "explanation": "Guardrails PREVENT falls by creating a physical barrier at the edge. They stop the fall from happening.",
      "tip": "TEST TIP: Prevention stops falls BEFORE they happen. Arrest stops falls AFTER they start."
    },
    {
      "question": "A defective safety harness should be:",
      "options": ["a) Used carefully until a replacement arrives", "b) Taken out of use immediately and reported", "c) Repaired on site by a colleague", "d) Used only for low-height work"],
      "correct": "b",
      "explanation": "Defective fall arrest equipment must be immediately removed from use and reported. Never use damaged safety equipment.",
      "tip": "TEST TIP: NEVER use defective equipment — remove it and report it."
    }
  ]
}'::jsonb WHERE id = '24cf66f0-bbbd-4586-b25d-6a8ed49af22f';

-- ============ MODULE 4 QUIZ FIXES ============

-- 4.2: Currently has drugs/alcohol/chemicals Qs → replace with asbestos quiz (from old 4.3)
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "If you discover suspected asbestos on site, you should:",
      "options": ["a) Remove it yourself if you have gloves", "b) Stop work, leave the area, and report it immediately", "c) Cover it with plastic sheeting", "d) Continue working but wear a dust mask"],
      "correct": "b",
      "explanation": "If you suspect asbestos, STOP work immediately, leave the area, and report it to your supervisor. Only licensed contractors can remove asbestos.",
      "tip": "TEST TIP: Stop, leave, report — NEVER touch suspected asbestos."
    },
    {
      "question": "Which disease is linked to asbestos exposure?",
      "options": ["a) Silicosis", "b) Mesothelioma", "c) Leptospirosis", "d) Dermatitis"],
      "correct": "b",
      "explanation": "Mesothelioma is a cancer of the lung lining caused by inhaling asbestos fibres. It can take 15-60 years to develop.",
      "tip": "TEST TIP: Asbestos causes mesothelioma, asbestosis, and lung cancer."
    },
    {
      "question": "The three types of asbestos commonly found are:",
      "options": ["a) Red, green, and yellow", "b) White (chrysotile), brown (amosite), and blue (crocidolite)", "c) Type A, Type B, and Type C", "d) Natural, synthetic, and composite"],
      "correct": "b",
      "explanation": "White (chrysotile), brown (amosite), and blue (crocidolite) are the three main types. ALL types are dangerous.",
      "tip": "TEST TIP: White, brown, blue — ALL are equally dangerous and banned in the UK."
    },
    {
      "question": "Asbestos is most dangerous when it is:",
      "options": ["a) Wet", "b) Painted over", "c) Disturbed and fibres become airborne", "d) In a sealed container"],
      "correct": "c",
      "explanation": "Asbestos is most dangerous when disturbed because the microscopic fibres become airborne and can be inhaled.",
      "tip": "TEST TIP: Undisturbed asbestos in good condition may be safe to leave in place."
    },
    {
      "question": "Who is allowed to remove licensed asbestos?",
      "options": ["a) Any CSCS card holder", "b) The site manager", "c) A licensed asbestos removal contractor", "d) Anyone with the right PPE"],
      "correct": "c",
      "explanation": "Only licensed asbestos removal contractors can remove licensed asbestos. This is a legal requirement.",
      "tip": "TEST TIP: Licensed removal = licensed contractor. No exceptions."
    }
  ]
}'::jsonb WHERE id = '9ce94443-478c-4777-b702-f868bf9f882b';

-- 4.3: Currently has asbestos Qs → replace with noise and vibration quiz (from old 4.4)
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "At what noise level is hearing protection MANDATORY?",
      "options": ["a) 70 dB", "b) 80 dB", "c) 85 dB", "d) 90 dB"],
      "correct": "c",
      "explanation": "Hearing protection is mandatory at 85 dB (the upper exposure action value). At 80 dB, it must be made available.",
      "tip": "TEST TIP: 80 dB = available. 85 dB = MANDATORY."
    },
    {
      "question": "Long-term exposure to excessive noise can cause:",
      "options": ["a) Dermatitis", "b) Permanent hearing loss and tinnitus", "c) Silicosis", "d) Vibration white finger"],
      "correct": "b",
      "explanation": "Prolonged noise exposure causes noise-induced hearing loss (NIHL) and tinnitus (ringing in the ears). Both are irreversible.",
      "tip": "TEST TIP: Hearing damage is PERMANENT — it cannot be repaired."
    },
    {
      "question": "HAVS (Hand-Arm Vibration Syndrome) can be prevented by:",
      "options": ["a) Working faster to reduce exposure time", "b) Limiting exposure time and using anti-vibration tools", "c) Wearing thicker gloves", "d) Only using tools in warm weather"],
      "correct": "b",
      "explanation": "Limiting exposure time, using low-vibration tools, and taking regular breaks are the main ways to prevent HAVS.",
      "tip": "TEST TIP: Rotate tasks and limit trigger time to reduce vibration exposure."
    },
    {
      "question": "Symptoms of HAVS include:",
      "options": ["a) Hearing loss", "b) Tingling, numbness, and white fingers", "c) Skin rashes", "d) Breathing difficulties"],
      "correct": "b",
      "explanation": "HAVS symptoms include tingling, numbness, loss of grip strength, and fingers turning white (vibration white finger).",
      "tip": "TEST TIP: White fingers + numbness + tingling = HAVS."
    },
    {
      "question": "Employers must provide hearing protection when noise levels reach:",
      "options": ["a) 70 dB", "b) 80 dB (lower action value)", "c) 85 dB (upper action value)", "d) 100 dB"],
      "correct": "b",
      "explanation": "At 80 dB (lower exposure action value), employers must make hearing protection available. At 85 dB it becomes mandatory.",
      "tip": "TEST TIP: Available at 80, mandatory at 85."
    }
  ]
}'::jsonb WHERE id = '1f45d171-2c9d-4992-8bfb-10d70905c28b';

-- 4.4: Currently has noise Qs → replace with dust and chemicals quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "Prolonged exposure to silica dust can cause:",
      "options": ["a) Asbestosis", "b) Dermatitis", "c) Silicosis", "d) Leptospirosis"],
      "correct": "c",
      "explanation": "Silicosis is a serious lung disease caused by inhaling silica dust, commonly produced when cutting concrete, stone, or brick.",
      "tip": "TEST TIP: Silica dust = silicosis. It is irreversible."
    },
    {
      "question": "Wet cement in contact with skin can cause:",
      "options": ["a) Frostbite", "b) Chemical burns and dermatitis", "c) Silicosis", "d) Heat stroke"],
      "correct": "b",
      "explanation": "Wet cement is alkaline and can cause severe chemical burns and occupational dermatitis if left in contact with skin.",
      "tip": "TEST TIP: Cement burns are CHEMICAL burns — wash immediately with clean water."
    },
    {
      "question": "RPE (Respiratory Protective Equipment) should be:",
      "options": ["a) Shared between workers to save costs", "b) Face-fit tested for each individual user", "c) Only used outdoors", "d) Used instead of dust suppression"],
      "correct": "b",
      "explanation": "RPE must be face-fit tested to ensure a proper seal. An ill-fitting mask provides little or no protection.",
      "tip": "TEST TIP: RPE must be face-fit tested — one size does NOT fit all."
    },
    {
      "question": "To reduce dust when cutting concrete or stone, you should:",
      "options": ["a) Cut faster to produce less dust", "b) Use water suppression or extraction", "c) Wear sunglasses", "d) Work in a windy area to blow dust away"],
      "correct": "b",
      "explanation": "Water suppression and on-tool extraction are the most effective methods to control dust at source.",
      "tip": "TEST TIP: Control dust at SOURCE — suppression and extraction are best."
    },
    {
      "question": "Occupational dermatitis is caused by:",
      "options": ["a) Loud noise", "b) Repeated skin contact with irritants like cement, solvents, or oils", "c) Working at height", "d) Vibration from power tools"],
      "correct": "b",
      "explanation": "Dermatitis is caused by repeated contact with substances that irritate or sensitise the skin, such as cement, epoxy resins, and solvents.",
      "tip": "TEST TIP: Barrier cream + gloves = protect your skin from dermatitis."
    }
  ]
}'::jsonb WHERE id = 'd220e677-bed5-482c-b30c-afd9431658c0';

-- 4.5: Currently has health surveillance/leptospirosis Qs → replace with drugs/alcohol quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "If you are taking prescribed medication that causes drowsiness, you should:",
      "options": ["a) Carry on as normal", "b) Tell your supervisor before starting work", "c) Take less medication", "d) Only work on ground level"],
      "correct": "b",
      "explanation": "You MUST inform your supervisor before starting work if prescribed medication could affect your ability to work safely.",
      "tip": "TEST TIP: Drowsy medication = tell your supervisor BEFORE starting work."
    },
    {
      "question": "The policy on drugs and alcohol on construction sites is:",
      "options": ["a) A small amount of alcohol is acceptable", "b) Zero tolerance — never work under the influence", "c) Only prohibited for machine operators", "d) Allowed during breaks"],
      "correct": "b",
      "explanation": "Construction sites operate a zero tolerance policy on drugs and alcohol. Working under the influence puts everyone at risk.",
      "tip": "TEST TIP: ZERO tolerance — no exceptions, no excuses."
    },
    {
      "question": "Drugs and alcohol impair a worker by:",
      "options": ["a) Improving concentration", "b) Slowing reaction times and impairing judgment", "c) Only affecting coordination", "d) Only being dangerous at height"],
      "correct": "b",
      "explanation": "Drugs and alcohol slow reaction times, impair judgment, reduce coordination, and increase the risk of accidents.",
      "tip": "TEST TIP: Impaired judgment + slow reactions = danger to everyone on site."
    },
    {
      "question": "If you suspect a colleague is under the influence on site, you should:",
      "options": ["a) Ignore it — it is not your business", "b) Report it to your supervisor immediately", "c) Ask them to leave quietly", "d) Wait until the end of the shift"],
      "correct": "b",
      "explanation": "You have a duty to report it immediately. An impaired worker is a danger to themselves and everyone around them.",
      "tip": "TEST TIP: Report immediately — you could save a life."
    },
    {
      "question": "A worker who has been drinking the night before and still feels the effects should:",
      "options": ["a) Drink coffee and start work", "b) Not come to work until fully sober and fit for duty", "c) Only do light duties", "d) Work but avoid machinery"],
      "correct": "b",
      "explanation": "If you are still feeling the effects of alcohol from the night before, you are NOT fit for work and should not attend site.",
      "tip": "TEST TIP: ''Morning after'' effects are just as dangerous as drinking on site."
    }
  ]
}'::jsonb WHERE id = '631e7683-60be-444e-b8d9-8c11759a1b74';

-- ============ MODULE 5 QUIZ FIXES ============

-- 5.3: Currently has electrical tools Qs → replace with traffic management quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "The primary purpose of traffic management on a construction site is to:",
      "options": ["a) Speed up deliveries", "b) Separate pedestrians from vehicles", "c) Reduce noise levels", "d) Prevent theft"],
      "correct": "b",
      "explanation": "The primary purpose of traffic management is SEGREGATION — keeping pedestrians and vehicles apart to prevent collisions.",
      "tip": "TEST TIP: Traffic management = SEGREGATION of people and vehicles."
    },
    {
      "question": "Pedestrian walkways on a construction site should be:",
      "options": ["a) Marked with informal signs", "b) Clearly marked, separated from vehicle routes, and well-lit", "c) Only used during daylight hours", "d) Shared with delivery vehicles when quiet"],
      "correct": "b",
      "explanation": "Pedestrian routes must be clearly marked, physically separated from vehicle routes, and adequately lit at all times.",
      "tip": "TEST TIP: Pedestrian routes must be SEPARATE, MARKED, and LIT."
    },
    {
      "question": "One-way traffic systems on construction sites help to:",
      "options": ["a) Increase vehicle speed", "b) Reduce the need for reversing", "c) Allow larger vehicles on site", "d) Reduce fuel costs"],
      "correct": "b",
      "explanation": "One-way systems reduce the need for reversing, which is one of the most dangerous vehicle movements on site.",
      "tip": "TEST TIP: Reversing is the biggest vehicle danger on site — one-way systems reduce it."
    },
    {
      "question": "Physical barriers between pedestrian and vehicle routes are used to:",
      "options": ["a) Keep the site tidy", "b) Prevent unauthorised access", "c) Physically prevent pedestrians entering vehicle zones", "d) Reduce wind on site"],
      "correct": "c",
      "explanation": "Physical barriers provide a definitive separation between pedestrian and vehicle zones, preventing accidental entry.",
      "tip": "TEST TIP: Physical barriers are more effective than signs alone."
    },
    {
      "question": "Speed limits on construction sites are important because:",
      "options": ["a) They reduce fuel consumption", "b) They reduce stopping distances and the severity of any collision", "c) They are only needed near offices", "d) They only apply to delivery vehicles"],
      "correct": "b",
      "explanation": "Speed limits reduce both the likelihood and severity of collisions, especially in areas where pedestrians and vehicles are close together.",
      "tip": "TEST TIP: Speed limits protect EVERYONE on site — not just drivers."
    }
  ]
}'::jsonb WHERE id = 'e9f091fe-f1b4-4406-a5aa-08a86b4b0182';

-- 5.4: Currently has vehicle/pedestrian Qs → replace with overhead services/buried utilities quiz
UPDATE public.lesson_cards SET content_json = '{
  "questions": [
    {
      "question": "Before any excavation work begins, you should:",
      "options": ["a) Ask a colleague for advice", "b) Start digging carefully", "c) Use a CAT scanner to locate buried services", "d) Check for warning signs only"],
      "correct": "c",
      "explanation": "A CAT (Cable Avoidance Tool) scanner must be used to locate buried cables and pipes before any excavation begins.",
      "tip": "TEST TIP: CAT scan BEFORE you dig — every time, no exceptions."
    },
    {
      "question": "Overhead power lines on a construction site are dangerous because:",
      "options": ["a) They can fall down in wind", "b) Electricity can arc across a gap without direct contact", "c) They block crane movements", "d) They are hard to see at night"],
      "correct": "b",
      "explanation": "High-voltage electricity can arc (jump) across gaps. You do not need to touch an overhead line to receive a fatal shock.",
      "tip": "TEST TIP: You do NOT need to touch power lines — electricity can JUMP across gaps."
    },
    {
      "question": "Goal posts or height restrictors near overhead power lines are used to:",
      "options": ["a) Mark the site entrance", "b) Prevent tall vehicles and equipment from entering the danger zone", "c) Support the power lines", "d) Provide lighting"],
      "correct": "b",
      "explanation": "Goal posts prevent tall vehicles, cranes, and equipment from getting close enough to overhead lines to cause an electrical strike.",
      "tip": "TEST TIP: Goal posts = physical barrier to keep tall equipment away from lines."
    },
    {
      "question": "If you strike a buried cable or pipe during excavation, you should:",
      "options": ["a) Try to repair it yourself", "b) Continue digging more carefully", "c) Stop work immediately and report it", "d) Cover it up and move to a different area"],
      "correct": "c",
      "explanation": "Stop work immediately, evacuate the area if gas or electricity is involved, and report the strike to your supervisor and the utility company.",
      "tip": "TEST TIP: Stop, evacuate, report — NEVER try to repair a struck service yourself."
    },
    {
      "question": "Service plans (utility drawings) should be checked:",
      "options": ["a) Only for large excavations", "b) Before ANY ground work or excavation begins", "c) Only in built-up areas", "d) Only if the client requests it"],
      "correct": "b",
      "explanation": "Service plans must be checked before ANY excavation or ground work, regardless of depth or location.",
      "tip": "TEST TIP: Check plans + CAT scan = safe digging procedure."
    }
  ]
}'::jsonb WHERE id = '98f20fc4-b1ee-45a5-9e59-cec6905118f4';

-- ============ FIX 11: PPE HIERARCHY ============
UPDATE public.lesson_cards SET content_json = '{
  "text": "HIERARCHY OF CONTROLS: 1) ELIMINATE the hazard completely 2) SUBSTITUTE with something less dangerous 3) ENGINEERING CONTROLS — physical barriers, ventilation, guards 4) ADMINISTRATIVE CONTROLS — training, signage, safe systems of work 5) PPE — personal protective equipment (LAST resort). PPE is the LEAST effective control measure."
}'::jsonb WHERE id = '845e9b83-ef75-4a25-8815-66bad34c0443';

-- ============ FIX 14: SCAFFOLD INSPECTION WORDING ============
UPDATE public.lesson_cards SET content_json = '{
  "text": "SCAFFOLD COMPONENTS: Guardrails (top), Mid-rails (middle), Toe boards (bottom). INSPECTION REQUIRED: 1) Before first use 2) At intervals not exceeding 7 days 3) After any event liable to jeopardise safety (bad weather, alteration, damage, or anything affecting stability). Must be done by a COMPETENT person only."
}'::jsonb WHERE id = '9f1a7a5f-2dbe-4772-924a-6a1dc59417c3';

-- ============ FIX 12: NEW LESSON 5.5 — CONFINED SPACES ============
INSERT INTO public.lesson_cards (module_id, lesson_id, card_position, card_type, content_json, xp_value) VALUES
(5, '5.5', 1, 'hero', '{"title": "Confined Spaces"}'::jsonb, 0),
(5, '5.5', 2, 'key_term', '{"term": "Confined Space", "definition": "Any enclosed or partially enclosed space with a foreseeable risk of injury from hazardous substances, lack of oxygen, or dangerous conditions. Examples include tanks, silos, manholes, sewers, trenches, and unventilated rooms."}'::jsonb, 5),
(5, '5.5', 3, 'remember_this', '{"text": "CONFINED SPACE RULES: 1) A PERMIT TO WORK is REQUIRED before entering any confined space 2) Atmospheric testing must be done BEFORE and DURING entry 3) A trained rescue team must be on STANDBY at all times 4) NEVER enter a confined space alone"}'::jsonb, 5),
(5, '5.5', 4, 'image', '{"caption": "Examples of confined spaces: tanks, silos, manholes, sewers, trenches, and unventilated rooms. All require a permit to work before entry.", "alt": "Confined space examples"}'::jsonb, 0),
(5, '5.5', 5, 'test_tip', '{"text": "TEST TIP: NEVER enter a confined space without a permit to work. This is one of the most commonly tested topics in the CSCS exam."}'::jsonb, 5),
(5, '5.5', 6, 'remember_this', '{"text": "RESCUE IN CONFINED SPACES: NEVER enter a confined space to rescue someone without proper equipment and training. More people die trying to rescue others in confined spaces than die from the original incident. Always wait for the trained rescue team."}'::jsonb, 5),
(5, '5.5', 7, 'quick_check', '{"question": "Before entering a confined space, you should:", "options": ["a) Check with a colleague if it looks safe", "b) Ensure a permit to work is in place and atmosphere has been tested", "c) Put on a dust mask and enter carefully", "d) Enter quickly to minimise time inside"], "correct": "b", "explanation": "A permit to work must be in place and the atmosphere must be tested before ANY entry into a confined space."}'::jsonb, 10),
(5, '5.5', 8, 'quiz_card', '{
  "questions": [
    {
      "question": "A confined space is defined as:",
      "options": ["a) Any small room", "b) An enclosed or partially enclosed space with foreseeable risk of injury", "c) Only underground spaces", "d) Any space without windows"],
      "correct": "b",
      "explanation": "A confined space is any enclosed or partially enclosed area where there is a foreseeable risk from hazardous substances, lack of oxygen, or dangerous conditions."
    },
    {
      "question": "Before entering a confined space, you MUST have:",
      "options": ["a) A torch", "b) A permit to work", "c) A hard hat", "d) Permission from a colleague"],
      "correct": "b",
      "explanation": "A permit to work is legally required before entering any confined space. It ensures all safety measures are in place."
    },
    {
      "question": "Atmospheric testing in a confined space checks for:",
      "options": ["a) Temperature only", "b) Oxygen levels, toxic gases, and flammable vapours", "c) Dust levels only", "d) Noise levels"],
      "correct": "b",
      "explanation": "Atmospheric testing checks oxygen levels (too low or too high), toxic gases (e.g. hydrogen sulphide), and flammable vapours."
    },
    {
      "question": "If someone collapses in a confined space, you should:",
      "options": ["a) Enter immediately to help them", "b) Call for the trained rescue team — do NOT enter without proper equipment", "c) Shout at them to wake up", "d) Lower food and water"],
      "correct": "b",
      "explanation": "NEVER enter a confined space to rescue someone without proper equipment and training. More rescuers die than original victims."
    },
    {
      "question": "Which of the following is an example of a confined space?",
      "options": ["a) An open-plan office", "b) A manhole or sewer", "c) A scaffolding platform", "d) A car park"],
      "correct": "b",
      "explanation": "Manholes, sewers, tanks, silos, and trenches are all examples of confined spaces."
    }
  ]
}'::jsonb, 15),
(5, '5.5', 9, 'lesson_complete', '{"title": "Confined Spaces Complete!", "summary": "You now understand confined space hazards, permit to work requirements, atmospheric testing, and rescue procedures."}'::jsonb, 0);

-- ============ FIX 13: NEW LESSON 1.9 — CDM 2015 ============
INSERT INTO public.lesson_cards (module_id, lesson_id, card_position, card_type, content_json, xp_value) VALUES
(1, '1.9', 1, 'hero', '{"title": "CDM 2015: Who Does What"}'::jsonb, 0),
(1, '1.9', 2, 'key_term', '{"term": "CDM 2015", "definition": "Construction (Design and Management) Regulations 2015. The main set of regulations for managing health, safety, and welfare on ALL construction projects in the UK."}'::jsonb, 5),
(1, '1.9', 3, 'remember_this', '{"text": "CDM 2015 DUTY HOLDERS: 1) CLIENT — has OVERALL responsibility for ensuring the project is properly managed 2) PRINCIPAL DESIGNER — plans and manages pre-construction health and safety 3) PRINCIPAL CONTRACTOR — plans and manages health and safety DURING construction 4) CONTRACTORS — plan and manage their own work safely 5) DESIGNERS — eliminate and reduce risks through design 6) WORKERS — cooperate, report hazards, follow site rules"}'::jsonb, 5),
(1, '1.9', 4, 'test_tip', '{"text": "TEST TIP: The CLIENT has OVERALL responsibility for ensuring a construction project is properly managed. This is one of the most commonly tested CDM questions."}'::jsonb, 5),
(1, '1.9', 5, 'split_screen', '{"title": "Pre-construction vs Construction", "left_text": "PRINCIPAL DESIGNER\\n• Plans pre-construction phase\\n• Identifies and manages design risks\\n• Prepares the health and safety file", "right_text": "PRINCIPAL CONTRACTOR\\n• Plans construction phase\\n• Manages site safety day-to-day\\n• Creates the construction phase plan"}'::jsonb, 5),
(1, '1.9', 6, 'remember_this', '{"text": "WORKERS'' DUTIES UNDER CDM: 1) Cooperate with your employer and others 2) Report any hazards or unsafe conditions 3) Follow all site rules and safety procedures 4) Use equipment and PPE as instructed 5) Do NOT put yourself or others at risk"}'::jsonb, 5),
(1, '1.9', 7, 'drag_drop', '{"items": ["Has overall project responsibility", "Plans pre-construction H&S", "Manages site safety during construction", "Must cooperate and report hazards", "Eliminates risks through design"], "targets": ["Client", "Principal Designer", "Principal Contractor", "Workers", "Designers"], "correct_pairs": {"Has overall project responsibility": "Client", "Plans pre-construction H&S": "Principal Designer", "Manages site safety during construction": "Principal Contractor", "Must cooperate and report hazards": "Workers", "Eliminates risks through design": "Designers"}}'::jsonb, 15),
(1, '1.9', 8, 'quiz_card', '{
  "questions": [
    {
      "question": "Under CDM 2015, who has OVERALL responsibility for ensuring a construction project is properly managed?",
      "options": ["a) The principal contractor", "b) The client", "c) The site manager", "d) The health and safety executive"],
      "correct": "b",
      "explanation": "The CLIENT has overall responsibility for ensuring the project is properly managed for health and safety."
    },
    {
      "question": "The Principal Designer is responsible for:",
      "options": ["a) Managing workers on site", "b) Planning and managing pre-construction health and safety", "c) Buying materials", "d) Hiring subcontractors"],
      "correct": "b",
      "explanation": "The Principal Designer plans and manages health and safety during the pre-construction phase and prepares the health and safety file."
    },
    {
      "question": "The construction phase plan is prepared by:",
      "options": ["a) The client", "b) The workers", "c) The principal contractor", "d) The local council"],
      "correct": "c",
      "explanation": "The Principal Contractor prepares the construction phase plan, which sets out how health and safety will be managed during the build."
    },
    {
      "question": "As a worker on a CDM project, your duty is to:",
      "options": ["a) Only follow instructions you agree with", "b) Cooperate with your employer, report hazards, and follow site rules", "c) Design the project safely", "d) Manage other workers"],
      "correct": "b",
      "explanation": "Workers must cooperate, report hazards, follow site rules, and use equipment as instructed."
    },
    {
      "question": "CDM 2015 applies to:",
      "options": ["a) Only large commercial projects", "b) Only projects lasting more than 30 days", "c) ALL construction projects in the UK", "d) Only projects with more than 20 workers"],
      "correct": "c",
      "explanation": "CDM 2015 applies to ALL construction projects, regardless of size or duration."
    }
  ]
}'::jsonb, 15),
(1, '1.9', 9, 'lesson_complete', '{"title": "CDM 2015 Complete!", "summary": "You now understand CDM 2015 duty holders and their responsibilities — from the Client''s overall duty to workers'' obligation to cooperate and report hazards."}'::jsonb, 0);