

# Add Fire Triangle Teaching Card Before Tap-to-Reveal

## Problem
The Tap-to-Reveal card (position 6) tests learners on the Fire Triangle, but they haven't been taught the concept first. The video at position 5 may cover it, but there's no explicit knowledge card explaining what the Fire Triangle is before the interactive quiz.

## Solution
Insert a new `remember_this` card at position 6 that teaches the Fire Triangle, and shift the existing cards (positions 6+) up by one.

### New card content
A "Remember This" card with structured text that the existing formatter will auto-detect and render as a clean numbered/titled layout:

```
THE FIRE TRIANGLE: Fire needs THREE things to burn — remove any one to stop the fire. 1) HEAT — sparks, hot works, electrical faults, friction 2) FUEL — wood, paper, flammable liquids, gas, dust 3) OXYGEN — always present in the air (about 21%). A fire extinguisher works by removing one side of the triangle.
```

This will be parsed by `formatRememberText` into a title ("THE FIRE TRIANGLE") plus 3 numbered items with a closing plain-text line.

### Database operations (using insert/update tool, not migrations)
1. **Shift positions**: `UPDATE lesson_cards SET card_position = card_position + 1 WHERE lesson_id = '1.7' AND card_position >= 6 ORDER BY card_position DESC`
2. **Insert new card**: Insert a `remember_this` card at position 6 with `lesson_id = '1.7'`, `module_id = 1`, `xp_value = 5`

### Files changed
None — this is a data-only change. The existing `RememberThis` component and `formatRememberText` utility will handle rendering automatically.

