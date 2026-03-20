

# Add Photos to Split Screen Card 18 (Lesson 1.7)

## What changes

### 1. Copy and optimize images
Save the uploaded photos as optimized WebP files:
- `public/images/lessons/no-ppe.webp` (Option A — wrong)
- `public/images/lessons/full-ppe.webp` (Option B — correct)

### 2. Update database content
Update card `75d1e411-9e5d-4d13-b71d-fe68da1562d6` to add `left_image` and `right_image` fields:
```json
{
  "left": "No goggles, no ear protection, no gloves — exposed to flying debris, loud noise, and chemical burns.",
  "right": "Full PPE: goggles, ear defenders, gloves, dust mask — every hazard covered and protected.",
  "left_image": "/images/lessons/no-ppe.webp",
  "right_image": "/images/lessons/full-ppe.webp",
  "title": "Which worker is protected?",
  "takeaway": "Full PPE isn't optional — each item protects against a specific hazard. Missing even one piece leaves you exposed."
}
```

### 3. Update SplitScreen component
- Add optional `left_image` and `right_image` props
- Render images above the text in each panel — clickable photos with rounded corners, `loading="eager"`, constrained height
- Images act as the tap target (clicking the image = clicking that side)

### 4. Update SwipeContainer
- Pass `left_image` and `right_image` from content_json to SplitScreen

### Files changed
- `public/images/lessons/no-ppe.webp` — optimized image (Option A)
- `public/images/lessons/full-ppe.webp` — optimized image (Option B)
- `src/components/lesson/cards/SplitScreen.tsx` — add image support
- `src/components/lesson/SwipeContainer.tsx` — pass image props
- New migration — update card content with image paths

