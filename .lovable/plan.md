

# Split Lesson 1.1 Card 17 and Add New Image

## Current State
Card 17 (lesson 1.1) is an `image` card showing `1.1_photo_6.webp` with caption: *"Waste and buried services are hidden hazards. TEST TIP: The exam tests whether you can identify BOTH visible and hidden hazards."*

Cards 18 (quiz) and 19 (lesson_complete) follow.

## Plan

### 1. Optimize uploaded image
Convert `buried_waste.jpeg` to WebP at 800px width, save as `public/images/buried-waste-hazard.webp`.

### 2. Update card 17 — image only, no caption
Remove the caption text and test tip from card 17's `content_json`, keeping it as a clean image-only card.

### 3. Insert new card at position 18
New `image` card with:
- Caption: *"Waste and buried services are hidden hazards. TEST TIP: The exam tests whether you can identify BOTH visible and hidden hazards."*
- Media: `/images/buried-waste-hazard.webp` (local optimized asset)

### 4. Bump existing cards 18→19 and 19→20
Shift the quiz card and lesson_complete card positions up by 1.

All data changes via SQL using the insert/update tool (not migrations).

