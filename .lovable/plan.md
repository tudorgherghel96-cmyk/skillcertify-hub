

# Fire Triangle Visual Layout for Tap-to-Reveal

## What changes
The `TapToReveal` component will detect when the title contains "Fire Triangle" (or when a `layout: "triangle"` field is set in content_json) and render a triangle-shaped layout instead of the default 2×2 grid.

### Triangle layout design
```text
        ┌─────────┐
        │  HEAT   │  ← top center (panel 0)
        └────┬────┘
       ╱      ╲
  ┌────┴──┐  ┌──┴────┐
  │ FUEL  │  │OXYGEN │  ← bottom left & right (panels 1, 2)
  └───────┘  └───────┘
        ┌─────────┐
        │ 🧯 Stop │  ← center below triangle (panel 3)
        └─────────┘
```

- 3 panels arranged as an inverted triangle: 1 on top, 2 on bottom row
- 4th panel (extinguisher) centered below
- SVG triangle outline drawn connecting the 3 corners, glowing when all 3 sides are revealed
- Each panel is a tappable card (same flip animation as before)
- Front shows emoji + label ("🔥 Heat", "⛽ Fuel", "💨 Oxygen")
- Back reveals the detail text

### Implementation

**`src/components/lesson/cards/TapToReveal.tsx`**
- Add a `layout?: string` prop
- When `layout === "triangle"` (or auto-detect from title containing "Triangle"):
  - Render custom triangle layout instead of grid
  - Draw faint SVG lines between the 3 panel positions to form a triangle shape
  - Lines glow green when the connected panels are revealed
  - 4th panel rendered centered below the triangle
- Default 2×2 grid remains for all other tap_to_reveal cards

**`src/components/lesson/SwipeContainer.tsx`**
- Pass `layout` field from `content_json` to `TapToReveal`

**Database migration**
- Update card `171d2556-9935-4b3b-b0cd-3fc6dba7000b` to add `"layout": "triangle"` to `content_json`

### Files changed
- `src/components/lesson/cards/TapToReveal.tsx` — add triangle layout mode
- `src/components/lesson/SwipeContainer.tsx` — pass `layout` prop
- New migration — add layout field to the card's content_json

