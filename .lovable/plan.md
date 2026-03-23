

# Add "Example of Internal Void" Card

## Current state
- Lesson 3.1 card 5 mentions "INCLUDING STANDING NEAR VOIDS"
- Lesson 3.1 card 11 has a remember_this about "unguarded openings, trenches, and floor voids" with the voids image
- Lesson 3.4 card 9 uses image `3.4_photo_2.webp` from `final-correct-media` bucket — this is the image the user identifies as showing an internal void

## Where to place it
The most appropriate location is in **Lesson 3.1 (What is Working at Height)** right after card 5 (which mentions "INCLUDING STANDING NEAR VOIDS"). Placing a visual example of an internal void immediately after that reference reinforces the concept. This means inserting at **position 6**, shifting all existing cards 6-14 forward by 1.

## Plan
1. Shift all cards in lesson 3.1 at positions 6-14 forward by 1 (to 7-15)
2. Insert a new `image` card at position 6 with:
   - `media_file = '3.4_photo_2.webp'`
   - `media_bucket = 'final-correct-media'`
   - `content_json = {"caption": "Example of internal void", "alt": "Example of an internal void on a construction site"}`
   - `card_type = 'image'`
   - `lesson_id = '3.1'`, `module_id = 3`, `xp_value = 0`

## Technical details
- 9 UPDATE statements to shift positions (14→15, 13→14, ... 6→7) — must be done in reverse order
- 1 INSERT for the new card at position 6
- All done via the insert tool (data operations, not schema changes)

