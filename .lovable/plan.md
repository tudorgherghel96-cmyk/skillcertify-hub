

# Improve "Remember This" Card Text Layout

## Problem
All three "Remember This" renderers dump content into a single `<p>` tag. The database content is structured — numbered steps, key terms with colons, logical groupings — but it renders as a wall of text. Examples:
- "5 STEPS OF RISK ASSESSMENT: 1) Identify the hazards. 2) Who might be harmed..."
- "8 STEPS: 1) Plan 2) Feet shoulder-width 3) Bend knees..."
- "T.I.L.E: T=Task... I=Individual... L=Load... E=Environment..."

## Approach
Smart text formatting that auto-detects structure and renders it with visual hierarchy — no database changes needed.

### Text parsing logic (shared utility)
Create a `formatRememberText()` function that:
1. **Detects a title/header** — text before the first colon on the first line (e.g., "5 STEPS OF RISK ASSESSMENT:")
2. **Splits numbered items** — regex for `1)`, `2)` or `1.`, `2.` patterns → renders as a clean numbered list with spacing
3. **Splits key=value pairs** — patterns like `T=Task`, `I=Individual` → renders each on its own line with the key bolded
4. **Falls back gracefully** — short text or unstructured content renders as before (centered paragraph)

### Components updated

**1. `src/components/lesson/cards/RememberThis.tsx`** (DB-driven, dark background)
- Import and use formatter
- Render title as a bold heading above a blue divider
- Render list items with numbers styled as accent-coloured badges
- Increase padding and spacing between items

**2. `src/components/lesson/SlideRenderer.tsx` → `RememberSlide`** (i18n slides)
- Same formatting logic applied to `slide.text`
- Left-align the body text (keep header centred)

**3. `src/components/lesson/RememberThis.tsx`** (inline callout)
- Apply same formatter for consistency
- Already has decent spacing, just needs list rendering

### Visual design
- Title: uppercase, small, blue/red accent, letter-spaced (existing)
- List items: left-aligned, each on its own line, numbered badges (1, 2, 3...) in small coloured circles
- Key-value pairs: key in bold, value in regular weight, separated by an em dash
- Line height 1.7, 12px gap between items
- Max-width constraint maintained for readability

### Files changed
- `src/lib/formatRememberText.ts` — new shared parser
- `src/components/lesson/cards/RememberThis.tsx` — use formatter
- `src/components/lesson/SlideRenderer.tsx` — use formatter in RememberSlide
- `src/components/lesson/RememberThis.tsx` — use formatter in inline callout

