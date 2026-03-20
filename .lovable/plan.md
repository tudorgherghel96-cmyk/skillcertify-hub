

# Split Lesson 1.5 Card 14 — Image Only + New Text Card

## Current State
Card 14 (ID: `9a10e6a5-d78d-4b13-9c47-82a54060c9be`) is an `image` card showing `1.4_photo_2.webp` with caption: *"Near misses MUST be reported — they help prevent future accidents. Fractures, amputations, and injuries causing 7+ days off work must be reported under RIDDOR."*

Cards after it: 15 (quiz_card), 16 (lesson_complete).

## Plan

### 1. Update card 14 — image only, no caption
Remove caption from `content_json`, keep alt text only.

### 2. Insert new card at position 15
A `remember_this` card with text: *"Near misses MUST be reported — they help prevent future accidents. Fractures, amputations, and injuries causing 7+ days off work must be reported under RIDDOR."*

This card type renders with a highlight/callout style which suits the instructional tone.

### 3. Bump existing cards
- Quiz card (pos 15) → position 16
- Lesson complete card (pos 16) → position 17

### Technical Detail
Three SQL statements via the insert tool — update card 14's `content_json`, shift positions 15–16 up by 1, insert new `remember_this` card at position 15.

