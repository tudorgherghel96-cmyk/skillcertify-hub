
# Fix Data Inconsistencies, Empty Stats, and UX Gaps

## Overview

This plan addresses the data mismatches, empty UI elements, missing context, and broken flows reported across the Dashboard, My Card, CSCS Prep, Module Overview, Profile, and Learn Hub pages.

---

## 1. Fix CSCS Prep vs My Card Data Inconsistency

**Problem**: CSCS Prep shows "All 5 topics passed!" while My Card shows all 5 as "Not taken."

**Root cause**: `CscsPrep.tsx` uses `allGqaPassed(progress, isSuperUser)` which returns `true` when super user mode is on. `MyCard.tsx` reads from the same `ProgressContext` but displays per-module GQA status from `getModuleProgress()`, which correctly shows `null` (not taken) when no actual GQA data exists.

**Fix**:
- In `CscsPrep.tsx`, do NOT pass `isSuperUser` to `allGqaPassed()` for the congratulations banner -- show actual data, not bypassed data
- In `MyCard.tsx`, do the same -- use real progress, not super-user-bypassed progress, for display purposes
- Super user mode should only bypass **locks/gates**, not falsify displayed status

**Files**: `src/pages/CscsPrep.tsx`, `src/pages/MyCard.tsx`

---

## 2. Fix "90 minutes" vs "~18 minutes" Test Duration

**Problem**: Module overview says "90 minutes" but GQA test briefing says "~18 minutes."

**Fix**: Update `ModuleOverview.tsx` line 332 from `"Closed book · 80% to pass · 90 minutes"` to `"Closed book · 80% to pass · ~18 min"` to match the GQA test briefing (which correctly says ~18 min proportional to the 90-min full exam).

**File**: `src/pages/ModuleOverview.tsx`

---

## 3. Enforce Practice Score Gating for Topic Tests

**Problem**: "Start test" button appears even with a 58% best score, despite UI saying "Score 80%+ to unlock test."

**Root cause**: `isGqaUnlocked()` checks `mp.practice.bestScore >= 80`, but the Module Overview renders the "Start test" button based on `gqaReady` which does use this check. The issue is that when `isSuperUser` is true, the gate is bypassed silently without visual indication.

**Fix**: When super user bypasses the gate, show an amber badge like "QA bypass" next to the test button so it's clear the gate is being overridden. This is already partially working but the UI doesn't make it obvious.

**File**: `src/pages/ModuleOverview.tsx`

---

## 4. Fix Empty "Level" and "Best Streak" on Profile

**Problem**: Level and Best Streak labels appear but values seem empty.

**Root cause**: `gamification.level` and `gamification.longestStreak` default to `1` and `0` respectively in `GamificationContext`. If the Supabase `user_gamification` row hasn't been created yet, these display `1` and `0` which look empty/meaningless. Additionally, `xpToLevel` in `GamificationContext` uses `floor(xp / 500) + 1` (level per 500 XP) while `useXpProgress.ts` uses `floor(xp / 100) + 1` (level per 100 XP) -- this mismatch means levels don't agree.

**Fix**:
- Unify `xpToLevel` to use the same threshold everywhere (100 XP per level, matching `useXpProgress.ts`)
- Show "Level 1" and "0 days" explicitly rather than blank-looking
- Add XP context: show "Level 2 (158/200 XP)" format so users understand what XP means

**Files**: `src/contexts/GamificationContext.tsx`, `src/pages/Profile.tsx`, `src/pages/Dashboard.tsx`

---

## 5. Add Context to XP Display

**Problem**: "158 XP" is shown without explanation of what level it corresponds to.

**Fix**: On the Dashboard stats grid, change the XP cell to show level prominently with XP as secondary text: "Level 2" with "158 XP" beneath. Add a small progress bar showing XP toward next level (e.g., 58/100 to Level 3).

**File**: `src/pages/Dashboard.tsx`

---

## 6. Make Certificate Section Actionable

**Problem**: "Your certificate will appear here when you've passed all your tests" doesn't say which tests remain.

**Fix**: When certificate isn't ready, show remaining topics as a list: "Remaining: Topic 2, Topic 4, Topic 5" based on which GQA modules haven't been passed yet.

**File**: `src/pages/Profile.tsx`

---

## 7. Fix Referral Text

**Problem**: Already fixed in current code (line 272 shows "get £20 for every friend").

**Status**: No change needed -- the code already reads correctly.

---

## 8. Clarify Lesson Completion vs Assessment Status

**Problem**: "2 of 5 topics done" alongside all assessments "Not taken."

**Fix**: Change dashboard wording from "module_of" (which says "X of 5 topics done") to distinguish between "lessons completed" and "assessments passed." Show two separate stats:
- "Lessons: X of 26 complete"  
- "Assessments: X of 5 passed"

