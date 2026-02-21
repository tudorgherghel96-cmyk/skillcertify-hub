-- Phase 1: Shift lesson_complete cards up to make room for new images + quiz_card
-- Format: UPDATE lesson_cards SET card_position = NEW_POS WHERE lesson_id = 'X.Y' AND card_type = 'lesson_complete';

UPDATE lesson_cards SET card_position = 19 WHERE lesson_id = '1.1' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 19 WHERE lesson_id = '1.2' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 16 WHERE lesson_id = '1.3' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 15 WHERE lesson_id = '1.4' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 16 WHERE lesson_id = '1.5' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 17 WHERE lesson_id = '1.6' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 25 WHERE lesson_id = '1.7' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '1.8' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 16 WHERE lesson_id = '2.1' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 18 WHERE lesson_id = '2.2' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 16 WHERE lesson_id = '2.3' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '2.4' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.1' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '3.2' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '3.3' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '3.4' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '3.5' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '4.1' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '4.2' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '4.3' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '4.4' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 10 WHERE lesson_id = '4.5' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 14 WHERE lesson_id = '5.1' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 13 WHERE lesson_id = '5.2' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 12 WHERE lesson_id = '5.3' AND card_type = 'lesson_complete';
UPDATE lesson_cards SET card_position = 11 WHERE lesson_id = '5.4' AND card_type = 'lesson_complete';

-- Phase 2: Insert 32 missing image cards
-- Lesson 1.1: +3 images (photo_3 at 15, photo_5 at 16, photo_6 at 17)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.1', 1, 15, 'image', 'lesson-images', '1.1_photo_3.webp', '{"alt":"Construction site obstructions hazard","caption":"Obstructions and poor housekeeping create trip hazards. TEST TIP: Obstructions are one of the most common hazards asked about in the exam."}', 0),
('1.1', 1, 16, 'image', 'lesson-images', '1.1_photo_5.webp', '{"alt":"Unsafe storage on construction site","caption":"Materials stacked incorrectly can fall and cause serious injury. Always check storage is secure."}', 0),
('1.1', 1, 17, 'image', 'lesson-images', '1.1_photo_6.webp', '{"alt":"Construction waste and services hazard","caption":"Waste and buried services are hidden hazards. TEST TIP: The exam tests whether you can identify BOTH visible and hidden hazards."}', 0);

-- Lesson 1.2: +2 images (photo_1 at 16, photo_3 at 17)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.2', 1, 16, 'image', 'lesson-images', '1.2_photo_1.webp', '{"alt":"Risk assessment form being completed","caption":"A risk assessment must be carried out by a COMPETENT person. TEST TIP: Risk assessments are a LEGAL REQUIREMENT under the Management of H&S at Work Regs 1999."}', 0),
('1.2', 1, 17, 'image', 'lesson-images', '1.2_photo_3.webp', '{"alt":"Five steps of risk assessment","caption":"The 5 steps: Identify hazards, decide who might be harmed, evaluate risks, record findings, review. TEST TIP: You MUST know all 5 steps for the exam."}', 0);

-- Lesson 1.3: +2 images (photo_1 at 13, photo_3 at 14)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.3', 1, 13, 'image', 'lesson-images', '1.3_photo_1.webp', '{"alt":"Method statement document example","caption":"A method statement describes the safe system of work step by step. TEST TIP: Method statements are NOT a legal requirement but ARE best practice under CDM 2015."}', 0),
('1.3', 1, 14, 'image', 'lesson-images', '1.3_photo_3.webp', '{"alt":"RAMS documentation on site","caption":"RAMS = Risk Assessment and Method Statement. Workers must sign to confirm they have read and understood the safe working procedures."}', 0);

