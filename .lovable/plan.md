

# Multi-Fix Plan: 14 Fixes Across the Platform

## FIX 1 — Module Index Titles
**File: `src/data/courseData.ts`**

Update lesson titles in the `MODULES` array:
- Module 1: Swap titles for lessons 4, 5, 6 to match DB content
  - 1.4 → "Dynamic Risk Assessments"
  - 1.5 → "Reporting Accidents and Near Misses"
  - 1.6 → "Safety Signs and Symbols"
- Module 2: Update lessons 3 and 4
  - 2.3 → "TILE Assessment"
  - 2.4 → "Team Lifting & Mechanical Aids"
- Module 4: Update lesson 3
  - 4.3 → "Noise and Vibration"
- Module 5: Update lessons 1 and 2
  - 5.1 → "Banksman and Exclusion Zones"
  - 5.2 → "Machine Guarding & Isolation"

---

## FIX 2 — Quiz Reassignment (Database Migrations)

Based on DB analysis, the quiz questions need significant reworking. Multiple SQL migrations needed.

**Module 3:** The quizzes on 3.1 and 3.2 are actually correct. The issues are:
- 3.3 quiz (fall protection hierarchy) → belongs on 3.5. Move it there.
- 3.4 quiz has scaffolding inspection Q → some Qs belong on 3.3
- 3.5 quiz has "who can erect scaffolding" → belongs on 3.3

Approach: Replace quiz content_json for lessons 3.3, 3.4, 3.5 with properly targeted questions:
- 3.3: Scaffolding-focused quiz (guardrails, toe boards, inspection frequency, who can erect, scaffold tags)
- 3.4: Fragile surfaces quiz (new questions about rooflights, crawling boards, warning signs, fragile roof markings)
- 3.5: Fall protection hierarchy quiz (avoid > prevent > arrest > minimise, harnesses, guardrails as prevention)

**Module 4:** Quizzes are shifted by one lesson:
- 4.2 quiz (drugs/alcohol) → move to 4.5 (Drugs, Alcohol & Substance Misuse) — but rewrite for 4.5's specific scope
- 4.3 quiz (asbestos) → move to 4.2
- 4.4 quiz (noise) → move to 4.3
- 4.5 quiz (health surveillance/leptospirosis) → remove, doesn't match any lesson
- Write new quiz for 4.4 (Dust and Chemicals): silicosis, dermatitis, cement burns, RPE
- Write new quiz for 4.5 (Drugs/Alcohol): prescribed medication reporting, zero tolerance, impaired judgment

**Module 5:**
- 5.3 quiz (electrical tools) → remove — doesn't match Traffic Management
- 5.4 quiz (vehicles/pedestrians) → this IS traffic management content, move to 5.3
- Write new quiz for 5.3: traffic management (segregation, pedestrian routes, one-way systems)
- Write new quiz for 5.4: overhead services/buried utilities (CAT scanner, cable strikes, permit to dig)

All changes via SQL UPDATE on `lesson_cards` table, updating `content_json` for `card_type = 'quiz_card'`.

---

## FIX 3 — Progress Tracking
**File: `src/hooks/useDbLessonProgress.ts`**

The `isLessonDone` check in `ModuleOverview.tsx` uses `progressMap[key]?.completed`. Need to verify the hook loads completion status correctly. The DB-backed progress may not sync with the local `ProgressContext`. Will check if `useDbLessonProgress` marks lessons as done when quiz is passed, and fix if needed.

Also check `ProgressContext.tsx` — the `getLessonsCompleted` function only checks `mp.lessons[i]?.completed` from local state. May need to merge DB quiz pass status into this count.

**File: `src/pages/ModuleOverview.tsx`** — The `lessonsComplete` counter on line 126 uses `isLessonDone` which checks the DB progress map. If quiz passes aren't marking the lesson as completed in the DB, that's the bug. Will ensure the quiz completion handler in `LessonQuiz.tsx` or `LessonPlayer.tsx` also marks the lesson as completed in `lesson_progress`.

---

## FIX 4 — CSCS Card Expiry Date
**Files: `src/pages/MyCard.tsx`, `src/pages/Journey.tsx`**

