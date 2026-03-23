

# Create Illustrations for Card 5 (Lesson 4.1) — Tap to Reveal: Routes of Entry

## Current state
Card 5 in lesson 4.1 is a `tap_to_reveal` with 4 panels about how hazardous substances enter the body:
- **Lungs** → Inhalation — breathe in
- **Mouth** → Ingestion — swallow
- **Skin** → Absorption — through skin
- **Wound** → Injection — through cuts

Currently no `icon` field is set on any panel — they display as text-only tiles.

## Existing illustrated tap-to-reveal style
Lessons 2.2 and 2.3 use local WebP images as `icon` values in tap_to_reveal panels (e.g., `/images/lessons/2.3_tile_t.webp`). These render as full-square background fills with overlaid labels on semi-transparent badges.

## Plan

1. **Generate 4 images** using AI image generation, matching the flat illustrative style used across the project:
   - `4.1_route_lungs.webp` — Worker breathing in dust/fumes on site (inhalation)
   - `4.1_route_mouth.webp` — Contaminated hands near mouth / eating on site (ingestion)
   - `4.1_route_skin.webp` — Chemical splash on exposed skin (absorption)
   - `4.1_route_wound.webp` — Sharp object / cut with substance entry (injection)

2. **Optimize** all to WebP, <150KB, max 800px

3. **Save** to `public/images/lessons/`

4. **Update database** — add `icon` fields to each panel in content_json:
   ```sql
   UPDATE lesson_cards
   SET content_json = '{
     "panels": [
       {"label": "Lungs", "content": "Inhalation — breathe in", "icon": "/images/lessons/4.1_route_lungs.webp"},
       {"label": "Mouth", "content": "Ingestion — swallow", "icon": "/images/lessons/4.1_route_mouth.webp"},
       {"label": "Skin", "content": "Absorption — through skin", "icon": "/images/lessons/4.1_route_skin.webp"},
       {"label": "Wound", "content": "Injection — through cuts", "icon": "/images/lessons/4.1_route_wound.webp"}
     ]
   }'::jsonb
   WHERE lesson_id = '4.1' AND card_position = 5;
   ```

### Files created
- `public/images/lessons/4.1_route_lungs.webp`
- `public/images/lessons/4.1_route_mouth.webp`
- `public/images/lessons/4.1_route_skin.webp`
- `public/images/lessons/4.1_route_wound.webp`
- New migration SQL

