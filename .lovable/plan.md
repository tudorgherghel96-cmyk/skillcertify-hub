

# Enhance Bottom Caption Text Across All Card Types

## Problem
Image card captions are plain white text (15px, weight 500) on a basic gradient — visually flat, easy to ignore, and not engaging for students. The same applies to video overlay text (LeanInCallout, HoldUpCard) which could be more visually striking.

## What changes

### 1. `src/components/lesson/ImageSlide.tsx` — Redesign caption area
The biggest impact. Currently a simple gradient with plain text. Enhance to:

- **Stronger gradient** — taller (40% of card height), darker base for better contrast
- **Glassmorphism caption panel** — wrap text in a frosted glass card (`rgba(255,255,255,0.08)`, `backdrop-filter: blur(16px)`, rounded corners, subtle border)
- **Better typography** — 16px size, weight 600, line-height 1.5, letter-spacing 0.2px
- **Auto-highlight key terms** — reuse the `highlightKeyTerms` logic from RememberThis to bold ALL-CAPS words and text before colons
- **Left accent bar** — 3px blue/amber vertical bar on the left edge of the caption panel for visual anchoring
- **Subtle entrance animation** — fade-in when `isActive` becomes true (opacity transition)
- Keep TEST TIP callout styling as-is (already good)

### 2. `src/components/lesson/overlays/LeanInCallout.tsx` — More eye-catching
- Add a **blue left accent bar** (3px) inside the callout
- Add a small **"👀 Lean in"** label above the text in blue-400
- Increase font size from 16px to 17px

### 3. `src/components/lesson/overlays/HoldUpCard.tsx` — More attention-grabbing
- Add a **red/amber top accent bar** (full width, 3px)
- Add **"✋ Hold up"** label in bold above the text
- Add subtle amber border glow

### Files changed
- `src/components/lesson/ImageSlide.tsx` — glassmorphism caption panel with key term highlighting
- `src/components/lesson/overlays/LeanInCallout.tsx` — add accent bar + label
- `src/components/lesson/overlays/HoldUpCard.tsx` — add accent bar + label

