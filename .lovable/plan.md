

# Fix: TapToReveal Not Working in Safety Signs and Symbols (Lesson 1.6)

## Problem
The TapToReveal card in lesson 1.6 has panel data with keys `label` and `content`, but the component expects `front` and `back`. This means all panel text renders as blank/undefined — the cards appear empty and tapping reveals nothing meaningful.

**Database data**: `{ "label": "RED CIRCLE", "content": "Prohibition — Do NOT" }`
**Component expects**: `{ "front": "...", "back": "..." }`

## Fix

### Option A — Fix the data (recommended, minimal change)
One migration to update the `content_json` for card `6d32bbf9-5271-49f5-9643-06605f7f7617`, rewriting `label`/`content` to `front`/`back`:

```sql
UPDATE lesson_cards
SET content_json = '{
  "panels": [
    {"front": "RED CIRCLE", "back": "Prohibition — Do NOT"},
    {"front": "YELLOW TRIANGLE", "back": "Warning — Danger"},
    {"front": "BLUE CIRCLE", "back": "Mandatory — You MUST"},
    {"front": "GREEN RECTANGLE", "back": "Safe Condition — Safety info"}
  ]
}'::jsonb
WHERE id = '6d32bbf9-5271-49f5-9643-06605f7f7617';
```

### Option B — Make the component resilient (belt-and-suspenders)
Also update `TapToReveal.tsx` to accept `label`/`content` as fallback keys, so future cards with either schema work.

### Recommendation
Do both: fix the data AND add fallback key support in the component for resilience.

