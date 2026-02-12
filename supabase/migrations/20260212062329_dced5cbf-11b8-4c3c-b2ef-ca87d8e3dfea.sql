
-- Rename existing slugs to match taxonomy
UPDATE public.concepts SET slug = 'tile_principle', name = 'TILE Principle' WHERE slug = 'tileo_principle';
UPDATE public.concepts SET slug = 'injury_types_msk', name = 'Injury Types (MSK)' WHERE slug = 'injury_types';
UPDATE public.concepts SET slug = 'working_at_height_definition', name = 'Working at Height Definition' WHERE slug = 'wah_definition';
UPDATE public.concepts SET slug = 'ladder_safety_requirements', name = 'Ladder Safety Requirements' WHERE slug = 'ladder_safety';
UPDATE public.concepts SET slug = 'ppe_selection', name = 'PPE Selection' WHERE slug = 'ppe_types';
UPDATE public.concepts SET slug = 'machinery_guarding', name = 'Machinery Guarding' WHERE slug = 'machinery_risks';
UPDATE public.concepts SET slug = 'fire_triangle', name = 'Fire Triangle' WHERE slug = 'fire_safety_basics';
UPDATE public.concepts SET slug = 'safe_lifting_posture', name = 'Safe Lifting Posture' WHERE slug = 'safe_lifting_technique';
UPDATE public.concepts SET slug = 'equipment_inspection', name = 'Equipment Inspection', learning_outcome_ref = 'AC 5.5' WHERE slug = 'control_measures';

-- Module 1 additions (5 new)
INSERT INTO public.concepts (module_id, slug, name, learning_outcome_ref, difficulty_weight) VALUES
(1, 'hazard_vs_risk_difference', 'Hazard vs Risk Difference', 'AC 1.2', 1),
(1, 'elimination_vs_reduction', 'Elimination vs Reduction', 'AC 1.3', 2),
(1, 'accident_reporting_basics', 'Accident Reporting Basics', 'AC 1.7', 1),
(1, 'near_miss_definition', 'Near Miss Definition', 'AC 1.7', 1),
(1, 'employer_vs_employee_responsibility', 'Employer vs Employee Responsibility', 'AC 1.8', 2);

-- Module 2 additions (5 new)
INSERT INTO public.concepts (module_id, slug, name, learning_outcome_ref, difficulty_weight) VALUES
(2, 'load_assessment', 'Load Assessment', 'AC 2.2', 2),
(2, 'environmental_factors', 'Environmental Factors', 'AC 2.3', 1),
(2, 'individual_capability', 'Individual Capability', 'AC 2.3', 1),
(2, 'twisting_and_turning_risks', 'Twisting and Turning Risks', 'AC 2.4', 2),
(2, 'team_lifting_principles', 'Team Lifting Principles', 'AC 2.5', 1);

-- Module 3 additions (5 new)
INSERT INTO public.concepts (module_id, slug, name, learning_outcome_ref, difficulty_weight) VALUES
(3, 'hierarchy_wah_controls', 'Hierarchy of WAH Controls', 'AC 3.2', 2),
(3, 'scaffold_safety_basics', 'Scaffold Safety Basics', 'AC 3.3', 2),
(3, 'fall_prevention_vs_fall_arrest', 'Fall Prevention vs Fall Arrest', 'AC 3.4', 2),
(3, 'inspection_requirements', 'Inspection Requirements', 'AC 3.5', 1),
(3, 'weather_risk_factors', 'Weather Risk Factors', 'AC 3.5', 1);

-- Module 4 additions (6 new)
INSERT INTO public.concepts (module_id, slug, name, learning_outcome_ref, difficulty_weight) VALUES
(4, 'hazardous_substances_examples', 'Hazardous Substances Examples', 'AC 4.1', 1),
(4, 'exposure_routes', 'Exposure Routes', 'AC 4.2', 2),
(4, 'asbestos_health_effects', 'Asbestos Health Effects', 'AC 4.2', 3),
(4, 'silica_dust_risks', 'Silica Dust Risks', 'AC 4.3', 2),
(4, 'noise_and_vibration', 'Noise and Vibration', 'AC 4.3', 2),
(4, 'long_term_vs_short_term_risks', 'Long-term vs Short-term Risks', 'AC 4.5', 1);

-- Module 5 additions (6 new)
INSERT INTO public.concepts (module_id, slug, name, learning_outcome_ref, difficulty_weight) VALUES
(5, 'reversing_risks', 'Reversing Risks', 'AC 5.2', 1),
(5, 'load_security', 'Load Security', 'AC 5.3', 1),
(5, 'isolation_procedures', 'Isolation Procedures', 'AC 5.4', 2),
(5, 'power_tool_safety', 'Power Tool Safety', 'AC 5.4', 1),
(5, 'traffic_management_basics', 'Traffic Management Basics', 'AC 5.5', 1),
(5, 'overhead_service_risks', 'Overhead Service Risks', 'AC 5.5', 2);
