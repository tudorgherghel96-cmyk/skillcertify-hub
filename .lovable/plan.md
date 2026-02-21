

# Fix Missing Lessons + Seamless Image/Video Sizing

## Problem 1: Missing Lessons

The `courseData.ts` file defines fewer lessons than actually exist in the database. The database has 26 lessons total, but the code only lists 21.

| Module | In Code | In Database | Missing |
|--------|---------|-------------|---------|
| 3 — Working at Height | 4 lessons | 5 lessons (3.1-3.5) | 3.5 "Fall Protection" |
| 4 — Health Risks | 3 lessons | 5 lessons (4.1-4.5) | 4.4 "Dust and Chemicals", 4.5 "Drugs, Alcohol & Substance Misuse" |
| 5 — Plant & Equipment | 2 lessons | 4 lessons (5.1-5.4) | 5.3 "Traffic Management", 5.4 "Overhead Services & Buried Utilities" |

**Fix**: Update `src/data/courseData.ts` to add the missing lessons with the correct titles from the database:

- Module 3: Add lesson 5 "Fall Protection"
- Module 4: Add lesson 4 "Dust and Chemicals" and lesson 5 "Drugs, Alcohol & Substance Misuse"
- Module 5: Add lesson 3 "Traffic Management" and lesson 4 "Overhead Services & Buried Utilities"

Also update the `topics` arrays for each module to reflect the full content.

## Problem 2: Photos and Videos Different Sizes

Currently `ImageSlide.tsx` uses `object-fit: cover` (fills the entire slide, crops the image), while `VideoSlide.tsx` uses `object-fit: contain` (shows the full frame with black bars). This creates a jarring visual difference when swiping between them.

**Fix**: Change `ImageSlide.tsx` to use `object-fit: contain` instead of `cover`, matching the video behavior. This ensures all media cards (images, videos, hero excluded) display consistently within their 100dvh slides with black bars rather than cropping. The hero slide keeps `cover` since it's a full-bleed background by design.

Also update the caption overlay positioning to work with `contain` — move it to a fixed position at the bottom of the slide rather than overlaying the image edge.

## Files Changed

| File | Change |
|------|--------|
| `src/data/courseData.ts` | Add 5 missing lessons across modules 3, 4, 5 |
| `src/components/lesson/ImageSlide.tsx` | Change `object-fit: cover` to `contain`, adjust caption positioning |

## No Database Changes

All lesson card data already exists in the database. This is purely a frontend sync issue.

