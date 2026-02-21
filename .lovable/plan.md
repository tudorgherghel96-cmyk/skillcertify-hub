

# Fix: Blank Screen on Protected Lesson Routes

## Root Cause

In `src/App.tsx` line 64, the second group of protected routes wraps an empty React fragment (`<></>`):

```
<Route element={<ProtectedRoute><></></ProtectedRoute>}>
```

React Router requires an `<Outlet />` component in layout routes to render child routes. Since there is no `<Outlet />`, the LessonPlayer and all other routes in that group (practice, GQA test, CSCS, results) render nothing -- producing a blank white screen.

The first protected route group (line 57) works fine because `<AppLayout />` contains an `<Outlet />` internally.

## Fix

Replace the empty fragment with `<Outlet />` from react-router-dom:

**File: `src/App.tsx`**
- Line 64: Change `<ProtectedRoute><></></ProtectedRoute>` to `<ProtectedRoute><Outlet /></ProtectedRoute>`

This is a one-line change. The `Outlet` import already exists on line 5 (it is not currently imported, so we also add it to the import).

## Technical Details

| File | Change |
|------|--------|
| `src/App.tsx` | Add `Outlet` to the react-router-dom import on line 5, and replace `<></>` with `<Outlet />` on line 64 |

## Impact

This fixes blank screens for all routes in the second protected group:
- `/lesson/:moduleId/:lessonId` (LessonPlayer)
- `/practice/boost` (BoostDrill)
- `/practice/:moduleId` (PracticeQuiz)
- `/gqa-test/:moduleId` (GqaTest)
- `/cscs-prep`, `/cscs-test`, `/results`

