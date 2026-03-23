

# Fix Card 5 (Lesson 5.3 Traffic Management) — Improve Text Layout

## Problem
The current text is a dense, comma-separated block:
> "Primary purpose = SEGREGATION. Separate pedestrians from vehicles. Controls: one-way, pedestrian routes, speed limits, barriers."

The `formatRememberText` parser splits this into bullet sentences, but the result lacks hierarchy and is hard to scan.

## Solution
Restructure with a title and numbered points:

**New text:**
```
TRAFFIC MANAGEMENT: 1) Primary purpose is SEGREGATION — keeping pedestrians and vehicles apart 2) Dedicated pedestrian walkways must be clearly marked 3) One-way systems and speed limits control vehicle movement 4) Physical barriers separate work zones from traffic routes
```

This produces:
- Bold title: "TRAFFIC MANAGEMENT"
- Four numbered cards, each with one clear point
- Easy to scan and digest on mobile

## Implementation
Single SQL migration updating `content_json` for lesson `5.3`, card position 5.

### Files
- New migration: `supabase/migrations/XXXX_update_lesson_5_3_card_5_text.sql`

