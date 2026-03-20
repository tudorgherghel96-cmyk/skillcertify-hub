

# Improve RememberThis Content Readability

## Problem
Many "Remember This" cards fall through to the plain-text fallback because their content doesn't match the numbered list or key=value patterns. This results in dense, hard-to-read paragraphs. Examples:
- "HYGIENE: Wash hands before eating. Weil's disease from rat urine. Cement causes dermatitis/burns."
- "SCAFFOLD: Guardrails (top), Mid-rails (middle), Toe boards (bottom)."
- "NOISE: 80 dB = available. 85 dB = MANDATORY. Permanent."

These all render as a single block of text with no visual structure.

## Solution
Enhance the parser to detect **sentence-based lists** (period-separated facts) as a new structured type, and improve the component to render them as distinct visual items.

### `src/lib/formatRememberText.ts`
Add a new detection step between key=value and fallback:

1. **New item type**: Add `"bullet"` to `ParsedItem.type`
2. **Sentence splitter** (step 3.5): After key=value fails, split the body on `.` boundaries. If there are 2+ meaningful sentences (each >8 chars), return them as `bullet` items
3. This catches all the cards that currently fall through to a dense paragraph

### `src/components/lesson/cards/RememberThis.tsx`
1. **Render bullet items** with a small blue dot/dash indicator (instead of numbered badge) — each sentence gets its own panel row, same styling as numbered items
2. **Increase gap** from `gap-3` to `gap-4` for more breathing room between items
3. **Add subtle intro text** — when a title exists but items are sentence-based, render a thin separator after the title
4. **Bold key terms** — auto-bold text before colons or in ALL CAPS within each item for emphasis

### Files changed
- `src/lib/formatRememberText.ts` — add sentence-based list detection + bullet type
- `src/components/lesson/cards/RememberThis.tsx` — render bullet items, increase spacing, bold key terms

