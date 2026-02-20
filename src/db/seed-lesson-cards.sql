-- ============================================================
-- SEED: lesson_cards — all 21 lessons
-- Generated: 2026-02-20
-- Buckets: lesson-images | lesson-videos | old-content-images
-- NOTE: Cards marked MISSING in spec are intentionally omitted
-- ============================================================

-- Clear existing seed data (safe to re-run)
DELETE FROM lesson_cards;

-- ============================================================
-- LESSON 1.1 — HAZARDS AND RISKS
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.1', 1, 1, 'hero', 'hero-M1-L1-construction-site-hazards.jpeg', 'lesson-images', '{"title":"Hazards and Risks","subtitle":"Module 1 of 5","duration":"~4 min"}', NULL, NULL, 0),
('1.1', 1, 2, 'video', 'M1-L1-C01-hook-hard-hat.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.1', 1, 3, 'video', 'M1-L1-C02-teach-hazard.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.1', 1, 4, 'image', '1.1_photo_1.webp', 'old-content-images', '{"caption":"Trailing cables — a common site hazard"}', NULL, NULL, 0),
('1.1', 1, 5, 'video', 'M1-L1-C03-teach-risk.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.1', 1, 6, 'key_term', NULL, NULL, '{"term":"Hazard","definition":"Something with the potential to cause harm — the THING.","term2":"Risk","definition2":"The likelihood that harm will occur and how serious — what HAPPENS.","audio":true}', NULL, NULL, 3),
('1.1', 1, 7, 'image', '1.1_photo_2.webp', 'old-content-images', '{"caption":"Can you spot the hazards?"}', NULL, NULL, 0),
('1.1', 1, 8, 'video', 'M1-L1-C04-lean-in-exam.mp4', 'lesson-videos', '{}', 'lean_in', 'HAZARD = the THING. RISK = what HAPPENS.', 0),
('1.1', 1, 9, 'test_tip', NULL, NULL, '{"text":"EXAM PATTERN: The hazard is the THING you can see or touch. The risk is what HAPPENS because of it. Object/condition = hazard. Injury/outcome = risk."}', NULL, NULL, 5),
('1.1', 1, 10, 'video', 'M1-L1-C05-engage-site-scan.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.1', 1, 11, 'image', '1.1_photo_4.webp', 'old-content-images', '{"caption":"Multiple hazards in one scene"}', NULL, NULL, 0),
('1.1', 1, 12, 'video', 'M1-L1-C06-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.1', 1, 13, 'quick_check', NULL, NULL, '{"question":"A wet floor on a construction site is an example of:","options":["A risk","A hazard","An accident","A near miss"],"correct":1,"feedback_correct":"Correct! The wet floor is the THING that could cause harm.","feedback_wrong":{"0":"A wet floor is a condition, not an outcome.","2":"An accident has not happened yet.","3":"A near miss is an event, not a condition."}}', NULL, NULL, 10),
('1.1', 1, 14, 'video', 'M1-L1-C07-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.1', 1, 15, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.2","next_title":"Risk Assessments"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.2 — RISK ASSESSMENTS
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.2', 1, 1, 'hero', 'hero-M1-L2-risk-assessment-document.jpeg', 'lesson-images', '{"title":"Risk Assessments","subtitle":"Module 1 of 5","duration":"~5 min"}', NULL, NULL, 0),
('1.2', 1, 2, 'video', 'M1-L2-C01-hook-before-work.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 3, 'video', 'M1-L2-C02-teach-definition.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 4, 'broll', 'M1-L2-BR01-clipboard.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 5, 'video', 'M1-L2-C03-hold-up-5-steps.mp4', 'lesson-videos', '{}', 'hold_up', '1. Identify hazards 2. Who harmed? 3. How likely/serious? 4. Record findings 5. Review/update', 0),
('1.2', 1, 6, 'remember_this', NULL, NULL, '{"text":"5 STEPS OF RISK ASSESSMENT: 1) Identify the hazards. 2) Who might be harmed and how? 3) Evaluate the risk — how likely, how serious? 4) Record your findings. 5) Review and update regularly."}', NULL, NULL, 5),
('1.2', 1, 7, 'image', '1.2_photo_2.webp', 'old-content-images', '{"caption":"A completed risk assessment form"}', NULL, NULL, 0),
('1.2', 1, 8, 'video', 'M1-L2-C04-teach-employer.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 9, 'broll', 'M1-L2-BR02-noticeboard.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 10, 'video', 'M1-L2-C05-engage-workshop.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 11, 'video', 'M1-L2-C06-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.2', 1, 12, 'drag_drop', NULL, NULL, '{"items":["Trailing cables","Unmarked bottles","Blocked doorway","No gloves"],"targets":["Trip and fall","Chemical exposure","Cannot escape in emergency","Skin contact injury"]}', NULL, NULL, 20),
('1.2', 1, 13, 'video', 'M1-L2-C08-lean-in-test-tip.mp4', 'lesson-videos', '{}', 'lean_in', 'Responsible for risk assessment = EMPLOYER. Always.', 0),
('1.2', 1, 14, 'test_tip', NULL, NULL, '{"text":"WHO does the risk assessment? EMPLOYER. Always. Not the worker, not the supervisor. The EMPLOYER has the legal duty."}', NULL, NULL, 5),
('1.2', 1, 15, 'video', 'M1-L2-C07-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.2', 1, 16, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.3","next_title":"Method Statements"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.3 — METHOD STATEMENTS
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.3', 1, 1, 'hero', 'hero-M1-L3-method-statement.jpeg', 'lesson-images', '{"title":"Method Statements","subtitle":"Module 1 of 5","duration":"~3 min"}', NULL, NULL, 0),
('1.3', 1, 2, 'video', 'M1-L3-C01-hook-document-drop.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.3', 1, 3, 'video', 'M1-L3-C02-teach-definition.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.3', 1, 4, 'broll', 'M1-L3-BR01-trench.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.3', 1, 5, 'video', 'M1-L3-C03-teach-rams.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.3', 1, 6, 'key_term', NULL, NULL, '{"term":"RAMS","definition":"Risk Assessment and Method Statement. RA = WHAT could go wrong. MS = HOW to do it safely.","audio":true}', NULL, NULL, 3),
('1.3', 1, 7, 'image', '1.3_photo_2.webp', 'old-content-images', '{"caption":"A method statement in practice"}', NULL, NULL, 0),
('1.3', 1, 8, 'remember_this', NULL, NULL, '{"text":"RISK ASSESSMENT vs METHOD STATEMENT: Risk assessment = identifies WHAT hazards exist. Method statement = describes HOW to do the work safely. Together = RAMS."}', NULL, NULL, 5),
('1.3', 1, 9, 'video', 'M1-L3-C04-lean-in-rams.mp4', 'lesson-videos', '{}', 'lean_in', 'Risk assessment = WHAT. Method statement = HOW.', 0),
('1.3', 1, 10, 'video', 'M1-L3-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.3', 1, 11, 'quick_check', NULL, NULL, '{"question":"A method statement describes:","options":["What hazards exist","How to do a job safely step by step","Who is responsible for safety","When to stop work"],"correct":1,"feedback_correct":"Correct! A method statement is a step-by-step safe work plan.","feedback_wrong":{"0":"That is a risk assessment.","2":"That is general duty, not a method statement.","3":"That is a dynamic risk assessment."}}', NULL, NULL, 10),
('1.3', 1, 12, 'video', 'M1-L3-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.3', 1, 13, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.4","next_title":"Dynamic Risk Assessment"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.4 — DYNAMIC RISK ASSESSMENT
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.4', 1, 1, 'hero', 'hero-M1-L4-dynamic-risk-assessment.jpeg', 'lesson-images', '{"title":"Dynamic Risk Assessment","subtitle":"Module 1 of 5","duration":"~3 min"}', NULL, NULL, 0),
('1.4', 1, 2, 'video', 'M1-L4-C01-hook-sudden-stop.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.4', 1, 3, 'video', 'M1-L4-C02-teach-stop-think-act.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.4', 1, 4, 'remember_this', NULL, NULL, '{"text":"DYNAMIC RISK ASSESSMENT: STOP — pause and observe. THINK — identify new hazards. ACT — fix it, report it, or do not start."}', NULL, NULL, 5),
('1.4', 1, 5, 'video', 'M1-L4-C03-teach-your-responsibility.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.4', 1, 6, 'broll', 'M1-L4-BR01-rain-conditions.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.4', 1, 7, 'image', '1.4_photo_1.webp', 'old-content-images', '{"caption":"Changing conditions require reassessment"}', NULL, NULL, 0),
('1.4', 1, 8, 'video', 'M1-L4-C04-lean-in-exam-tip.mp4', 'lesson-videos', '{}', 'lean_in', 'Changed conditions = STOP and REPORT.', 0),
('1.4', 1, 9, 'video', 'M1-L4-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.4', 1, 10, 'scenario', NULL, NULL, '{"scenario":"You arrive at your work area. Yesterday the ground was dry. Today there is a large puddle near the electrical supply cable.","options":["Carry on carefully","Move the cable yourself","Stop work and report","Put on rubber boots"],"correct":2,"feedback_correct":"Correct! Changed conditions near electricity = stop and report immediately.","feedback_wrong":{"0":"Changed conditions = stop.","1":"Never move electrical equipment yourself.","3":"Boots do not make electricity safe."}}', NULL, NULL, 10),
('1.4', 1, 11, 'video', 'M1-L4-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.4', 1, 12, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.5","next_title":"Reporting Accidents and Near Misses"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.5 — REPORTING ACCIDENTS
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.5', 1, 1, 'hero', 'hero-M1-L5-accident-reporting.jpeg', 'lesson-images', '{"title":"Reporting Accidents and Near Misses","subtitle":"Module 1 of 5","duration":"~4 min"}', NULL, NULL, 0),
('1.5', 1, 2, 'video', 'M1-L5-C01-hook-falling-brick.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.5', 1, 3, 'video', 'M1-L5-C02-teach-near-miss.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.5', 1, 4, 'key_term', NULL, NULL, '{"term":"Near Miss","definition":"An event that could have caused harm but did not. Must always be reported.","term2":"RIDDOR","definition2":"Reporting of Injuries, Diseases and Dangerous Occurrences Regulations.","audio":true}', NULL, NULL, 3),
('1.5', 1, 5, 'video', 'M1-L5-C03-teach-riddor.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.5', 1, 6, 'broll', 'M1-L5-BR01-accident-book.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.5', 1, 7, 'image', '1.5_photo_2.webp', 'old-content-images', '{"caption":"The accident book — every incident recorded"}', NULL, NULL, 0),
('1.5', 1, 8, 'remember_this', NULL, NULL, '{"text":"ALL accidents AND near misses must be reported. RIDDOR applies to: deaths, major injuries, over-7-day injuries, dangerous occurrences, diseases. EMPLOYER reports to the HSE."}', NULL, NULL, 5),
('1.5', 1, 9, 'video', 'M1-L5-C04-lean-in-who-reports.mp4', 'lesson-videos', '{}', 'lean_in', 'RIDDOR reporting = EMPLOYER to HSE.', 0),
('1.5', 1, 10, 'video', 'M1-L5-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.5', 1, 11, 'quick_check', NULL, NULL, '{"question":"A brick falls from scaffolding but misses all workers. This is:","options":["Not reportable","An accident","A near miss","A hazard"],"correct":2,"feedback_correct":"Correct! Nobody was hurt but it could have caused harm.","feedback_wrong":{"0":"All near misses must be reported.","1":"Nobody was hurt — it is a near miss.","3":"The unsecured brick is the hazard, the event is a near miss."}}', NULL, NULL, 10),
('1.5', 1, 12, 'video', 'M1-L5-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.5', 1, 13, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.6","next_title":"Safety Signs and Symbols"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.6 — SAFETY SIGNS
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.6', 1, 1, 'hero', 'hero-M1-L6-safety-signs.jpeg', 'lesson-images', '{"title":"Safety Signs and Symbols","subtitle":"Module 1 of 5","duration":"~5 min"}', NULL, NULL, 0),
('1.6', 1, 2, 'video', 'M1-L6-C01-hook-four-signs.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.6', 1, 3, 'video', 'M1-L6-C02-teach-red-yellow.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.6', 1, 4, 'video', 'M1-L6-C03-teach-blue-green.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.6', 1, 5, 'tap_to_reveal', NULL, NULL, '{"panels":[{"label":"RED CIRCLE","content":"Prohibition — Do NOT"},{"label":"YELLOW TRIANGLE","content":"Warning — Danger"},{"label":"BLUE CIRCLE","content":"Mandatory — You MUST"},{"label":"GREEN RECTANGLE","content":"Safe Condition — Safety info"}]}', NULL, NULL, 12),
('1.6', 1, 6, 'broll', 'M1-L6-BR01-signs-on-site.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.6', 1, 7, 'image', '1.6_photo_1.webp', 'old-content-images', '{"caption":"Construction site safety signs"}', NULL, NULL, 0),
('1.6', 1, 8, 'video', 'M1-L6-C04-lean-in-colour.mp4', 'lesson-videos', '{}', 'lean_in', 'Colour IS meaning. Red=stop. Yellow=danger. Blue=must. Green=safe.', 0),
('1.6', 1, 9, 'drag_drop', NULL, NULL, '{"items":["Red circle sign","Yellow triangle sign","Blue circle sign","Green rectangle sign"],"targets":["Prohibition","Warning","Mandatory","Safe Condition"]}', NULL, NULL, 20),
('1.6', 1, 10, 'video', 'M1-L6-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.6', 1, 11, 'quick_check', NULL, NULL, '{"question":"A blue circle safety sign means:","options":["Warning — danger ahead","You must NOT do this","You MUST do this","Safe area"],"correct":2,"feedback_correct":"Correct! Blue circle = mandatory.","feedback_wrong":{"0":"That is yellow triangle.","1":"That is red circle with line.","3":"That is green rectangle."}}', NULL, NULL, 10),
('1.6', 1, 12, 'video', 'M1-L6-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.6', 1, 13, 'speed_drill', NULL, NULL, '{"questions":[{"image":"red_circle","answer":"Prohibition"},{"image":"yellow_triangle","answer":"Warning"},{"image":"blue_circle","answer":"Mandatory"},{"image":"green_rectangle","answer":"Safe Condition"},{"image":"blue_circle_2","answer":"Mandatory"},{"image":"red_circle_2","answer":"Prohibition"}],"time_per_question":3}', NULL, NULL, 20),
('1.6', 1, 14, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.7","next_title":"Electrical Safety, Fire Safety & PPE"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.7 — ELECTRICAL, FIRE, PPE
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.7', 1, 1, 'hero', 'hero-M1-L7-electrical-fire-ppe.jpeg', 'lesson-images', '{"title":"Electrical Safety, Fire Safety & PPE","subtitle":"Module 1 of 5","duration":"~7 min"}', NULL, NULL, 0),
('1.7', 1, 2, 'video', 'M1-L7-C01-hook-yellow-plug.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 3, 'video', 'M1-L7-C02-teach-110v.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 4, 'remember_this', NULL, NULL, '{"text":"ELECTRICAL SAFETY: 110V (yellow plug) on construction sites, not 240V. Always: 1) Visual check 2) Use an RCD 3) Never in wet conditions."}', NULL, NULL, 5),
('1.7', 1, 5, 'video', 'M1-L7-C03-hold-up-fire-triangle.mp4', 'lesson-videos', '{}', 'hold_up', 'FIRE TRIANGLE: HEAT + FUEL + OXYGEN = FIRE. Remove any one = fire goes out.', 0),
('1.7', 1, 6, 'tap_to_reveal', NULL, NULL, '{"panels":[{"label":"Corner 1","content":"HEAT"},{"label":"Corner 2","content":"FUEL"},{"label":"Corner 3","content":"OXYGEN"},{"label":"Centre","content":"Remove any one to stop the fire"}]}', NULL, NULL, 12),
('1.7', 1, 7, 'video', 'M1-L7-C04-teach-extinguishers.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 8, 'broll', 'M1-L7-BR01-extinguishers.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 9, 'image', '1.7_photo_1.webp', 'old-content-images', '{"caption":"Fire extinguisher types — know the colours"}', NULL, NULL, 0),
('1.7', 1, 10, 'drag_drop', NULL, NULL, '{"items":["Paper/wood fire","Flammable liquid","Electrical fire","Multi-purpose","Cooking oil"],"targets":["Water","Foam","CO2","Powder","Wet Chemical"]}', NULL, NULL, 25),
('1.7', 1, 11, 'video', 'M1-L7-C05-lean-in-co2.mp4', 'lesson-videos', '{}', 'lean_in', 'Electrical fire → CO2 extinguisher. NEVER water.', 0),
('1.7', 1, 12, 'video', 'M1-L7-C06-teach-ppe-hierarchy.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 13, 'broll', 'M1-L7-BR02-ppe-bench.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 14, 'image', '1.7_photo_4.webp', 'old-content-images', '{"caption":"PPE — the LAST line of defence"}', NULL, NULL, 0),
('1.7', 1, 15, 'remember_this', NULL, NULL, '{"text":"PPE HIERARCHY: 1) ELIMINATE 2) REDUCE 3) INFORM/TRAIN 4) PPE (LAST resort). PPE is the LEAST effective control measure."}', NULL, NULL, 5),
('1.7', 1, 16, 'video', 'M1-L7-C07-split-screen-ppe.mp4', 'lesson-videos', '{}', 'split_screen_compare', NULL, 0),
('1.7', 1, 17, 'split_screen', NULL, NULL, '{"left":"No goggles, no ear protection, no gloves — exposed.","right":"Full PPE: goggles, ear defenders, gloves, dust mask — protected."}', NULL, NULL, 5),
('1.7', 1, 18, 'video', 'M1-L7-C08-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.7', 1, 19, 'quick_check', NULL, NULL, '{"question":"Which fire extinguisher for an ELECTRICAL fire?","options":["Water","Foam","CO2","Wet chemical"],"correct":2,"feedback_correct":"Correct! CO2 for electrical.","feedback_wrong":{"0":"LETHAL on electrical fires.","1":"Not for electrical.","3":"That is for cooking oil."}}', NULL, NULL, 10),
('1.7', 1, 20, 'video', 'M1-L7-C09-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.7', 1, 21, 'lesson_complete', NULL, NULL, '{"next_lesson":"1.8","next_title":"Personal Hygiene on Site"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 1.8 — PERSONAL HYGIENE
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('1.8', 1, 1, 'hero', 'hero-M1-L8-hygiene-welfare.jpeg', 'lesson-images', '{"title":"Personal Hygiene on Site","subtitle":"Module 1 of 5","duration":"~3 min"}', NULL, NULL, 0),
('1.8', 1, 2, 'video', 'M1-L8-C01-hook-dirty-gloves.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.8', 1, 3, 'video', 'M1-L8-C02-teach-whats-on-hands.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.8', 1, 4, 'broll', 'M1-L8-BR01-welfare.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.8', 1, 5, 'image', '1.8_photo_2.webp', 'old-content-images', '{"caption":"Welfare facilities on site"}', NULL, NULL, 0),
('1.8', 1, 6, 'video', 'M1-L8-C03-lean-in-weils.mp4', 'lesson-videos', '{}', 'lean_in', 'Weil''s disease = rat urine. In puddles/mud. Can be fatal.', 0),
('1.8', 1, 7, 'remember_this', NULL, NULL, '{"text":"HYGIENE: Wash hands before eating. Weil''s disease from rat urine. Cement causes dermatitis/burns. Welfare: running water, soap, toilets, eating area."}', NULL, NULL, 5),
('1.8', 1, 8, 'video', 'M1-L8-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('1.8', 1, 9, 'multi_select', NULL, NULL, '{"question":"Before eating lunch on site, you should:","options":["Wash hands with soap and water","Remove contaminated clothing","Just wipe hands on trousers","Use the designated eating area","Eat at your workstation"],"correct":[0,1,3]}', NULL, NULL, 15),
('1.8', 1, 10, 'video', 'M1-L8-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('1.8', 1, 11, 'lesson_complete', NULL, NULL, '{"next_lesson":"2.1","next_title":"What is Manual Handling"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 2.1 — MANUAL HANDLING
-- NOTE: hero-M2-L1 is MISSING — using 2.1_photo_1.webp as temporary hero
-- NOTE: M2-L1-C06-point-down.mp4 is MISSING — sequence skips point-down
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('2.1', 2, 1, 'hero', '2.1_photo_1.webp', 'old-content-images', '{"title":"What is Manual Handling","subtitle":"Module 2 of 5","duration":"~4 min"}', NULL, NULL, 0),
('2.1', 2, 2, 'video', 'M2-L1-C01-hook-back-pain.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.1', 2, 3, 'broll', 'M2-L1-BR02-back-stretch.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.1', 2, 4, 'video', 'M2-L1-C02-teach-definition.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.1', 2, 5, 'key_term', NULL, NULL, '{"term":"Manual Handling","definition":"Lifting, carrying, pushing, pulling, or moving a load by hand or bodily force. Causes 1 in 3 workplace injuries.","audio":true}', NULL, NULL, 3),
('2.1', 2, 6, 'video', 'M2-L1-C03-teach-employer-duties.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.1', 2, 7, 'video', 'M2-L1-C04-lean-in-not-just-lifting.mp4', 'lesson-videos', '{}', 'lean_in', 'Manual handling = ANY bodily force. Not just heavy lifts.', 0),
('2.1', 2, 8, 'broll', 'M2-L1-BR01-carrying.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.1', 2, 9, 'image', '2.1_photo_2.webp', 'old-content-images', '{"caption":"Manual handling includes pushing and pulling"}', NULL, NULL, 0),
('2.1', 2, 10, 'video', 'M2-L1-C05-split-screen-posture.mp4', 'lesson-videos', '{}', 'split_screen_compare', NULL, 0),
('2.1', 2, 11, 'split_screen', NULL, NULL, '{"left":"Bending at waist — rounded back, strain on spine.","right":"Bending at knees — straight back, legs take the load."}', NULL, NULL, 5),
('2.1', 2, 12, 'quick_check', NULL, NULL, '{"question":"Which is a manual handling activity?","options":["Operating a crane by remote","Pushing a wheelbarrow","Pressing a button for a conveyor","Watching a forklift"],"correct":1,"feedback_correct":"Correct! Pushing uses bodily force.","feedback_wrong":{"0":"Remote operation is not bodily force.","2":"Pressing a button is not manual handling.","3":"Watching is not handling."}}', NULL, NULL, 10),
('2.1', 2, 13, 'video', 'M2-L1-C07-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.1', 2, 14, 'lesson_complete', NULL, NULL, '{"next_lesson":"2.2","next_title":"Safe Lifting Technique"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 2.2 — SAFE LIFTING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('2.2', 2, 1, 'hero', 'hero-M2-L2-safe-lifting.jpeg', 'lesson-images', '{"title":"Safe Lifting Technique","subtitle":"Module 2 of 5","duration":"~5 min"}', NULL, NULL, 0),
('2.2', 2, 2, 'video', 'M2-L2-C01-hook-cement-bag.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.2', 2, 3, 'video', 'M2-L2-C02-teach-steps-1-4.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.2', 2, 4, 'video', 'M2-L2-C03-teach-steps-5-8.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.2', 2, 5, 'broll', 'M2-L2-BR01-form-closeups.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.2', 2, 6, 'remember_this', NULL, NULL, '{"text":"8 STEPS: 1) Plan 2) Feet shoulder-width 3) Bend knees, straight back 4) Firm grip (palms) 5) Load close 6) Lift with LEGS 7) Move feet to turn (never twist) 8) Set down carefully."}', NULL, NULL, 5),
('2.2', 2, 7, 'image', '2.2_photo_3.webp', 'old-content-images', '{"caption":"Correct lifting technique in practice"}', NULL, NULL, 0),
('2.2', 2, 8, 'video', 'M2-L2-C04-teach-summary.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.2', 2, 9, 'video', 'M2-L2-C05-split-screen-full-lift.mp4', 'lesson-videos', '{}', 'split_screen_compare', NULL, 0),
('2.2', 2, 10, 'split_screen', NULL, NULL, '{"left":"Rounded back, jerky, twisting spine.","right":"Straight back, smooth legs, load close, feet move."}', NULL, NULL, 5),
('2.2', 2, 11, 'video', 'M2-L2-C06-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('2.2', 2, 12, 'drag_drop', NULL, NULL, '{"items":["Plan the lift","Feet shoulder-width","Bend knees straight back","Firm grip palms","Load close to body","Lift with legs","Move feet to turn","Set down carefully"],"targets":["Step 1","Step 2","Step 3","Step 4","Step 5","Step 6","Step 7","Step 8"]}', NULL, NULL, 24),
('2.2', 2, 13, 'quick_check', NULL, NULL, '{"question":"When lifting, you should:","options":["Twist your body to turn","Keep load away from body","Bend knees and keep back straight","Lift quickly with a jerk"],"correct":2,"feedback_correct":"Correct!","feedback_wrong":{"0":"Never twist — move feet.","1":"Load stays CLOSE.","3":"Smooth and steady."}}', NULL, NULL, 10),
('2.2', 2, 14, 'video', 'M2-L2-C07-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.2', 2, 15, 'lesson_complete', NULL, NULL, '{"next_lesson":"2.3","next_title":"TILE Assessment"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 2.3 — TILE ASSESSMENT
-- NOTE: Non-standard filenames: M2-L3-C03-teach-testples.mp4 and M2-L3-C04-lean-in-test.mp4
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('2.3', 2, 1, 'hero', 'hero-M2-L3-tile-assessment.webp', 'lesson-images', '{"title":"TILE Assessment","subtitle":"Module 2 of 5","duration":"~4 min"}', NULL, NULL, 0),
('2.3', 2, 2, 'video', 'M2-L3-C01-hook-too-heavy.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.3', 2, 3, 'video', 'M2-L3-C02-hold-up-tile.mp4', 'lesson-videos', '{}', 'hold_up', 'T=Task I=Individual L=Load E=Environment', 0),
('2.3', 2, 4, 'tap_to_reveal', NULL, NULL, '{"panels":[{"label":"T","content":"Task — what does the job involve?"},{"label":"I","content":"Individual — are YOU fit?"},{"label":"L","content":"Load — heavy, awkward, grip?"},{"label":"E","content":"Environment — wet, narrow, steps?"}]}', NULL, NULL, 12),
('2.3', 2, 5, 'video', 'M2-L3-C03-teach-testples.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.3', 2, 6, 'broll', 'M2-L3-BR01-wet-floor.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.3', 2, 7, 'image', '2.3_photo_1.webp', 'old-content-images', '{"caption":"Assess the environment before lifting"}', NULL, NULL, 0),
('2.3', 2, 8, 'remember_this', NULL, NULL, '{"text":"T.I.L.E: T=Task (twisting, distance?) I=Individual (fitness, injury?) L=Load (weight, shape, grip?) E=Environment (space, floor, lighting?) If ANY fails → get help or mechanical aid."}', NULL, NULL, 5),
('2.3', 2, 9, 'video', 'M2-L3-C04-lean-in-test.mp4', 'lesson-videos', '{}', 'lean_in', 'Find the TILE letter → match the answer.', 0),
('2.3', 2, 10, 'video', 'M2-L3-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('2.3', 2, 11, 'quick_check', NULL, NULL, '{"question":"Heavy toolbox, wet slippery floor. Main TILE concern?","options":["Task","Individual","Load","Environment"],"correct":3,"feedback_correct":"Correct! Wet floor = Environment.","feedback_wrong":{"0":"The task is not the main issue here.","1":"The individual is not the problem.","2":"The load is not the main concern."}}', NULL, NULL, 10),
('2.3', 2, 12, 'video', 'M2-L3-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.3', 2, 13, 'lesson_complete', NULL, NULL, '{"next_lesson":"2.4","next_title":"Team Lifting & Mechanical Aids"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 2.4 — TEAM LIFTING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('2.4', 2, 1, 'hero', 'hero-M2-L4-team-lifting.jpeg', 'lesson-images', '{"title":"Team Lifting & Mechanical Aids","subtitle":"Module 2 of 5","duration":"~3 min"}', NULL, NULL, 0),
('2.4', 2, 2, 'video', 'M2-L4-C01-hook-impossible.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.4', 2, 3, 'video', 'M2-L4-C02-teach-team-lifting.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.4', 2, 4, 'remember_this', NULL, NULL, '{"text":"TEAM LIFTING: 1) One person leads. 2) Lift together on count. 3) Communicate throughout. MECHANICAL AIDS: forklift, trolley, hoist, pallet truck. Machine is ALWAYS better."}', NULL, NULL, 5),
('2.4', 2, 5, 'video', 'M2-L4-C03-teach-mechanical-aids.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.4', 2, 6, 'broll', 'M2-L4-BR01-mechanical-aids.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.4', 2, 7, 'image', '2.4_photo_1.webp', 'old-content-images', '{"caption":"Mechanical aids reduce manual handling risk"}', NULL, NULL, 0),
('2.4', 2, 8, 'video', 'M2-L4-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('2.4', 2, 9, 'quick_check', NULL, NULL, '{"question":"During a team lift, most important is:","options":["Lift as fast as possible","One person coordinates, everyone lifts together","Strongest person lifts most","No verbal communication"],"correct":1,"feedback_correct":"Correct!","feedback_wrong":{"0":"Speed causes injuries.","2":"Equal effort, coordinated.","3":"Communication is essential."}}', NULL, NULL, 10),
('2.4', 2, 10, 'video', 'M2-L4-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('2.4', 2, 11, 'lesson_complete', NULL, NULL, '{"next_lesson":"3.1","next_title":"What is Working at Height"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 3.1 — WORKING AT HEIGHT
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('3.1', 3, 1, 'hero', 'hero-M3-L1-working-at-height.jpeg', 'lesson-images', '{"title":"What is Working at Height","subtitle":"Module 3 of 5","duration":"~3 min"}', NULL, NULL, 0),
('3.1', 3, 2, 'video', 'M3-L1-C01-hook-stepladder.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.1', 3, 3, 'video', 'M3-L1-C02-teach-definition.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.1', 3, 4, 'key_term', NULL, NULL, '{"term":"Working at Height","definition":"Any place where a person could fall a distance liable to cause personal injury. NO minimum height.","audio":true}', NULL, NULL, 3),
('3.1', 3, 5, 'image', '3.1_photo_1.webp', 'old-content-images', '{"caption":"Even a stepladder counts as working at height"}', NULL, NULL, 0),
('3.1', 3, 6, 'video', 'M3-L1-C03-lean-in-trap.mp4', 'lesson-videos', '{}', 'lean_in', 'NO minimum height. Above 2m is ALWAYS wrong.', 0),
('3.1', 3, 7, 'test_tip', NULL, NULL, '{"text":"BIGGEST TRAP: ''Only applies above 2 metres'' is ALWAYS wrong. Working at height applies at ANY height."}', NULL, NULL, 5),
('3.1', 3, 8, 'video', 'M3-L1-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('3.1', 3, 9, 'quick_check', NULL, NULL, '{"question":"Working at height regulations apply:","options":["Only above 2 metres","Only above 3 metres","At any height where a fall could cause injury","Only on scaffolding and ladders"],"correct":2,"feedback_correct":"Correct! Any height.","feedback_wrong":{"0":"TRAP! No minimum height.","1":"No minimum height.","3":"Applies everywhere, not just scaffolding."}}', NULL, NULL, 10),
('3.1', 3, 10, 'video', 'M3-L1-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.1', 3, 11, 'lesson_complete', NULL, NULL, '{"next_lesson":"3.2","next_title":"The 1:4 Ladder Rule"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 3.2 — LADDER RULE
-- NOTE: M3-L2-C05-close.mp4 is MISSING — no close card
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('3.2', 3, 1, 'hero', 'hero-M3-L2-ladder-rule.jpeg', 'lesson-images', '{"title":"The 1:4 Ladder Rule","subtitle":"Module 3 of 5","duration":"~3 min"}', NULL, NULL, 0),
('3.2', 3, 2, 'video', 'M3-L2-C01-hook-wrong-angle.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.2', 3, 3, 'video', 'M3-L2-C02-teach-the-rule.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.2', 3, 4, 'broll', 'M3-L2-BR01-ladder-detail.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.2', 3, 5, 'remember_this', NULL, NULL, '{"text":"1:4 RULE: Every 4m up, base 1m out. 75° angle. 3 points of contact always. Height ÷ 4 = base distance."}', NULL, NULL, 5),
('3.2', 3, 6, 'image', '3.2_photo_2.webp', 'old-content-images', '{"caption":"The correct 1:4 ladder angle"}', NULL, NULL, 0),
('3.2', 3, 7, 'video', 'M3-L2-C03-lean-in-calculation.mp4', 'lesson-videos', '{}', 'lean_in', 'Height ÷ 4 = base distance. 8m ÷ 4 = 2m.', 0),
('3.2', 3, 8, 'video', 'M3-L2-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('3.2', 3, 9, 'quick_check', NULL, NULL, '{"question":"Ladder reaches 8m. Base distance from wall?","options":["1 metre","2 metres","3 metres","4 metres"],"correct":1,"feedback_correct":"Correct! 8 ÷ 4 = 2.","feedback_wrong":{"0":"Too close.","2":"Too far.","3":"Way too far."}}', NULL, NULL, 10),
('3.2', 3, 10, 'lesson_complete', NULL, NULL, '{"next_lesson":"3.3","next_title":"Scaffolding Safety"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 3.3 — SCAFFOLDING
-- NOTE: M3-L3-C05-close.mp4 and M3-L3-BR01-scaffold-inspection.mp4 are MISSING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('3.3', 3, 1, 'hero', 'hero-M3-L3-scaffolding.jpeg', 'lesson-images', '{"title":"Scaffolding Safety","subtitle":"Module 3 of 5","duration":"~3 min"}', NULL, NULL, 0),
('3.3', 3, 2, 'video', 'M3-L3-C01-hook-missing-guardrail.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.3', 3, 3, 'video', 'M3-L3-C02-teach-components.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.3', 3, 4, 'remember_this', NULL, NULL, '{"text":"SCAFFOLD: Guardrails (top), Mid-rails (middle), Toe boards (bottom). Inspect every 7 days + after bad weather. Competent person only."}', NULL, NULL, 5),
('3.3', 3, 5, 'image', '3.3_photo_2.webp', 'old-content-images', '{"caption":"Properly erected scaffold with all components"}', NULL, NULL, 0),
('3.3', 3, 6, 'video', 'M3-L3-C03-lean-in-seven-days.mp4', 'lesson-videos', '{}', 'lean_in', 'Every 7 days. Competent person only.', 0),
('3.3', 3, 7, 'video', 'M3-L3-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('3.3', 3, 8, 'quick_check', NULL, NULL, '{"question":"Scaffold inspection frequency?","options":["Every day","Every 7 days","Every 14 days","Every month"],"correct":1,"feedback_correct":"Correct!","feedback_wrong":{"0":"Not daily — every 7 days minimum.","2":"Too long.","3":"Way too long."}}', NULL, NULL, 10),
('3.3', 3, 9, 'lesson_complete', NULL, NULL, '{"next_lesson":"3.4","next_title":"Fragile Surfaces"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 3.4 — FRAGILE SURFACES
-- NOTE: M3-L4-C03-lean-in-fatal.mp4 is MISSING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('3.4', 3, 1, 'hero', 'hero-M3-L4-fragile-surfaces.jpeg', 'lesson-images', '{"title":"Fragile Surfaces","subtitle":"Module 3 of 5","duration":"~2 min"}', NULL, NULL, 0),
('3.4', 3, 2, 'video', 'M3-L4-C01-hook-rooflight.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.4', 3, 3, 'video', 'M3-L4-C02-teach-fragile-types.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.4', 3, 4, 'remember_this', NULL, NULL, '{"text":"FRAGILE: Rooflights, fibre cement, glass panels, deteriorated felt. NEVER walk on them. Use crawl boards, guardrails, barriers."}', NULL, NULL, 5),
('3.4', 3, 5, 'image', '3.4_photo_2.webp', 'old-content-images', '{"caption":"Rooflights — they look solid but will not hold your weight"}', NULL, NULL, 0),
('3.4', 3, 6, 'video', 'M3-L4-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('3.4', 3, 7, 'quick_check', NULL, NULL, '{"question":"Which is a fragile surface?","options":["Steel decking","Concrete slab","A rooflight","Timber flooring"],"correct":2,"feedback_correct":"Correct!","feedback_wrong":{"0":"Steel is not fragile.","1":"Concrete is solid.","3":"Timber is not typically fragile."}}', NULL, NULL, 10),
('3.4', 3, 8, 'video', 'M3-L4-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.4', 3, 9, 'lesson_complete', NULL, NULL, '{"next_lesson":"3.5","next_title":"Fall Protection"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 3.5 — FALL PROTECTION
-- NOTE: M3-L5-C01-hook-choice.mp4 is MISSING — sequence starts at teach card
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('3.5', 3, 1, 'hero', 'hero-M3-L5-fall-protection.jpeg', 'lesson-images', '{"title":"Fall Protection","subtitle":"Module 3 of 5","duration":"~4 min"}', NULL, NULL, 0),
('3.5', 3, 2, 'video', 'M3-L5-C02-teach-prevention-arrest.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.5', 3, 3, 'remember_this', NULL, NULL, '{"text":"PREVENTION (stops falls) = guardrails, barriers. ARREST (catches falls) = harnesses, nets. Prevention ALWAYS beats arrest."}', NULL, NULL, 5),
('3.5', 3, 4, 'broll', 'M3-L5-BR01-harness-check.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.5', 3, 5, 'video', 'M3-L5-C03-split-screen-prevention.mp4', 'lesson-videos', '{}', 'split_screen_compare', NULL, 0),
('3.5', 3, 6, 'split_screen', NULL, NULL, '{"left":"Harness only — catches AFTER you fall.","right":"Guardrails + harness — PREVENTS the fall first."}', NULL, NULL, 5),
('3.5', 3, 7, 'video', 'M3-L5-C04-lean-in-trap.mp4', 'lesson-videos', '{}', 'lean_in', 'Prevention > Arrest. Guardrails > Harness.', 0),
('3.5', 3, 8, 'test_tip', NULL, NULL, '{"text":"SECOND BIGGEST TRAP: When both guardrails and harness are options, ALWAYS pick guardrails. Prevention beats arrest."}', NULL, NULL, 5),
('3.5', 3, 9, 'video', 'M3-L5-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('3.5', 3, 10, 'quick_check', NULL, NULL, '{"question":"Best protection at height?","options":["Safety harness","Guardrails","Warning signs","Safety net"],"correct":1,"feedback_correct":"Correct! Prevention beats arrest.","feedback_wrong":{"0":"Arrest only — catches after fall.","2":"Signs do not prevent falls.","3":"Arrest only."}}', NULL, NULL, 10),
('3.5', 3, 11, 'video', 'M3-L5-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('3.5', 3, 12, 'lesson_complete', NULL, NULL, '{"next_lesson":"4.1","next_title":"COSHH"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 4.1 — COSHH
-- NOTE: M4-L1-C02-teach-coshh.mp4 and M4-L1-BR01-chemical-labels.mp4 are MISSING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('4.1', 4, 1, 'hero', 'hero-M4-L1-coshh.jpeg', 'lesson-images', '{"title":"COSHH","subtitle":"Module 4 of 5","duration":"~4 min"}', NULL, NULL, 0),
('4.1', 4, 2, 'video', 'M4-L1-C01-hook-invisible.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.1', 4, 3, 'key_term', NULL, NULL, '{"term":"COSHH","definition":"Control of Substances Hazardous to Health. Chemicals, dust, fumes, gases, biological agents.","audio":true}', NULL, NULL, 3),
('4.1', 4, 4, 'video', 'M4-L1-C03-hold-up-4-routes.mp4', 'lesson-videos', '{}', 'hold_up', '4 ROUTES: 1) Inhalation 2) Ingestion 3) Absorption 4) Injection', 0),
('4.1', 4, 5, 'tap_to_reveal', NULL, NULL, '{"panels":[{"label":"Lungs","content":"Inhalation — breathe in"},{"label":"Mouth","content":"Ingestion — swallow"},{"label":"Skin","content":"Absorption — through skin"},{"label":"Wound","content":"Injection — through cuts"}]}', NULL, NULL, 12),
('4.1', 4, 6, 'image', '4.1_photo_1.webp', 'old-content-images', '{"caption":"COSHH hazard symbols — know what they mean"}', NULL, NULL, 0),
('4.1', 4, 7, 'video', 'M4-L1-C04-lean-in-inhalation.mp4', 'lesson-videos', '{}', 'lean_in', 'Most common route on site = INHALATION.', 0),
('4.1', 4, 8, 'video', 'M4-L1-C05-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('4.1', 4, 9, 'quick_check', NULL, NULL, '{"question":"Most common route for hazardous substances on site?","options":["Ingestion","Absorption","Inhalation","Injection"],"correct":2,"feedback_correct":"Correct! Breathing it in.","feedback_wrong":{"0":"Less common on site.","1":"Second most common.","3":"Least common."}}', NULL, NULL, 10),
('4.1', 4, 10, 'video', 'M4-L1-C06-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.1', 4, 11, 'lesson_complete', NULL, NULL, '{"next_lesson":"4.2","next_title":"Asbestos"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 4.2 — ASBESTOS
-- NOTE: M4-L2-C02-teach-diseases.mp4 is MISSING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('4.2', 4, 1, 'hero', 'hero-M4-L2-asbestos.jpeg', 'lesson-images', '{"title":"Asbestos","subtitle":"Module 4 of 5","duration":"~3 min"}', NULL, NULL, 0),
('4.2', 4, 2, 'video', 'M4-L2-C01-hook-invisible-killer.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.2', 4, 3, 'remember_this', NULL, NULL, '{"text":"ASBESTOS: Mesothelioma (always fatal), Asbestosis, Lung cancer. Buildings before 2000. Cannot see/smell it. 15-60 years to show. STOP WORK, do not touch, REPORT."}', NULL, NULL, 5),
('4.2', 4, 4, 'image', '4.2_photo_2.webp', 'old-content-images', '{"caption":"Asbestos warning signage"}', NULL, NULL, 0),
('4.2', 4, 5, 'video', 'M4-L2-C03-lean-in-stop-report.mp4', 'lesson-videos', '{}', 'lean_in', 'Suspect asbestos → STOP → REPORT → Do NOT touch.', 0),
('4.2', 4, 6, 'video', 'M4-L2-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('4.2', 4, 7, 'quick_check', NULL, NULL, '{"question":"Discover suspected asbestos — you should:","options":["Remove it carefully","Cover it and carry on","Stop work and report","Take a sample"],"correct":2,"feedback_correct":"Correct!","feedback_wrong":{"0":"DANGEROUS.","1":"Never ignore it.","3":"Only specialists."}}', NULL, NULL, 10),
('4.2', 4, 8, 'video', 'M4-L2-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.2', 4, 9, 'lesson_complete', NULL, NULL, '{"next_lesson":"4.3","next_title":"Noise and Vibration"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 4.3 — NOISE AND VIBRATION
-- NOTE: hero-M4-L3 is MISSING — using 4.3_photo_3.webp as temporary hero
-- NOTE: M4-L3-C02-teach-noise-havs.mp4 is MISSING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('4.3', 4, 1, 'hero', '4.3_photo_3.webp', 'old-content-images', '{"title":"Noise and Vibration","subtitle":"Module 4 of 5","duration":"~3 min"}', NULL, NULL, 0),
('4.3', 4, 2, 'video', 'M4-L3-C01-hook-hearing.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.3', 4, 3, 'broll', 'M4-L3-BR01-vibrating-tools.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.3', 4, 4, 'remember_this', NULL, NULL, '{"text":"NOISE: 80 dB = available. 85 dB = MANDATORY. Permanent. VIBRATION (HAVS): tingling, numbness, white finger. Both irreversible."}', NULL, NULL, 5),
('4.3', 4, 5, 'image', '4.3_photo_4.webp', 'old-content-images', '{"caption":"Hearing protection and vibration awareness"}', NULL, NULL, 0),
('4.3', 4, 6, 'video', 'M4-L3-C03-lean-in-85db.mp4', 'lesson-videos', '{}', 'lean_in', '85 dB = MANDATORY. 80 dB = available.', 0),
('4.3', 4, 7, 'video', 'M4-L3-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('4.3', 4, 8, 'quick_check', NULL, NULL, '{"question":"Hearing protection MUST be worn at:","options":["70 dB","80 dB","85 dB","90 dB"],"correct":2,"feedback_correct":"Correct!","feedback_wrong":{"0":"Too low.","1":"Available, not mandatory.","3":"Mandatory before this."}}', NULL, NULL, 10),
('4.3', 4, 9, 'video', 'M4-L3-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.3', 4, 10, 'lesson_complete', NULL, NULL, '{"next_lesson":"4.4","next_title":"Dust and Chemicals"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 4.4 — DUST AND CHEMICALS
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('4.4', 4, 1, 'hero', 'hero-M4-L4-dust-chemicals.jpeg', 'lesson-images', '{"title":"Dust and Chemicals","subtitle":"Module 4 of 5","duration":"~3 min"}', NULL, NULL, 0),
('4.4', 4, 2, 'video', 'M4-L4-C01-hook-dust-cloud.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.4', 4, 3, 'video', 'M4-L4-C02-teach-silica-cement.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.4', 4, 4, 'remember_this', NULL, NULL, '{"text":"Silica dust → Silicosis. Cement → Dermatitis/burns. Water suppression for dust. Wash immediately for cement. NEVER dry sweep."}', NULL, NULL, 5),
('4.4', 4, 5, 'video', 'M4-L4-C03-lean-in-six-pairs.mp4', 'lesson-videos', '{}', 'lean_in', '6 PAIRS: Silica→Silicosis, Asbestos→Mesothelioma, Noise→Hearing loss, Vibration→HAVS, Cement→Dermatitis, Rat urine→Leptospirosis', 0),
('4.4', 4, 6, 'pattern_card', NULL, NULL, '{"pairs":[{"hazard":"Silica dust","disease":"Silicosis"},{"hazard":"Asbestos","disease":"Mesothelioma"},{"hazard":"Noise","disease":"Hearing loss"},{"hazard":"Vibration","disease":"HAVS"},{"hazard":"Cement","disease":"Dermatitis"},{"hazard":"Rat urine","disease":"Leptospirosis"}]}', NULL, NULL, 10),
('4.4', 4, 7, 'video', 'M4-L4-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('4.4', 4, 8, 'quick_check', NULL, NULL, '{"question":"Silica dust causes:","options":["Asbestosis","Dermatitis","Silicosis","Leptospirosis"],"correct":2,"feedback_correct":"Correct!","feedback_wrong":{"0":"That is asbestos.","1":"That is cement.","3":"That is rat urine."}}', NULL, NULL, 10),
('4.4', 4, 9, 'video', 'M4-L4-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.4', 4, 10, 'lesson_complete', NULL, NULL, '{"next_lesson":"4.5","next_title":"Drugs, Alcohol & Substance Misuse"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 4.5 — DRUGS AND ALCOHOL
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('4.5', 4, 1, 'hero', 'hero-M4-L5-drugs-alcohol.jpeg', 'lesson-images', '{"title":"Drugs, Alcohol & Substance Misuse","subtitle":"Module 4 of 5","duration":"~2 min"}', NULL, NULL, 0),
('4.5', 4, 2, 'video', 'M4-L5-C01-hook-impaired.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.5', 4, 3, 'video', 'M4-L5-C02-teach-zero-tolerance.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.5', 4, 4, 'remember_this', NULL, NULL, '{"text":"Zero tolerance. Impairs judgment, slows reactions. Prescribed medication: if drowsy, MUST inform supervisor BEFORE starting work."}', NULL, NULL, 5),
('4.5', 4, 5, 'video', 'M4-L5-C03-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('4.5', 4, 6, 'quick_check', NULL, NULL, '{"question":"Taking drowsy medication — you should:","options":["Carry on carefully","Tell supervisor before work","Take less medication","Only work on ground"],"correct":1,"feedback_correct":"Correct!","feedback_wrong":{"0":"Not safe.","2":"Dangerous medical advice.","3":"Not sufficient."}}', NULL, NULL, 10),
('4.5', 4, 7, 'video', 'M4-L5-C04-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('4.5', 4, 8, 'lesson_complete', NULL, NULL, '{"next_lesson":"5.1","next_title":"Banksman and Exclusion Zones"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 5.1 — BANKSMAN
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('5.1', 5, 1, 'hero', 'hero-M5-L1-banksman.jpeg', 'lesson-images', '{"title":"Banksman and Exclusion Zones","subtitle":"Module 5 of 5","duration":"~3 min"}', NULL, NULL, 0),
('5.1', 5, 2, 'video', 'M5-L1-C01-hook-blind-spot.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.1', 5, 3, 'video', 'M5-L1-C02-teach-banksman.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.1', 5, 4, 'broll', 'M5-L1-BR01-reversing.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.1', 5, 5, 'remember_this', NULL, NULL, '{"text":"BANKSMAN: Guides vehicles with hand signals. Required for all reversing. EXCLUSION ZONES: Physical barriers. Engineering control > verbal warning."}', NULL, NULL, 5),
('5.1', 5, 6, 'image', '5.1_photo_1.webp', 'old-content-images', '{"caption":"Banksman in action — clear hand signals"}', NULL, NULL, 0),
('5.1', 5, 7, 'video', 'M5-L1-C03-lean-in-exclusion.mp4', 'lesson-videos', '{}', 'lean_in', 'Exclusion zone > verbal warning. Physical > admin.', 0),
('5.1', 5, 8, 'video', 'M5-L1-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('5.1', 5, 9, 'quick_check', NULL, NULL, '{"question":"A banksman is required to:","options":["Drive the vehicle","Guide vehicles using hand signals","Load materials","Check maintenance"],"correct":1,"feedback_correct":"Correct!","feedback_wrong":{"0":"Banksman guides, not drives.","2":"Not their role.","3":"Not their role."}}', NULL, NULL, 10),
('5.1', 5, 10, 'video', 'M5-L1-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.1', 5, 11, 'lesson_complete', NULL, NULL, '{"next_lesson":"5.2","next_title":"Machine Guarding & Isolation"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 5.2 — MACHINE GUARDING
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('5.2', 5, 1, 'hero', 'hero-M5-L2-machine-guarding.jpeg', 'lesson-images', '{"title":"Machine Guarding & Isolation","subtitle":"Module 5 of 5","duration":"~3 min"}', NULL, NULL, 0),
('5.2', 5, 2, 'video', 'M5-L2-C01-hook-missing-guard.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.2', 5, 3, 'video', 'M5-L2-C02-teach-loto.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.2', 5, 4, 'remember_this', NULL, NULL, '{"text":"Guards NEVER removed during operation. LOTO: 1) Switch OFF 2) LOCK isolator 3) TAG with name 4) TEST dead."}', NULL, NULL, 5),
('5.2', 5, 5, 'image', '5.2_photo_1.webp', 'old-content-images', '{"caption":"Lock-out tag-out in practice"}', NULL, NULL, 0),
('5.2', 5, 6, 'video', 'M5-L2-C03-lean-in-no-bypass.mp4', 'lesson-videos', '{}', 'lean_in', 'Machine without guard = NEVER use. No exceptions.', 0),
('5.2', 5, 7, 'video', 'M5-L2-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('5.2', 5, 8, 'quick_check', NULL, NULL, '{"question":"Before maintaining a machine:","options":["Tell colleague to watch","Switch off, lock, tag, test","Just switch off","Wear extra PPE"],"correct":1,"feedback_correct":"Correct!","feedback_wrong":{"0":"Not sufficient.","2":"Not enough — must lock and tag.","3":"Does not isolate machine."}}', NULL, NULL, 10),
('5.2', 5, 9, 'video', 'M5-L2-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.2', 5, 10, 'lesson_complete', NULL, NULL, '{"next_lesson":"5.3","next_title":"Traffic Management"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 5.3 — TRAFFIC MANAGEMENT
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('5.3', 5, 1, 'hero', 'hero-M5-L3-traffic-management.jpeg', 'lesson-images', '{"title":"Traffic Management","subtitle":"Module 5 of 5","duration":"~3 min"}', NULL, NULL, 0),
('5.3', 5, 2, 'video', 'M5-L3-C01-hook-crossing.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.3', 5, 3, 'video', 'M5-L3-C02-teach-segregation.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.3', 5, 4, 'broll', 'M5-L3-BR01-site-traffic.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.3', 5, 5, 'remember_this', NULL, NULL, '{"text":"Primary purpose = SEGREGATION. Separate pedestrians from vehicles. Controls: one-way, pedestrian routes, speed limits, barriers."}', NULL, NULL, 5),
('5.3', 5, 6, 'video', 'M5-L3-C03-lean-in-segregation.mp4', 'lesson-videos', '{}', 'lean_in', 'Traffic management = SEGREGATION.', 0),
('5.3', 5, 7, 'video', 'M5-L3-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('5.3', 5, 8, 'quick_check', NULL, NULL, '{"question":"Primary purpose of traffic management?","options":["Speed up deliveries","Separate pedestrians from vehicles","Reduce noise","Prevent theft"],"correct":1,"feedback_correct":"Correct! Segregation.","feedback_wrong":{"0":"Not the primary purpose.","2":"Not traffic management.","3":"Not traffic management."}}', NULL, NULL, 10),
('5.3', 5, 9, 'video', 'M5-L3-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.3', 5, 10, 'lesson_complete', NULL, NULL, '{"next_lesson":"5.4","next_title":"Overhead Services & Buried Utilities"}', NULL, NULL, 5);

-- ============================================================
-- LESSON 5.4 — OVERHEAD & BURIED
-- ============================================================
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_file, media_bucket, content_json, fourth_wall_effect, effect_overlay_text, xp_value) VALUES
('5.4', 5, 1, 'hero', 'hero-M5-L4-overhead-buried.jpeg', 'lesson-images', '{"title":"Overhead Services & Buried Utilities","subtitle":"Module 5 of 5","duration":"~3 min"}', NULL, NULL, 0),
('5.4', 5, 2, 'video', 'M5-L4-C01-hook-look-up.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.4', 5, 3, 'video', 'M5-L4-C02-teach-overhead-buried.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.4', 5, 4, 'remember_this', NULL, NULL, '{"text":"OVERHEAD: Contact kills instantly. Goal posts, exclusion zones, banksman. BURIED: ALWAYS CAT scan before digging. Hand dig near known services."}', NULL, NULL, 5),
('5.4', 5, 5, 'video', 'M5-L4-C03-lean-in-instant.mp4', 'lesson-videos', '{}', 'lean_in', 'Overhead cables = instant death. CAT scan before digging.', 0),
('5.4', 5, 6, 'video', 'M5-L4-C04-point-down.mp4', 'lesson-videos', '{}', 'point_down', NULL, 0),
('5.4', 5, 7, 'quick_check', NULL, NULL, '{"question":"Before digging on site:","options":["Ask a colleague","Start digging carefully","Scan with CAT scanner","Check for warning signs only"],"correct":2,"feedback_correct":"Correct!","feedback_wrong":{"0":"Not sufficient.","1":"Never dig blind.","3":"Not sufficient alone."}}', NULL, NULL, 10),
('5.4', 5, 8, 'video', 'M5-L4-C05-close.mp4', 'lesson-videos', '{}', NULL, NULL, 0),
('5.4', 5, 9, 'lesson_complete', NULL, NULL, '{"next_lesson":null,"next_title":"Course Complete!"}', NULL, NULL, 5);

-- ============================================================
-- END OF SEED
-- Total: 21 lessons, ~220 cards
-- ============================================================
