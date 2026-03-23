

# Fix Card 4 (Lesson 4.5) — Improve Text Layout

## Problem
The current text is a single dense block:
> "Zero tolerance. Impairs judgment, slows reactions. Prescribed medication: if drowsy, MUST inform supervisor BEFORE starting work."

The `formatRememberText` parser splits on periods with `>8` char filter, but "Zero tolerance" (14 chars) gets parsed as a bullet alongside the other sentences. The result is three tightly packed bullet items with no clear hierarchy — making it hard to scan and digest.

## Solution
Restructure the text with a title and numbered points so the parser produces a clear, scannable layout:

**New content_json text:**
```
DRUGS, ALCOHOL & SUBSTANCE MISUSE: 1) Zero tolerance on site — never work under the influence 2) Impairs judgment and slows reaction times 3) Prescribed medication — if it causes drowsiness, MUST inform your supervisor BEFORE starting work
```

This gives:
- A bold title header: "DRUGS, ALCOHOL & SUBSTANCE MISUSE"
- Three clearly separated numbered cards with distinct points
- Each point is digestible on its own

## Implementation
Single SQL migration updating `content_json` for lesson `4.5`, card position 4.

### Files
- New migration: `supabase/migrations/XXXX_update_lesson_4_5_card_4_text.sql`