This makes it clear that completing lessons and passing assessments are different steps.

**File**: `src/pages/Dashboard.tsx`

---

## 9. Label Career Ladder Cards as "Coming Soon"

**Problem**: Blue, Gold, Black card buttons may lead to dead clicks.

**Fix**: In `CardWallet.tsx`, add a "Coming soon" overlay or badge on the Blue, Gold, and Black cards. Disable click/tap on those cards.

**File**: `src/components/journey/CardWallet.tsx`

---

## 10. Add Quiz Status Indicators for Unattempted Lessons

**Problem**: Quiz badges only show on attempted lessons; unattempted ones show nothing.

**Fix**: In `ModuleOverview.tsx`, update `QuizStatusBadge` to show "Quiz: --" or a subtle indicator when `score === null` and the lesson is completed but quiz not attempted.

**File**: `src/pages/ModuleOverview.tsx`

---

## 11. Dynamic "Quick Practice" Link

**Problem**: Always links to `/practice/1`.

**Fix**: In `LearnHub.tsx`, change the Quick Practice link to dynamically point to the first incomplete module, or the most recent module if all are complete.

**File**: `src/pages/LearnHub.tsx`

---

## 12. Show Per-Lesson Progress on Module Cards

**Problem**: Module cards don't show individual lesson completion without clicking in.

**Fix**: On Dashboard and LearnHub module cards, add a small row of dots (one per lesson) -- filled for complete, empty for incomplete. This gives at-a-glance lesson-level progress.

**Files**: `src/pages/Dashboard.tsx`, `src/pages/LearnHub.tsx`

---

## 13. Add Overall Progress Percentage to Dashboard

**Problem**: No prominent progress percentage despite data existing.

**Fix**: Make the overall progress percentage larger and more prominent in the dashboard progress card. Show it as a big number (e.g., "62%") with "overall progress" label.

**File**: `src/pages/Dashboard.tsx`

---

## 14. Fix "Step 1 of 6" Dynamic Text

**Problem**: Says "Start your lessons" even after lessons are completed.

**Fix**: The `getNextAction()` function already returns dynamic labels like "Continue Topic X". The dashboard CTA button uses this. If the issue is a separate "Step X of 6" element elsewhere, update it to derive from actual progress state. Looking at the code, the Dashboard uses `nextAction.label` which is already dynamic. If there's a static "Step 1 of 6" text elsewhere, it needs to be made dynamic.

**File**: `src/pages/Dashboard.tsx` (if the step text exists there)

---

## 15. Add Personalized Greeting

**Problem**: No "Welcome back, Tudor" greeting.

**Fix**: Update Dashboard welcome text to include the user's name from `useAuth()`. Show "Welcome back, {name}" where name comes from `user?.user_metadata?.full_name` or email prefix.

**File**: `src/pages/Dashboard.tsx`

---

## 16. Fix 0% Progress vs 6-Day Streak Contradiction

**Problem**: 0% progress shown alongside active streak.

**Root cause**: `getOverallProgress()` only counts modules where GQA is passed (not lessons completed), so a user who completed lessons but hasn't passed any GQA shows 0%. This is misleading.

**Fix**: Change `getOverallProgress()` to be a weighted calculation: lessons completed contribute 60% of progress, GQA passes contribute 40%. Alternatively, rename the metric to "Qualification progress" so it's clear it tracks assessment completion, not lesson completion.

**File**: `src/contexts/ProgressContext.tsx`, `src/pages/Dashboard.tsx`

---

## Technical Summary

### Files Modified (17 files):
1. `src/pages/CscsPrep.tsx` -- Fix super-user display bypass
2. `src/pages/MyCard.tsx` -- Fix super-user display bypass  
3. `src/pages/ModuleOverview.tsx` -- Fix duration text, quiz badges, QA bypass indicator
4. `src/contexts/GamificationContext.tsx` -- Unify xpToLevel threshold
5. `src/pages/Profile.tsx` -- XP context, certificate remaining tests
6. `src/pages/Dashboard.tsx` -- Greeting, progress %, lesson dots, XP context, step text
7. `src/pages/LearnHub.tsx` -- Dynamic Quick Practice link
8. `src/components/journey/CardWallet.tsx` -- Coming soon labels
9. `src/contexts/ProgressContext.tsx` -- Weighted overall progress

### No Database Changes Required
All fixes are frontend logic and display issues.

### Implementation Order:
1. Fix data source inconsistencies (items 1, 3, 16) -- these are the trust-breaking issues
2. Unify xpToLevel and fix empty stats (items 4, 5)
3. Fix UI text issues (items 2, 6, 8, 14, 15)
4. Add missing indicators (items 9, 10, 11, 12, 13)