-- Lesson 1.4: +2 images (photo_2 at 12, photo_3 at 13)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.4', 1, 12, 'image', 'lesson-images', '1.4_photo_2.webp', '{"alt":"Dynamic risk assessment being performed on site","caption":"A dynamic RA is carried out ON THE SPOT when conditions change. TEST TIP: A dynamic RA does NOT replace a formal written risk assessment."}', 0),
('1.4', 1, 13, 'image', 'lesson-images', '1.4_photo_3.webp', '{"alt":"Changed site conditions requiring dynamic assessment","caption":"Any competent worker can carry out a dynamic RA. The FIRST step is to STOP the activity and identify what has changed."}', 0);

-- Lesson 1.5: +2 images (photo_1 at 13, photo_3 at 14)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.5', 1, 13, 'image', 'lesson-images', '1.5_photo_1.webp', '{"alt":"Accident reporting book and RIDDOR","caption":"Under RIDDOR, the EMPLOYER reports serious accidents to the HSE. TEST TIP: The answer is ALWAYS the employer — not the worker, supervisor, or safety officer."}', 0),
('1.5', 1, 14, 'image', 'lesson-images', '1.5_photo_3.webp', '{"alt":"Near miss reporting on construction site","caption":"Near misses MUST be reported — they help prevent future accidents. Fractures, amputations, and injuries causing 7+ days off work must be reported under RIDDOR."}', 0);

-- Lesson 1.6: +2 images (photo_2 at 14, photo_3 at 15)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.6', 1, 14, 'image', 'lesson-images', '1.6_photo_2.webp', '{"alt":"Warning and prohibition safety signs","caption":"Yellow triangle = WARNING. Red circle with line = PROHIBITION (must NOT do). TEST TIP: Know all 5 sign types by colour and shape."}', 0),
('1.6', 1, 15, 'image', 'lesson-images', '1.6_photo_3.webp', '{"alt":"Safe condition and fire equipment signs","caption":"Green rectangle = safe condition (exits, first aid). Red square = fire equipment location. Blue circle = MANDATORY (must do)."}', 0);

-- Lesson 1.7: +3 images (photo_2 at 21, photo_3 at 22, photo_5 at 23)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.7', 1, 21, 'image', 'lesson-images', '1.7_photo_2.webp', '{"alt":"Fire extinguisher types on construction site","caption":"CO2 for ELECTRICAL fires. Foam for liquids. Powder is multi-purpose. TEST TIP: NEVER use water on electrical fires."}', 0),
('1.7', 1, 22, 'image', 'lesson-images', '1.7_photo_3.webp', '{"alt":"PPE selection for construction work","caption":"Hard hat and safety boots are ALWAYS required on site. Other PPE depends on the risk assessment for the specific task."}', 0),
('1.7', 1, 23, 'image', 'lesson-images', '1.7_photo_5.webp', '{"alt":"Noise hazard and hearing protection","caption":"80dB = hearing protection must be AVAILABLE. 85dB = hearing protection is MANDATORY. TEST TIP: Know both thresholds — the exam tests this."}', 0);

-- Lesson 1.8: +2 images (photo_1 at 11, photo_3 at 12)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('1.8', 1, 11, 'image', 'lesson-images', '1.8_photo_1.webp', '{"alt":"Welfare facilities on construction site","caption":"Employers must provide: toilets, washing facilities, drinking water, rest area, and changing facilities. These are legal requirements."}', 0),
('1.8', 1, 12, 'image', 'lesson-images', '1.8_photo_3.webp', '{"alt":"Handwashing station on site","caption":"Wash hands BEFORE eating, drinking or smoking, and AFTER using the toilet. Never eat in work areas where hazardous substances are used."}', 0);

-- Lesson 2.1: +1 image (photo_3 at 14)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('2.1', 2, 14, 'image', 'lesson-images', '2.1_photo_3.webp', '{"alt":"Manual handling injury examples","caption":"Manual handling means ANY activity involving bodily force — lifting, pushing, pulling, carrying, lowering. TEST TIP: There is NO minimum weight for manual handling."}', 0);

