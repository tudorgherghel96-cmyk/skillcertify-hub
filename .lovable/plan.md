

# Make the 8 Lifting Steps Interactive for Better Retention

## Problem
Card 6 currently shows all 8 safe lifting steps as a static "Remember This" list. Students passively read through it — no engagement, no active recall, poor retention.

## Solution
Replace the single static card with **3 new interactive cards** inserted after card 6 (which stays as the reference). This creates a "learn → practice → test" micro-loop:

### Card 6 — Keep as-is
The existing "Remember This" card with illustrations stays as the initial teaching moment.

### New Card 6a — **Tap-to-Reveal: Steps in Order**
A `tap_to_reveal` card where students see 8 numbered tiles (Step 1, Step 2...) and must tap each to reveal the action. Uses the existing illustrations as icons on the front face. Forces active recall — "what was step 3 again?"

- Front: Step number + illustration thumbnail
- Back: The action text (e.g. "Bend knees, straight back")
- Layout: 2×4 grid to fit all 8

### New Card 6b — **Drag-and-Drop: Match Step to Action**
A `drag_drop` card where students drag the 8 action descriptions to match their correct step numbers. Tests whether they know the **sequence**, not just the individual steps.

- Items: The 8 action texts (shuffled)
- Targets: "Step 1" through "Step 8"
- Correct pairs mapped positionally

### New Card 6c — **Speed Drill: Quick-Fire Steps**
A `speed_drill` card that shows a step number and asks "What do you do at Step X?" with 4 multiple-choice options. 8 questions, timed (8 seconds each). Tests rapid recall under pressure.

## Technical approach

### Database migration
Insert 3 new cards after position 6 in lesson 2.2:
1. Shift all existing cards at positions 7-18 up by 3 (to positions 10-21)
2. Insert `tap_to_reveal` at position 7
3. Insert `drag_drop` at position 8  
4. Insert `speed_drill` at position 9

Each card's `content_json` will contain the appropriate structured data matching the existing component prop formats.

### No component changes needed
All three card types (`tap_to_reveal`, `drag_drop`, `speed_drill`) already exist and are fully functional. The SwipeContainer already routes to them. This is purely a content/data change.

### Files changed
- 1 SQL migration — shift positions + insert 3 new cards

