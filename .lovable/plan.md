
# Fix: Matching Game, Pattern Card, and Flashcards

## Problems Found

### 1. Matching Game (DragDrop) -- Tiles show blank, nothing works
The database stores items and targets as simple text lists (e.g., `["Trailing cables", "Unmarked bottles"]`), but the code expects objects with `id` and `text` fields. Since the data is just strings, the component tries to read `.id` and `.text` on a plain string, getting `undefined` for both -- so tiles render empty.

Additionally, the database has no `correct_pairs` field. The correct matching is implied by position (first item matches first target), but the code expects an explicit map.

### 2. Pattern Card (Match Hazard to Disease) -- Nothing renders at all
The database stores data as `pairs: [{ hazard: "Silica dust", disease: "Silicosis" }, ...]`, but the code looks for separate `hazards` and `diseases` arrays which don't exist in the data. Both default to empty arrays, so the component renders nothing.

### 3. Flashcards -- Needs verification
The flashcard component code and data generation look correct. The issue may be that no flashcards are generated for the selected module (if lessons aren't completed or the content data doesn't include `remember`/`testTip` blocks). Will add defensive handling to show a clear message and ensure text is visible.

---

## Fix Plan

### Step 1: Fix DragDrop data normalization in SwipeContainer
In the `SwipeContainer.tsx` `CardRenderer`, transform the flat string arrays from the database into the `{ id, text }` objects the component expects, and auto-generate `correct_pairs` from positional matching:

```text
// Before (broken):
items={(content.items as { id: string; text: string }[]) || []}
targets={(content.targets as { id: string; text: string }[]) || []}
correct_pairs={(content.correct_pairs as Record<string, string>) || {}}

// After (fixed):
// Normalize flat strings to { id, text } objects
// Generate correct_pairs from position (item-0 -> target-0)
```

### Step 2: Fix PatternCard data normalization in SwipeContainer
Transform the `pairs` array from the database into the separate `hazards`, `diseases`, and `correct_pairs` that the component expects:

```text
// Before (broken):
hazards={(content.hazards as ...) || []}  // doesn't exist in DB
diseases={(content.diseases as ...) || []} // doesn't exist in DB

// After (fixed):
// Extract from content.pairs: [{ hazard, disease }]
// Build hazards[], diseases[], and correct_pairs map
```

### Step 3: Add defensive handling in FlashcardMode
Add null/undefined guards on the current card's `front` and `back` fields, and ensure fallback text is displayed if data is missing.

### Step 4: Add defensive handling in DragDrop and PatternCard components
Add guards so if `items`/`targets`/`hazards`/`diseases` are empty, a meaningful fallback message is shown instead of a blank screen.

---

## Technical Details

**Files to modify:**
- `src/components/lesson/SwipeContainer.tsx` -- Fix data normalization for `drag_drop` and `pattern_card` cases (lines 164-230)
- `src/components/lesson/cards/DragDrop.tsx` -- Add empty state guard
- `src/components/lesson/cards/PatternCard.tsx` -- Add empty state guard
- `src/components/practice/FlashcardMode.tsx` -- Add null guards on card text fields

**No database changes needed** -- the data in the database is correct; the code just wasn't reading it properly.
