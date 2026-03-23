

# Show Step Illustrations on Tap-to-Reveal Card 7

## Problem
Card 7's `tap_to_reveal` panels have `icon` set to image paths (e.g. `/images/lessons/2.2_step_1.webp`), but the component passes these to `SafetySignIcon` which only handles SVG icon names like "prohibition" or "warning". The illustrations are silently ignored.

## Fix
Update `TapToReveal.tsx` to detect when `panel.icon` is an image path (starts with `/` or contains `.webp`/`.png`/`.jpg`) and render an `<img>` tag instead of `SafetySignIcon`. This applies to both the `FlipCard` component (used in triangle layout) and the inline grid layout.

### Changes in `src/components/lesson/cards/TapToReveal.tsx`
- Add a small helper: `const isImagePath = (s: string) => s.startsWith('/') || /\.(webp|png|jpg|jpeg|svg)$/i.test(s)`
- In `FlipCard` front face: if `panel.icon` is an image path, render `<img src={panel.icon} />` (rounded, 36px) instead of `<SafetySignIcon>`
- In the grid layout front face: same logic — render `<img>` for image paths, `<SafetySignIcon>` for named icons

### Files changed
- `src/components/lesson/cards/TapToReveal.tsx` — add image path detection + `<img>` rendering

