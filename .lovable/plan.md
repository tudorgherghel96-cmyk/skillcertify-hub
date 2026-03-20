

# Add Coloured Safety Sign Symbols to DragDrop Card (Lesson 1.6, Card 9)

## Problem
The drag_drop card at position 9 in lesson 1.6 currently shows plain text like "Red circle sign", "Yellow triangle sign". The user wants actual coloured SVG symbols rendered inline so the learner visually matches shapes to meanings.

## Approach
Add an `icon` field to each item in the database content, then render inline SVG symbols in the DragDrop component when an icon is present.

### 1. Update database content for card `8628f6fa-a5a3-4499-861c-1c52b96cded6`
Replace the flat string array with objects containing `text` and `icon` keys:

```json
{
  "items": [
    { "text": "Red Circle", "icon": "prohibition" },
    { "text": "Yellow Triangle", "icon": "warning" },
    { "text": "Blue Circle", "icon": "mandatory" },
    { "text": "Green Rectangle", "icon": "safe_condition" }
  ],
  "targets": ["Prohibition — Do NOT", "Warning — Danger", "Mandatory — You MUST", "Safe Condition — Safety info"]
}
```

### 2. Add a `SafetySignIcon` helper component
Small inline SVG renderer in `DragDrop.tsx` (or separate file) that maps icon keys to coloured shapes:
- **prohibition**: Red circle with white diagonal line
- **warning**: Yellow triangle with black exclamation mark
- **mandatory**: Blue filled circle with white centre dot
- **safe_condition**: Green rectangle with white cross/arrow

### 3. Update DragDrop component
- Extend the `DragItem` interface to include optional `icon?: string`
- When normalizing items in `SwipeContainer.tsx`, pass through the `icon` field from objects
- Render the icon inline (24×24px) next to the item text in both the draggable items and the floating drag ghost

### Technical Detail
- SVGs are pure inline JSX — no image files needed, zero network requests
- The normalizer in SwipeContainer already handles objects with `{ id, text }` — we just need to also pass `icon` through
- The DragDrop component renders `{item.text}` — we prepend the icon SVG when `item.icon` is set
- Existing cards without icons are unaffected (icon is optional)

