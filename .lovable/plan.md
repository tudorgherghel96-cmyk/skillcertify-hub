

# Readiness Index v1 Implementation Plan

## Overview
Add a server-side readiness scoring system using Supabase. When a user is logged in, telemetry data (lesson completions, practice attempts) is written to Supabase in addition to localStorage. A database RPC `compute_readiness` calculates a 0-100 readiness score with component breakdown, and a new `ReadinessCard` displays this on the Dashboard.

## Current State
- **No authentication** is implemented yet -- progress is entirely in localStorage via `ProgressContext`
- Tables `progress` and `practice_attempts` already exist in Supabase with strict RLS (`auth.uid() = user_id`)
- `cscs_results` and `gqa_results` tables also exist
- No `mock_attempts` or `readiness_snapshots` tables exist yet

## Important Prerequisite
Since there is no auth flow, telemetry writes will only fire when a user happens to be logged in (e.g., via Supabase dashboard or future auth implementation). The ReadinessCard will show a fallback message for unauthenticated users.

---

## Step 1: Database Migration

Create a single migration that adds:

**New table: `mock_attempts`**
- `id` (uuid, PK, default `gen_random_uuid()`)
- `user_id` (uuid, NOT NULL)
- `score` (integer)
- `total` (integer)
- `duration_seconds` (integer)
- `attempted_at` (timestamptz, default `now()`)
- RLS: `auth.uid() = user_id` for SELECT and INSERT

**New table: `readiness_snapshots`** (optional cache)
- `id` (uuid, PK, default `gen_random_uuid()`)
- `user_id` (uuid, NOT NULL)
- `readiness` (integer, 0-100)
- `tier` (text)
- `components` (jsonb)
- `weak_modules` (integer array)
- `gates` (jsonb)
- `next_action` (text)
- `computed_at` (timestamptz, default `now()`)
- RLS: `auth.uid() = user_id` for SELECT and INSERT

**Database view: `v_module_stats`**
- Aggregates per-user, per-module stats from `progress`, `practice_attempts`, and `gqa_results`
- Columns: user_id, module_id, lessons_completed, total_practice_attempts, best_practice_score, avg_practice_score, gqa_passed, gqa_score

**RPC function: `compute_readiness(p_user_id uuid)`**
- Returns JSON with: `readiness` (0-100), `tier`, `knowledge_score`, `skills_score`, `test_readiness_score`, `consistency_score`, `experience_score`, `weak_modules`, `gates`, `next_action`
- Scoring formula:
  - **K (Knowledge)**: % of lessons completed across all 5 modules (weight: 25%)
  - **S (Skills)**: Average best practice score across modules (weight: 25%)
  - **T (Test Readiness)**: % of GQA modules passed (weight: 25%)
  - **C (Consistency)**: Based on streak data from `streaks` table (weight: 15%)
  - **E (Experience)**: Total practice attempts normalized (weight: 10%)
- Tier mapping: 0-29 = "Beginner", 30-54 = "Developing", 55-74 = "Competent", 75-89 = "Proficient", 90-100 = "Expert"
- `weak_modules`: modules with best practice score below 60% or incomplete lessons
- `gates`: array of blocking conditions (e.g., "Complete Module 2 lessons", "Pass Module 3 GQA")
- `next_action`: single most important next step
- GRANT EXECUTE to `authenticated`

## Step 2: Telemetry Writes (Client-Side)

**Create `src/hooks/useTelemetry.ts`**
- A custom hook that checks for `supabase.auth.getUser()` on mount
- Exposes functions: `trackLessonComplete`, `trackPracticeAttempt`, `trackMockAttempt`
- Each function writes to the corresponding Supabase table if user is authenticated
- Fails silently (console.warn) if not authenticated -- localStorage remains the source of truth

**Wire into existing components:**

- **`LessonPlayer.tsx`**: After `completeLesson(moduleId, lessonId)`, call `trackLessonComplete(moduleId, lessonId)` which upserts into the `progress` table
- **`FullQuiz.tsx`** (via `PracticeQuiz.tsx`): After `onComplete` callback fires, call `trackPracticeAttempt(moduleId, questionId, isCorrect, responseTimeMs)` for each answer, plus an aggregate row
- **`DrillMode.tsx`**: On each answer, call `trackPracticeAttempt` with the question data
- **`QuickSession.tsx`**: On each answer, call `trackPracticeAttempt`
- **`CscsPrep.tsx`**: If mock test completion exists, call `trackMockAttempt`

## Step 3: ReadinessCard Component

**Create `src/components/readiness/ReadinessCard.tsx`**
- On mount, check if user is authenticated via `supabase.auth.getUser()`
- If authenticated: call `supabase.rpc('compute_readiness', { p_user_id: user.id })` using TanStack Query
- Display:
  - Circular or semicircle gauge showing readiness % (0-100)
  - Tier badge (color-coded: red/orange/yellow/blue/green)
  - K/S/T/C/E component bars (5 small horizontal progress bars)
  - Weak modules list with links
  - Next action as a CTA button
- If not authenticated or error: show "Start practising to unlock readiness tracking" with a muted card style
- Loading state: skeleton shimmer

**Add to `Dashboard.tsx`**
- Insert `ReadinessCard` between the overall progress card and the module cards

## Technical Details

```text
+------------------+     +-------------------+     +------------------+
|  LessonPlayer    |     |  PracticeQuiz     |     |  QuickSession    |
|  DrillMode       |     |  FullQuiz         |     |  CscsPrep        |
+--------+---------+     +---------+---------+     +--------+---------+
         |                         |                        |
         v                         v                        v
    useTelemetry() -- writes to Supabase tables if auth'd
         |
         v
+--------+---------+
|  Supabase Tables |
|  progress        |
|  practice_attempts|
|  mock_attempts   |
+--------+---------+
         |
         v
+--------+---------+
| compute_readiness|  <-- called by ReadinessCard
|  (RPC function)  |
+------------------+
         |
         v
+--------+---------+
|  ReadinessCard   |  <-- renders on Dashboard
+------------------+
```

## Files to Create
- `supabase/migrations/[timestamp]_readiness_index.sql` (migration with tables, view, RPC)
- `src/hooks/useTelemetry.ts`
- `src/components/readiness/ReadinessCard.tsx`

## Files to Modify
- `src/pages/LessonPlayer.tsx` -- add telemetry call on lesson complete
- `src/pages/PracticeQuiz.tsx` -- pass telemetry to FullQuiz completion handler
- `src/components/practice/DrillMode.tsx` -- add telemetry on each answer
- `src/components/practice/QuickSession.tsx` -- add telemetry on each answer
- `src/pages/Dashboard.tsx` -- add ReadinessCard component

## Edge Cases
- Unauthenticated users see a fallback message; no errors
- Telemetry writes fail silently; localStorage progress is unaffected
- If `compute_readiness` returns null/empty (new user, no data), show the "start practising" fallback
- The RPC handles division-by-zero (no practice attempts) gracefully with COALESCE defaults

