

# Comprehensive Plan: Images + End-of-Lesson Quizzes

## Overview

This plan adds 32 missing images to the lesson seed data and builds a complete end-of-lesson quiz system across all 26 lessons. It also includes a new Supabase table for tracking quiz results, a new `LessonQuiz` card component, module-level practice quizzes, and GQA test simulation improvements.

---

## Important: Lesson ID Mapping Discrepancy

The DB seed data and `courseData.ts` have different lesson orderings for Module 1 (lessons 4-6 are swapped). Images are named by DB lesson_id, so all image placement will follow the DB structure:

- DB 1.4 = Dynamic Risk Assessment (courseData id:6)
- DB 1.5 = Reporting Accidents (courseData id:4)
- DB 1.6 = Safety Signs (courseData id:5)

The quiz questions provided in the prompt will be re-mapped to match the correct DB lesson. No existing code or data will be altered for this discrepancy.

---

## Phase 1: Add 32 Missing Images to Seed Data

**What**: Create a new SQL migration file that INSERTs the 32 missing image_card entries into `lesson_cards`, using the next available `card_position` in each lesson.

**Approach**:
- Each image is added as card_type `'image'` with `media_bucket = 'old-content-images'`
- Images are placed AFTER relevant teaching content, BEFORE quiz questions, spaced evenly
- Each image gets an exam-relevant caption with TEST TIP where appropriate
- Existing card positions are shifted up (UPDATE card_position) to make room for new images in the middle of lessons
- The 26 existing images remain untouched

**Files created**:
- New SQL migration file for adding missing images (run via migration tool)

**Per-lesson breakdown** (32 images across 18 lessons):
- Lesson 1.1: +3 images (photo_3, photo_5, photo_6)
- Lesson 1.2: +2 images (photo_1, photo_3)
- Lesson 1.3: +2 images (photo_1, photo_3)
- Lesson 1.4: +2 images (photo_2, photo_3)
- Lesson 1.5: +2 images (photo_1, photo_3)
- Lesson 1.6: +2 images (photo_2, photo_3)
- Lesson 1.7: +3 images (photo_2, photo_3, photo_5)
- Lesson 1.8: +2 images (photo_1, photo_3)
- Lesson 2.1: +1 image (photo_3)
- Lesson 2.2: +2 images (photo_1, photo_2)
- Lesson 2.3: +2 images (photo_2, photo_3)
- Lesson 2.4: +2 images (photo_2, photo_3)
- Lesson 3.1: +2 images (photo_2, photo_3)
- Lesson 3.2: +2 images (photo_1, photo_3)
- Lesson 3.3: +2 images (photo_1, photo_3)
- Lesson 3.4: +2 images (photo_1, photo_3)
- No new images for lessons 3.5, 4.4, 4.5, 5.3, 5.4 (prompt only lists through specific lessons per module -- images for 4.1-4.3, 5.1-5.2 are covered)

For Module 4 and 5 remaining lessons that have images in the prompt:
- Lesson 4.1: +2 images (photo_2, photo_3)
- Lesson 4.2: +2 images (photo_1, photo_3)
- Lesson 4.3: +2 images (photo_1, photo_2)
- Lesson 5.1: +2 images (photo_2, photo_3)
- Lesson 5.2: +2 images (photo_2, photo_3)

---

## Phase 2: New Supabase Table for Quiz Results

**What**: Create a `lesson_quiz_attempts` table to track per-lesson quiz results.

**Schema**:
```text
lesson_quiz_attempts
  id           uuid PK DEFAULT gen_random_uuid()
  user_id      uuid NOT NULL
  lesson_id    text NOT NULL (e.g., '1.4')
  score        integer NOT NULL
  total        integer NOT NULL
  passed       boolean NOT NULL
  answers_json jsonb DEFAULT '{}'
  attempted_at timestamptz DEFAULT now()
```

**RLS Policies**:
- Users can INSERT their own attempts (auth.uid() = user_id)
- Users can SELECT their own attempts (auth.uid() = user_id)
- No UPDATE or DELETE

---

## Phase 3: Build LessonQuiz Card Component

**What**: New `quiz_card` card type rendered in the lesson flow, appearing before the `lesson_complete` card.

**New files**:
- `src/components/lesson/cards/LessonQuiz.tsx` -- the main quiz component

**Component behavior**:
1. Shows "Lesson Quiz" title with question count (e.g., "Question 3 of 7")
2. Displays one question at a time with 4 options (A, B, C, D)
3. Tap to select, then confirm button to submit answer
4. Immediate feedback: green/red flash, correct answer highlighted, explanation shown, TEST TIP displayed
5. After all questions: circular progress indicator with score percentage
6. Pass/fail messaging against 80% threshold (informational) and 60% gating threshold
7. "Try Again" button reshuffles questions; "Continue" button only if >= 60%
8. Saves results to `lesson_quiz_attempts` table

