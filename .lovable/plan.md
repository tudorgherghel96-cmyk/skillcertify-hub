

# Speed Drill Card 13 (Lesson 1.6) — 5s Timer + Sign Illustrations

## Problem
1. Timer is hardcoded to 3 seconds — needs to be 5 for this card
2. Questions show text like "What type of sign is this? (red_circle)" instead of rendering actual coloured sign SVGs

## Plan

### 1. Update database — set `time_per_question` to 5
Update card `c3002dfd-35a0-41cb-a33a-89d6770bb3c9` to change `time_per_question` from 3 to 5.

### 2. Pass `time_per_question` to SpeedDrill component
- In `SwipeContainer.tsx` speed_drill case: read `content.time_per_question` and pass it as a new `timerSeconds` prop
- In `SpeedDrill.tsx`: add optional `timerSeconds` prop, default to 3, use it instead of the hardcoded `TIMER_SECONDS` constant

### 3. Add sign illustrations to SpeedDrill
- Reuse the same `SafetySignIcon` SVG renderer from DragDrop (or extract to shared file) that maps `prohibition`, `warning`, `mandatory`, `safe_condition` to coloured SVG shapes
- In `SwipeContainer.tsx` normalizer: pass the `image` key through as an `icon` field on each question
- In `SpeedDrill.tsx`: add optional `icon?: string` to `DrillQuestion`, render the sign SVG (48×48px) above the question text when present — replacing the "(red_circle)" text parenthetical

### Technical Detail
- Extract `SafetySignIcon` to `src/components/lesson/cards/SafetySignIcon.tsx` so both DragDrop and SpeedDrill can import it
- The question text changes from `"What type of sign is this? (red_circle)"` to `"What type of sign is this?"` with the SVG rendered visually above
- Map DB image keys: `red_circle` / `red_circle_2` → `prohibition`, `yellow_triangle` → `warning`, `blue_circle` / `blue_circle_2` → `mandatory`, `green_rectangle` → `safe_condition`

### Files changed
- `supabase/migrations/` — new migration updating `time_per_question` to 5
- `src/components/lesson/cards/SafetySignIcon.tsx` — new shared component
- `src/components/lesson/cards/DragDrop.tsx` — import from shared SafetySignIcon
- `src/components/lesson/cards/SpeedDrill.tsx` — add `timerSeconds` + `icon` support
- `src/components/lesson/SwipeContainer.tsx` — pass timer + icon through

