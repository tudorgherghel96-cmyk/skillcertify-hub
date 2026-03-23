

# Create Illustrations for Card 6 (Lesson 3.5) — Spot the Difference

## Current state
Card 6 is a `split_screen` card with:
- **Left (wrong):** "Harness only — catches AFTER you fall."
- **Right (correct):** "Guardrails + harness — PREVENTS the fall first."
- No images currently attached.

## Existing split-screen illustration style
The project has three sets of split-screen illustrations that follow a consistent style:
- `1.7`: no-ppe.webp / full-ppe.webp (PPE comparison)
- `2.1`: option_a.webp / option_b.webp (lifting technique)
- `2.2`: bad_technique.webp / good_technique.webp (manual handling)

All are AI-generated, placed in `public/images/lessons/`, optimized WebP, referenced via local paths.

## Plan

1. **Generate two images** using AI image generation, matching the illustrative style of existing split-screen cards:
   - **Left image** (`3.5_harness_only.webp`): Worker on elevated platform with only a harness, no guardrails — depicting the "arrest only" approach
   - **Right image** (`3.5_guardrails_harness.webp`): Worker on elevated platform with guardrails AND a harness — depicting "prevention first" approach

2. **Optimize** both images to WebP format, <150KB, max 800px

3. **Update database** — add `left_image` and `right_image` to the card's `content_json`:
   ```sql
   UPDATE lesson_cards
   SET content_json = jsonb_set(
     jsonb_set(content_json, '{left_image}', '"/images/lessons/3.5_harness_only.webp"'),
     '{right_image}', '"/images/lessons/3.5_guardrails_harness.webp"'
   )
   WHERE lesson_id = '3.5' AND card_position = 6;
   ```

### Files created
- `public/images/lessons/3.5_harness_only.webp`
- `public/images/lessons/3.5_guardrails_harness.webp`
- New migration SQL

