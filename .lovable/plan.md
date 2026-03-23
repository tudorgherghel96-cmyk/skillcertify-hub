

# Performance Optimization Pass

## Overview
A comprehensive performance optimization across build config, routing, data fetching, media loading, CSS, and database indexes.

## Changes

### 1. Vite Config (`vite.config.ts`)
Replace with optimized version: manual chunks (react-vendor, supabase-vendor, ui-vendor, icons-vendor), gzip+brotli compression via `vite-plugin-compression`, `target: esnext`, no sourcemaps in prod. Keep the existing VitePWA plugin with all its workbox config — the user's proposed config drops PWA support which would break the app. Merge both configs.

### 2. Route-level Code Splitting (`src/App.tsx`)
- Convert all 16 page imports to `React.lazy()` 
- Add `<Suspense>` with a loading spinner around `<Routes>`
- Create a small `LoadingSpinner` inline component

### 3. Fix Supabase `select('*')` queries
Two files have `select('*')`:
- `src/pages/LessonPlayer.tsx` → select only columns used by SwipeContainer
- `src/contexts/GamificationContext.tsx` → select only columns used by gamification state

### 4. RLS Policy Optimization
Create a migration wrapping `auth.uid()` in subselects for all RLS policies. This prevents Postgres from re-evaluating auth.uid() per row.

### 5. Database Indexes
Create indexes on frequently queried columns: `user_id` on all user-scoped tables, `lesson_id` on lesson_cards, `module_id` on progress/practice_attempts, `concept_id` on concept_attempts.

### 6. React Query Integration
Already installed (`@tanstack/react-query` in package.json) and `QueryClientProvider` already wraps the app. No Supabase fetches currently use `useQuery` though. Will NOT refactor every fetch in this pass — that's a larger effort. Will configure the existing `QueryClient` with sensible defaults.

### 7. Image & Video Lazy Loading
- Add `loading="lazy"`, `decoding="async"` to `<img>` tags across components (SlideRenderer, Landing, LearnHub, etc.)
- Hero image on Landing gets `loading="eager"` + `fetchPriority="high"`
- Videos already have controlled loading; add `preload="none"` where missing

### 8. Resource Hints (`index.html`)
Add `<link rel="preconnect" href="https://huhpvawveowlezmbfoww.supabase.co" />`

### 9. CSS Optimizations (`src/index.css`)
- Add `touch-action: manipulation` on `html`
- Add `.content-auto` utility class with `content-visibility: auto`

### 10. QueryClient Default Config (`src/App.tsx`)
Set default `staleTime: 5 * 60 * 1000` and `gcTime: 10 * 60 * 1000` on the QueryClient.

## Files to create/modify
- `vite.config.ts` — merge compression + chunks with existing PWA config
- `src/App.tsx` — lazy imports, Suspense, QueryClient defaults
- `src/pages/LessonPlayer.tsx` — narrow select columns
- `src/contexts/GamificationContext.tsx` — narrow select columns
- `index.html` — add preconnect hint
- `src/index.css` — touch-action, content-visibility utility
- `src/components/lesson/SlideRenderer.tsx` — img lazy loading
- `src/pages/Landing.tsx` — img lazy/eager loading
- `src/pages/LearnHub.tsx` — img lazy loading
- New migration: RLS policy subselect optimization + database indexes

## What is NOT included (too risky or too large for one pass)
- Full useQuery migration of every Supabase fetch (would touch 15+ files)
- useTransition for filtering (no filtering/search UI currently exists)
- Intersection Observer for videos (already handled by isActive prop pattern)

