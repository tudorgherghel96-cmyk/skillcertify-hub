

# Improve Tap to Reveal Card 6 — Fire Triangle (Lesson 1.7)

## Problem
The current card has generic labels ("Corner 1", "Corner 2", "Corner 3", "Centre") that reveal single words (HEAT, FUEL, OXYGEN). It doesn't teach anything — just reveals labels with no context, no exam relevance, and no visual meaning.

## Solution
Redesign the content to teach the **Fire Triangle** concept properly — each panel's front shows a recognisable cue (emoji/symbol + short prompt) and the back gives a memorable fact or test tip. Add fire-themed icons.

### Database update for card `171d2556-9935-4b3b-b0cd-3fc6dba7000b`

New `content_json`:
```json
{
  "title": "The Fire Triangle",
  "panels": [
    {
      "front": "🔥 Side 1",
      "back": "HEAT — ignition sources like sparks, hot works, or electrical faults",
      "icon": "warning"
    },
    {
      "front": "⛽ Side 2",
      "back": "FUEL — wood, paper, flammable liquids, gas, dust",
      "icon": "warning"
    },
    {
      "front": "💨 Side 3",
      "back": "OXYGEN — always present in the air (21%)",
      "icon": "warning"
    },
    {
      "front": "🧯 How to stop fire?",
      "back": "Remove ANY ONE side of the triangle — that's how extinguishers work!",
      "icon": "safe_condition"
    }
  ],
  "xp_value": 15
}
```

### Component update — render optional `title`
Update `TapToReveal.tsx` to accept and render an optional `title` prop above the grid — displayed as a bold heading so the learner knows the topic before tapping.

### SwipeContainer update
Pass through the `title` field from `content_json` to the `TapToReveal` component.

### Files changed
- `supabase/migrations/` — new migration updating card content
- `src/components/lesson/cards/TapToReveal.tsx` — add optional `title` prop
- `src/components/lesson/SwipeContainer.tsx` — pass `title` through