The expiry dates are hardcoded as `"31/12/2031"` — this is actually fine (it's in the future). The user mentioned "Dec 2025" but I don't see that in the code. The `CardWallet` component displays card images which may have text baked into the image. The dynamic expiry in `CscsSmartCheck` and `GreenCardStatus` comes from props. Will change the hardcoded dates to be dynamically computed: 5 years from now.

---

## FIX 5 — Dashboard Too Sparse
**File: `src/pages/JourneyDashboard.tsx`**

The JourneyDashboard (which is the `/dashboard` route) is very minimal: greeting, progress circle, continue button, quick actions, and DueToday. Add:
- Streak display with 🔥 (already partially shown in top bar, make it more prominent as a card)
- "Today's goal" nudge card (e.g. "Complete 1 lesson today")
- "Weak areas" section showing lowest-scoring practice topics with links

Import `MODULES`, `getModuleProgress` and display weak areas from practice scores.

---

## FIX 6 — Bottom Nav Sticky
**File: `src/components/layout/BottomNav.tsx`**

Already `position: fixed` at bottom. The `sm:hidden` class hides it on desktop. The issue is it returns `null` for `/lesson/` routes (correct). For practice pages (`/practice/:moduleId`), they're outside AppLayout (line 83-95 of App.tsx), so BottomNav doesn't render there at all. Fix by either:
- Moving practice routes inside AppLayout, OR
- Adding BottomNav directly to practice pages

Better approach: Move practice/GQA/results routes inside AppLayout so they get the nav. Exception: lesson player stays outside.

---

## FIX 7 — Certificate Topic Names
**File: `src/pages/Profile.tsx` (line 205)**

Change `remaining.map((m) => `Topic ${m.id}`)` to `remaining.map((m) => m.title)`.

---

## FIX 8 — Username Capitalisation
**File: `src/pages/JourneyDashboard.tsx` (line 40-42)**

Capitalize first letter: add `.replace(/^./, c => c.toUpperCase())` to firstName.

Also fix in `Dashboard.tsx` line 162 for the other dashboard view.

---

## FIX 9 — Desktop "Swipe Up to Start"
**File: `src/components/lesson/HeroSlide.tsx` (lines 135-138)**

Detect if desktop (window width > 768 or pointer: fine media query). Show "Click to start" on desktop, "Swipe up to start" on mobile. Add onClick handler to the HeroSlide that triggers advancing to next card (need to pass an `onAdvance` callback prop).

---

## FIX 10 — Practice Page Navigation
Covered by FIX 6 — moving practice routes inside AppLayout.

---

## FIX 11 — PPE Hierarchy
**Database migration** — Update lesson 1.7, card_position 16:

Change text from:
`"PPE HIERARCHY: 1) ELIMINATE 2) REDUCE 3) INFORM/TRAIN 4) PPE (LAST resort). PPE is the LEAST effective control measure."`

To:
`"HIERARCHY OF CONTROLS: 1) ELIMINATE the hazard completely 2) SUBSTITUTE with something less dangerous 3) ENGINEERING CONTROLS — physical barriers, ventilation, guards 4) ADMINISTRATIVE CONTROLS — training, signage, safe systems of work 5) PPE — personal protective equipment (LAST resort). PPE is the LEAST effective control measure."`

---

## FIX 12 — New Lesson: Confined Spaces (5.5)
**Database migration** — Insert ~12 new `lesson_cards` rows for lesson_id `'5.5'`:
1. Hero card: "Confined Spaces"
2. Key term: Confined Space definition
3. Image card: examples (tanks, silos, manholes)
4. Remember This: permit to work required, atmospheric testing, rescue team on standby
5. Test Tip: "NEVER enter without a permit to work"
6. Quick Check: "Before entering a confined space you should..." (correct: ensure a permit to work is in place)
7. Remember This: NEVER enter to rescue without proper equipment
8. Image: warning signs for confined spaces
9. Quiz card: 5 questions about confined spaces
10. Lesson Complete card

**File: `src/data/courseData.ts`** — Add `{ id: 5, title: "Confined Spaces" }` to Module 5 lessons array.

---

## FIX 13 — New Lesson: CDM 2015 (1.9)
**Database migration** — Insert ~12 new `lesson_cards` rows for lesson_id `'1.9'`:
1. Hero card: "CDM 2015: Who Does What"
2. Key term: CDM definition
3. Teaching cards about duty holders (Client, Principal Designer, Principal Contractor, etc.)
4. Remember This: Client has overall responsibility
5. Test Tip: "The CLIENT ensures the project is properly managed"
6. Drag-and-drop: match roles to duties
7. Quiz card: 5 questions
8. Lesson Complete card

**File: `src/data/courseData.ts`** — Add `{ id: 9, title: "CDM 2015: Who Does What" }` to Module 1 lessons array.

---

## FIX 14 — Scaffold Inspection Wording
**Database migration** — Update lesson 3.3, card_position 4:

Change text from:
`"SCAFFOLD: Guardrails (top), Mid-rails (middle), Toe boards (bottom). Inspect every 7 days + after bad weather. Competent person only."`

To:
`"SCAFFOLD COMPONENTS: Guardrails (top), Mid-rails (middle), Toe boards (bottom). INSPECTION REQUIRED: 1) Before first use 2) At intervals not exceeding 7 days 3) After any event liable to jeopardise safety (bad weather, alteration, damage, or anything affecting stability). Must be done by a COMPETENT person only."`

---

## Summary of files to modify
- `src/data/courseData.ts` — title fixes + new lessons 1.9 and 5.5
- `src/pages/JourneyDashboard.tsx` — capitalise name, add streak/goal/weak areas cards
- `src/pages/Profile.tsx` — certificate topic names
- `src/components/lesson/HeroSlide.tsx` — desktop click-to-start
- `src/App.tsx` — move practice/GQA routes inside AppLayout
- `src/components/layout/BottomNav.tsx` — hide on lesson AND practice-quiz/gqa-test pages if needed (or just let AppLayout handle it)
- `src/pages/MyCard.tsx` + `src/pages/Journey.tsx` — dynamic expiry date
- New SQL migration(s) — quiz reassignments, new lessons 5.5 and 1.9, PPE hierarchy fix, scaffold wording fix

