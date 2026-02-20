
## Fix: Bottom Navigation Disappearing After Lesson

### Root Cause

In `src/pages/LessonPlayer.tsx`, lines 89-95, a `useEffect` hides the bottom nav on mount by directly mutating the DOM:

```
useEffect(() => {
  const bottomNav = document.querySelector("nav.fixed.bottom-0");
  if (bottomNav) (bottomNav as HTMLElement).style.display = "none";
  return () => {
    if (bottomNav) (bottomNav as HTMLElement).style.display = "";
  };
}, []);
```

The problem: the `bottomNav` DOM reference is captured at mount time. During React's render cycle when navigating away from the lesson, the cleanup runs but the `display: ""` reset is either overwritten or the reference is stale, leaving `display: none` permanently applied to the nav element.

This is a fragile anti-pattern — directly mutating the DOM from React is unreliable and bypasses React's rendering pipeline.

### Fix

Two changes are required:

**1. Remove the DOM mutation from `LessonPlayer.tsx`**

Delete the `useEffect` that hides/shows the bottom nav entirely (lines 89-95). The lesson player already renders as `fixed inset-0 z-40`, which covers the entire viewport — the bottom nav doesn't need to be hidden via JS because it sits at `z-50`. The lesson needs to be `z-50` or higher, or the nav needs to be hidden a different way.

**2. Use a CSS/React state approach in `BottomNav.tsx`**

The correct approach is to hide the bottom nav when the user is on a lesson route using `useLocation()` from react-router-dom. This is pure React — no DOM mutation, no stale closure bugs:

```tsx
// BottomNav.tsx
import { useLocation } from "react-router-dom";

const BottomNav = () => {
  const { pathname } = useLocation();
  const isLessonRoute = pathname.startsWith("/lesson/");
  if (isLessonRoute) return null;
  // ... rest of nav
};
```

This is reliable because React controls the render — when the user navigates back from a lesson, React re-renders `BottomNav` with the new pathname, and the nav reappears automatically.

### Files to Change

- `src/components/layout/BottomNav.tsx` — add `useLocation` check, return null on lesson routes
- `src/pages/LessonPlayer.tsx` — remove the `useEffect` that directly mutates `nav.fixed.bottom-0` DOM (lines 89-95)

### Why This Is Better

| Approach | Risk |
|---|---|
| DOM mutation via querySelector | Stale closure, timing issues, bypasses React |
| `useLocation()` conditional render | Pure React, reliable, zero timing issues |

No database changes or migrations needed. This is a pure UI fix.
