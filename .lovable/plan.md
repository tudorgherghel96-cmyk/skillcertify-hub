

# Shuffle DragDrop Items So Pairs Aren't Obvious

## Problem
Items and targets render in the same positional order, so each item sits directly next to its correct match. The game has no challenge.

## Fix
In `DragDrop.tsx`, shuffle the `items` array on initial render using a `useMemo` with a Fisher-Yates shuffle. This randomizes the left column while keeping the right column (targets) in place, so users actually have to think about which item matches which target.

### Change in `DragDrop.tsx`
- Add a `useMemo` at the top of the component that creates a shuffled copy of `items`:
```typescript
const shuffledItems = useMemo(() => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}, [items]);
```
- Replace all references to `items.map(...)` in the render with `shuffledItems.map(...)`
- Keep the `items.find(...)` call for the dragging ghost element as-is (it just looks up text by id)

One file changed, no other modifications needed.

