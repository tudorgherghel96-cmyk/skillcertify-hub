

# Radically Improve KeyTerm Cards

## Problem
Current KeyTerm cards are visually flat — small emoji icon, tiny label, and a basic green-tinted box with plain text. They don't command attention or help students absorb terminology effectively. The definition text blends together and lacks visual structure.

## Design

Redesign to match the app's established "Top Bar + Side Accent" engagement pattern, but with a distinct green identity for terminology:

### New layout for `src/components/lesson/cards/KeyTerm.tsx`

1. **Bold header section** — Large green top accent bar (3px, full width), "📖 KEY TERM" label in green with stronger sizing (13px, weight 800)
2. **Term as hero text** — The term itself displayed at 26px, weight 900, white, with a subtle green underline/glow to make it the focal point
3. **Definition in a glassmorphism panel** — Frosted glass card (`rgba(255,255,255,0.06)`, `backdrop-blur(12px)`, rounded, border) with:
   - Green left accent bar (3px)
   - Definition text at 16px, line-height 1.8, weight 500
   - Auto-bold key terms (ALL CAPS, text before colons) — already implemented
4. **Sentence splitting** — If definition contains multiple sentences (period-separated), render each as a separate bullet point with a green dot, making long definitions scannable
5. **Dual-term layout** — When `term2`/`definition2` exist, render both with a subtle divider between them, each with its own hero term + definition panel
6. **Spacing** — More breathing room: 20px gaps between sections, 24px padding inside panels

### What stays the same
- Props interface unchanged (`term`, `definition`, `term2?`, `definition2?`)
- `highlightDef` function stays (already good)
- No changes to SwipeContainer — same props passed through

### Files changed
- `src/components/lesson/cards/KeyTerm.tsx` — full redesign

