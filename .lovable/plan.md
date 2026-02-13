

# Complete Fix Plan: All Reported Issues

## 1. Fix Progress Steps (MyCard.tsx + Journey.tsx)

**Current:** 6 steps (Choose language, Finish lessons, Pass practice, Book CSCS test, Pass CSCS test, Get card)

**Correct steps (per user):**
1. Complete each course topic (5 topics)
2. Pass each assessment test (5 topic tests)
3. Get Level 1 certificate
4. Pass the CSCS test
5. Get the Green Card

Update both `MyCard.tsx` (steps array, lines 49-75) and `Journey.tsx` (milestones array, lines 97-189) to reflect these 5 steps. Remove "Choose your language" and "Pass practice questions" as separate steps. Merge lessons + practice into "Complete each course topic".

## 2. Card Wallet Updates (CardWallet.tsx)

- Add "Progress your career with us" text underneath the green card
- Add "Progress your career with us" text underneath the locked cards section
- Update card labels: Blue = "Skilled Worker", Gold = "Supervisor", Black = "Manager"
- These labels are already mostly correct but ensure consistency

## 3. Fix FAQ Answers (MyCard.tsx + Journey.tsx)

Update the 4 FAQ questions and answers in both files:
1. "Do I need a CSCS test?" -- "Yes, you need the CSCS test to get the CSCS card. Luckily, we can do it here."
2. "How long does it take?" -- "It can take as little as 6 hours to complete. The certificate can be available digitally as fast as one day, and the CSCS Smart Checker app can digitally have your card as fast as the next day. The physical card can take up to 5 working days to reach home."
3. "What if I fail?" -- "If you fail an assessment topic, you can retake as many times as you need. If you fail the CSCS test, you can also retake as many times as you need."
4. "Do I need to visit a centre?" -- "You don't need to. It's all done here with us, in one place. No centre visit needed."

## 4. CSCS Mock Test: 50 Questions (CscsPrep.tsx)

**Current:** Mock test uses 25 questions (line 42: `shuffled.slice(0, Math.min(25, shuffled.length))`).

**Fix:** Change to 50 questions. Also update the description text from "25 questions" to "50 questions". The question bank has ~48 questions across 5 modules. We may need to add a few more questions to reach 50, or use all available questions when fewer than 50 exist.

## 5. In-App Chatbox and WhatsApp Chat

Add a floating help button (bottom-right corner) that expands to show:
- WhatsApp chat link (opens WhatsApp with a pre-filled message)
- In-app chat interface (simple message form initially, can be enhanced later)

Create a new `HelpChat.tsx` component and add it to `AppLayout.tsx`.

## 6. Certificate Appears After Passing 5 Assessment Topic Tests

**Current:** The certificate view (`CertificatePackCard`) shows "awaiting" when `allGqa` is false and "downloadable" when true.

This is already wired correctly in Journey.tsx (line 153: `ctaLabel: allGqa ? "View certificate" : undefined`). Verify the certificate shows as "downloadable" (not just "awaiting") once all 5 topic tests pass. Update the state logic to show "downloadable" instead of "awaiting" when `allGqa` is true.

## 7. Fix Romanian Translations Showing Despite English Selection

**Bug location:** `slidesSchema.ts` line 119:
```
explanation: isTranslated && translated !== kt.en ? translated : (kt.ro || kt.lt || kt.bg || "Key construction term"),
```

When `lang === "en"`, `isTranslated` is `false`, so it falls through to `kt.ro || kt.lt || kt.bg` -- this shows Romanian text for English users!

**Fix:** When language is English, use `kt.en` as the explanation (not the fallback chain). Change the fallback to just `"Key construction term"` when `isTranslated` is false.

## 8. Voice Should Sound British and Human-Like

**Current:** Uses Web Speech API (`speakWord` in `pronunciation.ts`) with `lang: "en-GB"` and `rate: 0.9`.

**Fix:** Enhance the `speakWord` function to select a British English voice explicitly from the available voices list. The Web Speech API voice selection varies by device, but we can filter for `en-GB` voices and prefer ones with "Google" or "Daniel" or "Female" in the name for more natural-sounding speech. Also adjust pitch slightly for a warmer tone.

---

## Technical Details

### Files to modify:

| File | Changes |
|------|---------|
| `src/pages/MyCard.tsx` | Update steps (5 correct steps), update FAQ answers |
| `src/pages/Journey.tsx` | Update milestones (5 correct steps), update FAQ answers |
| `src/components/journey/CardWallet.tsx` | Add "Progress your career with us" text, verify card labels |
| `src/pages/CscsPrep.tsx` | Change mock from 25 to 50 questions, update description |
| `src/data/slidesSchema.ts` | Fix key term explanation fallback for English |
| `src/lib/pronunciation.ts` | Select British voice explicitly, improve naturalness |

### New files to create:

| File | Purpose |
|------|---------|
| `src/components/layout/HelpChat.tsx` | Floating help button with WhatsApp + in-app chat |

### Files to update for HelpChat integration:

| File | Changes |
|------|---------|
| `src/components/layout/AppLayout.tsx` | Add HelpChat component |

