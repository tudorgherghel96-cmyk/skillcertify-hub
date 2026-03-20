

# Fix DragDrop — Add Mouse Event Support

## Problem
The DragDrop component only uses `onTouchStart/Move/End` events. In the Lovable preview (and desktop browsers), the user interacts with mouse events, not touch events — so dragging does nothing.

## Plan

### Update `DragDrop.tsx` to support both mouse and touch

Add mouse event handlers (`onMouseDown`, `onMouseMove`, `onMouseUp`) mirroring the existing touch handlers:

- **`onMouseDown`** on each item: sets `dragging` and `dragPos` using `e.clientX/Y`
- **`onMouseMove`** on the container: updates `dragPos`
- **`onMouseUp`** on the container: hit-tests against target refs and performs match/wrong logic (same as `handleTouchEnd`)

Extract the shared "drop" logic (hit-test targets, check correct pairs, update matched state) into a reusable function called from both `handleTouchEnd` and `handleMouseUp`.

Add `onMouseDown` to each item div alongside the existing `onTouchStart`. Add `onMouseMove` and `onMouseUp` to the container div alongside `onTouchMove` and `onTouchEnd`.

### Fix `touchAction` conflict in `InteractiveSlide.tsx`

Change `touchAction: "manipulation"` to `touchAction: "none"` so it doesn't override the DragDrop's `touchAction: "none"` setting, which is needed to prevent the browser from intercepting touch drags as scrolls.

No other files need changes.