-- Lesson 2.2: +2 images (photo_1 at 15, photo_2 at 16)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('2.2', 2, 15, 'image', 'lesson-images', '2.2_photo_1.webp', '{"alt":"Employee manual handling responsibilities","caption":"Employer''s FIRST duty: avoid manual handling where reasonably practicable. Employee: follow training, use equipment provided, report problems."}', 0),
('2.2', 2, 16, 'image', 'lesson-images', '2.2_photo_2.webp', '{"alt":"Correct material storage on site","caption":"Store materials at a convenient height on stable surfaces to reduce bending and stretching. Use mechanical aids when loads are too heavy or awkward."}', 0);

-- Lesson 2.3: +2 images (photo_2 at 13, photo_3 at 14)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('2.3', 2, 13, 'image', 'lesson-images', '2.3_photo_2.webp', '{"alt":"TILE assessment for manual handling","caption":"TILE = Task, Individual, Load, Environment. Use this to assess every manual handling operation. TEST TIP: You MUST know what TILE stands for."}', 0),
('2.3', 2, 14, 'image', 'lesson-images', '2.3_photo_3.webp', '{"alt":"Correct lifting technique demonstration","caption":"Plan the lift, feet apart, bend knees, straight back, firm grip, smooth lift, keep load close to body at waist height. Never twist your body."}', 0);

-- Lesson 2.4: +2 images (photo_2 at 11, photo_3 at 12)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('2.4', 2, 11, 'image', 'lesson-images', '2.4_photo_2.webp', '{"alt":"Mechanical handling aids on construction site","caption":"Wheelbarrows, sack trucks, pallet trucks, and forklifts reduce manual handling risks. Always use the right equipment for the task."}', 0),
('2.4', 2, 12, 'image', 'lesson-images', '2.4_photo_3.webp', '{"alt":"Defective equipment reporting procedure","caption":"If you find a defect: STOP using it, take it out of service, and REPORT the defect to your supervisor immediately."}', 0);

-- Lesson 3.1: +2 images (photo_2 at 11, photo_3 at 12)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('3.1', 3, 11, 'image', 'lesson-images', '3.1_photo_2.webp', '{"alt":"Working at height near floor openings","caption":"Working at height includes working near unguarded openings, trenches, and floor voids. TEST TIP: There is NO minimum height — even 1 metre counts."}', 0),
('3.1', 3, 12, 'image', 'lesson-images', '3.1_photo_3.webp', '{"alt":"Safety equipment for working at height","caption":"Report any defects in safety equipment immediately. Cooperate with your employer''s safety policies and use equipment correctly."}', 0);

-- Lesson 3.2: +2 images (photo_1 at 10, photo_3 at 11)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('3.2', 3, 10, 'image', 'lesson-images', '3.2_photo_1.webp', '{"alt":"Hazards when working at height","caption":"Common hazards: falling tools/debris, unstable ladders, overhead cables, fragile roofs, and internal floor voids."}', 0),
('3.2', 3, 11, 'image', 'lesson-images', '3.2_photo_3.webp', '{"alt":"Ladder safety on construction site","caption":"Ladders must be secured, on stable ground, at a 75° angle (1:4 ratio). TEST TIP: The exam will test ladder angle — remember 1 out for every 4 up."}', 0);

-- Lesson 3.3: +2 images (photo_1 at 9, photo_3 at 10)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('3.3', 3, 9, 'image', 'lesson-images', '3.3_photo_1.webp', '{"alt":"Guardrails and edge protection","caption":"Fall PREVENTION (guardrails) always comes before fall ARREST (harnesses). TEST TIP: The hierarchy is AVOID > PREVENT > ARREST > MINIMISE."}', 0),
('3.3', 3, 10, 'image', 'lesson-images', '3.3_photo_3.webp', '{"alt":"Safety harness and fall arrest system","caption":"A safety harness is a fall ARREST measure. Toe boards prevent tools and materials from falling off scaffold edges."}', 0);

