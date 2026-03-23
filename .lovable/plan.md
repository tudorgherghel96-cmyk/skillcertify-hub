

# Add Illustrations to 8-Step Lifting Technique Card

## What
Generate 8 simple, clear illustrations — one for each safe lifting step on card 6 of lesson 2.2 (Safe Lifting Technique) — and display them inline with each numbered step.

## The 8 Steps to Illustrate
1. **Plan** — worker assessing the load/route before lifting
2. **Feet shoulder-width** — feet positioned apart, stable base
3. **Bend knees, straight back** — squatting with straight spine
4. **Firm grip (palms)** — hands gripping box with full palms
5. **Load close** — box held tight against torso
6. **Lift with LEGS** — rising up using leg muscles, arrows on legs
7. **Move feet to turn** — feet pivoting, no spine twist
8. **Set down carefully** — lowering box with bent knees

## Technical approach

### 1. Generate illustrations
Use the Nano banana image generation API to create 8 clear instructional illustrations. Style: simple, clean line-art/flat style on dark background, consistent visual language across all 8. Save as optimized WebP files in `public/images/lessons/2.2_step_{1-8}.webp`.

### 2. Update DB content (`lesson_cards`)
Add an `illustrations` array to the `content_json` for card 6 of lesson 2.2, mapping each step number to its image path:
```json
{
  "text": "8 STEPS: 1) Plan ...",
  "illustrations": [
    "/images/lessons/2.2_step_1.webp",
    "/images/lessons/2.2_step_2.webp",
    ...
  ]
}
```

### 3. Update `RememberThis.tsx`
- Accept optional `illustrations` from content_json (passed through SwipeContainer)
- When an illustration exists for a numbered item, render a small rounded image (64×64px) to the left of or above the text inside each item panel
- Fallback gracefully — if no illustrations, render exactly as before

### 4. Update `SwipeContainer.tsx`
Pass the `illustrations` array from `content_json` through to RememberThis as a new optional prop.

### Files changed
- `public/images/lessons/2.2_step_{1-8}.webp` — 8 generated illustrations
- `src/components/lesson/cards/RememberThis.tsx` — support optional illustrations per item
- `src/components/lesson/SwipeContainer.tsx` — pass illustrations prop
- SQL migration — update content_json for lesson 2.2 card 6