**Integration with SwipeContainer**:
- Add `quiz_card` case to `CardRenderer` in `SwipeContainer.tsx`
- The quiz card fills the full slide and handles its own internal navigation (questions within the quiz)
- Swipe is blocked while quiz is in progress (user must complete or skip)

---

## Phase 4: Add Quiz Data to All 26 Lessons

**What**: Add quiz_card entries to the seed data for every lesson, positioned just before `lesson_complete`.

**Approach**:
- Each lesson gets a single `quiz_card` entry with `content_json` containing 5 questions
- Questions are taken from the prompt, re-mapped to correct DB lesson IDs
- The `content_json` structure follows the format specified in the prompt
- For lessons where the prompt provides quiz questions under a different topic name (due to the ordering discrepancy), questions will be matched by content/topic, not by lesson number

**Quiz question re-mapping** (prompt lesson -> DB lesson):
- Prompt "1.4 Accidents" -> DB 1.5 (Reporting Accidents)
- Prompt "1.5 Safety Signs" -> DB 1.6 (Safety Signs)
- Prompt "1.6 Dynamic RA" -> DB 1.4 (Dynamic Risk Assessment)
- Prompt "2.2 Responsibilities" -> DB 2.2 (Safe Lifting -- content overlap, will adapt)
- Prompt "2.3 How to Lift" -> DB 2.3 (TILE Assessment -- will use TILE questions)
- Prompt "2.4 Mechanical Aids" -> DB 2.4 (Team Lifting -- will adapt)
- Prompt "3.2 Hazards at Height" -> DB 3.2 (Ladder Rule -- will adapt)
- Prompt "3.3 Controlling Risks" -> DB 3.3 (Scaffolding -- will adapt)
- Prompt "3.4 Regulations" -> DB 3.4 (Fragile Surfaces -- will adapt)
- For lessons 3.5, 4.4, 4.5, 5.3, 5.4 which have no quiz questions in the prompt: will create appropriate questions based on the lesson content

**Implementation**: New SQL migration adding quiz_card rows

---

## Phase 5: Lesson Progression Gating on Quiz Score

**What**: Gate the next lesson behind a 60% quiz score minimum.

**Changes to existing files** (minimal, additive):
- `src/hooks/useDbLessonProgress.ts` -- add a query to check best quiz score per lesson
- `src/pages/ModuleOverview.tsx` -- add quiz status badge (not attempted / failed / passed) next to each lesson, and lock next lesson if previous quiz not passed at 60%+
- `src/pages/LessonPlayer.tsx` -- on quiz completion, save result and conditionally show "Continue to next lesson" or "Review and retry"

---

## Phase 6: Module-Level Practice Quiz Enhancement

**What**: The existing practice quiz system already pulls random questions per module. This phase adds:
- Display of "best score" on the module page (already partially implemented)
- Ensure quiz questions from the new lesson quizzes feed into the module practice pool

**Changes**:
- `src/pages/PracticeQuiz.tsx` -- extend to optionally pull from `lesson_cards` quiz_card content_json as an additional question source
- This is additive -- the existing `quizQuestions.ts` data remains as-is

---

## Phase 7: GQA Module Test Simulation Improvements

**What**: The existing GQA test page already exists. Enhancements:
- Add a visible timer (proportional: ~18 mins per module)
- Ensure closed-book mode (no feedback until end)
- Show results only after completing all questions
- Track attempts in existing `assessment_attempts` table

**Changes**:
- `src/pages/GqaTest.tsx` -- add countdown timer, defer feedback to end

---

## Technical Details

### Files Created (new):
1. `src/components/lesson/cards/LessonQuiz.tsx` -- Quiz card component
2. SQL migration for `lesson_quiz_attempts` table + RLS
3. SQL migration for adding 32 missing image cards
4. SQL migration for adding quiz_card entries to all 26 lessons

### Files Modified (minimal, additive changes only):
1. `src/components/lesson/SwipeContainer.tsx` -- add `quiz_card` case to CardRenderer
2. `src/hooks/useDbLessonProgress.ts` -- add quiz score query
3. `src/pages/ModuleOverview.tsx` -- add quiz status indicators
4. `src/pages/LessonPlayer.tsx` -- handle quiz completion callback
5. `src/pages/GqaTest.tsx` -- add timer and deferred feedback

### What is NOT changed:
- All existing card types and their rendering
- All existing 26 image positions in the seed data
- The existing Supabase schema (only additive table)
- The existing lesson flow, swipe navigation, and progress tracking
- The module/lesson list pages structure
- Auth, RLS policies on existing tables

### Implementation Order:
1. DB migration: Create `lesson_quiz_attempts` table
2. DB migration: Add 32 missing images
3. Build `LessonQuiz` component
4. Add `quiz_card` to SwipeContainer
5. DB migration: Add quiz_card entries to all lessons
6. Add progression gating
7. Enhance module page with quiz status
8. GQA timer enhancement