-- Lesson 3.4: +2 images (photo_1 at 9, photo_3 at 10)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('3.4', 3, 9, 'image', 'lesson-images', '3.4_photo_1.webp', '{"alt":"Access equipment types for working at height","caption":"Select equipment based on risk assessment: scaffolds, MEWPs, ladders. Scaffolding must be inspected before first use and after events affecting stability."}', 0),
('3.4', 3, 10, 'image', 'lesson-images', '3.4_photo_3.webp', '{"alt":"MEWP and scaffold inspection","caption":"MEWPs must only be operated by trained, authorised operators. Ladders should only be used for short-duration, low-risk tasks."}', 0);

-- Lesson 4.1: +2 images (photo_2 at 11, photo_3 at 12)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('4.1', 4, 11, 'image', 'lesson-images', '4.1_photo_2.webp', '{"alt":"COSHH hazard labels and symbols","caption":"COSHH covers ALL routes of entry: inhalation, ingestion, absorption through skin, injection. TEST TIP: Know all 4 routes of entry."}', 0),
('4.1', 4, 12, 'image', 'lesson-images', '4.1_photo_3.webp', '{"alt":"Health risks from hazardous substances","caption":"Common risks: dermatitis (cement/solvents), silicosis (silica dust), HAVS (vibrating tools), noise-induced hearing loss. All are preventable."}', 0);

-- Lesson 4.2: +2 images (photo_1 at 9, photo_3 at 10)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('4.2', 4, 9, 'image', 'lesson-images', '4.2_photo_1.webp', '{"alt":"Flammable material storage on site","caption":"Flammable materials must be stored in designated, ventilated areas away from ignition sources. Incompatible chemicals must be stored separately."}', 0),
('4.2', 4, 10, 'image', 'lesson-images', '4.2_photo_3.webp', '{"alt":"Drugs and alcohol policy on construction site","caption":"Workers under the influence of drugs or alcohol must be reported to your supervisor immediately — impaired judgement puts everyone at risk."}', 0);

-- Lesson 4.3: +2 images (photo_1 at 10, photo_2 at 11)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('4.3', 4, 10, 'image', 'lesson-images', '4.3_photo_1.webp', '{"alt":"Asbestos warning signs and procedures","caption":"If you find suspected asbestos: STOP, don''t touch, leave the area, REPORT. TEST TIP: Only LICENSED contractors can remove asbestos."}', 0),
('4.3', 4, 11, 'image', 'lesson-images', '4.3_photo_2.webp', '{"alt":"PPE for hazardous substances","caption":"PPE is the LAST resort in the hierarchy of controls. Chemical-resistant gloves, goggles, and respiratory protection as specified in the COSHH assessment."}', 0);

-- Lesson 5.1: +2 images (photo_2 at 11, photo_3 at 12)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('5.1', 5, 11, 'image', 'lesson-images', '5.1_photo_2.webp', '{"alt":"Plant exclusion zones and banksmen","caption":"Exclusion zones, banksmen, mirrors, and alarms prevent unauthorised people from entering danger zones around moving plant."}', 0),
('5.1', 5, 12, 'image', 'lesson-images', '5.1_photo_3.webp', '{"alt":"Operator blind spots on plant machinery","caption":"NEVER approach moving plant until you have made EYE CONTACT with the operator and they have acknowledged you. Operators have blind spots."}', 0);

-- Lesson 5.2: +2 images (photo_2 at 10, photo_3 at 11)
INSERT INTO lesson_cards (lesson_id, module_id, card_position, card_type, media_bucket, media_file, content_json, xp_value) VALUES
('5.2', 5, 10, 'image', 'lesson-images', '5.2_photo_2.webp', '{"alt":"Warning signs near plant and equipment","caption":"Yellow warning triangles indicate specific hazards. Workers must wear high-visibility clothing near plant to be seen by operators."}', 0),
('5.2', 5, 11, 'image', 'lesson-images', '5.2_photo_3.webp', '{"alt":"Control measures for plant operations","caption":"Physically separating pedestrians from plant operations ELIMINATES the risk. Exclusion zones and banksmen are key control measures."}', 0);