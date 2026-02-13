

# Landing Page Hero, Trust Badges, and Footer Redesign

## What's Changing

A complete UX overhaul of the hero section, trust badges, and footer to fix visual hierarchy, spacing, contrast, and professionalism issues.

---

## Hero Section

### 1. Fix Headline Hierarchy
- **H1**: "Get your CSCS Green Card." (single clear headline, no blue accent splitting it)
- **Subhead**: "Complete the course, pass the test, and get on site -- all from your phone." (lighter weight, secondary-foreground/70)
- Remove the two competing H1-weight lines; keep one H1 + one `<p>` subhead

### 2. Fix Logo Presentation
- Remove the white-boxed logo; use just the SkillCertify icon (`skillcertify-icon.png`) at `h-8 w-auto` with no background box
- Clean top spacing: logo sits at top with 24px gap to headline

### 3. Compact Language Selector
- Change from the current pill to a smaller control: Globe icon + language code (e.g. "EN") + ChevronDown
- Use `text-secondary-foreground/50` to keep it subtle, positioned top-right

### 4. Fix CTA Copy
- Primary CTA: "Get your Green Card" (outcome-based, not generic "Start Learning Free")
- Remove the ArrowRight icon to keep it clean
- Add reassurance line under CTA: "No centre visit . No laptop . Cancel anytime" (replaces the current "No laptop needed..." at the bottom)

### 5. Fix Spacing (8pt rhythm)
- Logo to Headline: `mb-6` (24px)
- Headline to Subhead: `mt-3` (12px)  
- Subhead to CTA: `mt-5` (20px)
- CTA to Sign-in link: `mt-3` (12px)
- Sign-in to Trust badges: `mt-6` (24px)
- Trust badges to reassurance: `mt-4` (16px)
- Remove the `space-y-5` from the container; use explicit spacing for control

### 6. Simplify Trust Badges
- Two compact badges in a row, same height/padding:
  - "GQA Approved Centre" (with GQA logo)
  - "CSCS Smart Check Integrated" (with myCSCS logo)
- More descriptive labels instead of just "APPROVED" / "INTEGRATED"

### 7. Move Social Proof Strip
- Convert the loud blue scrolling strip into a calmer inline benefits row below the trust badges
- Three items: "98% pass rate" / "11 languages" / "Start today"
- Styled as small text with check marks, not a heavy colored banner
- Remove the `@keyframes scroll` animation section

---

## Footer

### 1. Structured Layout
- Replace the fully-centered blob with a cleaner stacked layout
- Logo row: SkillCertify icon + SkillCertify wordmark + CSCS full logo, all at `h-8`, baseline aligned
- Support row with icon labels: Email support | WhatsApp support (using Mail and MessageCircle icons)
- Legal links row
- Copyright line

### 2. Remove Visual Clutter
- Keep address and GQA centre number but make them more compact
- Clean link styling with proper hover states

---

## Translation Updates

Update `landingTranslations.ts`:
- Change `cta_start` from "Start Learning Free" to "Get your Green Card" (English)
- Change `hero_title_2` from "Start to finish, from your phone." to "Complete the course, pass the test, and get on site -- all from your phone."
- Change `no_laptop` to "No centre visit . No laptop . Cancel anytime"
- Update all 11 language translations accordingly for these 3 keys

---

## Technical Details

### Files Modified

**`src/pages/Landing.tsx`**
- Restructure hero JSX: single H1, subhead as `<p>`, controlled spacing via margin classes
- Compact language selector with `ChevronDown` icon import
- New CTA text using updated translation key
- Reassurance text moved under CTA
- Trust badges with fuller labels
- Social proof converted from scrolling banner to static inline row
- Footer restructured with icon-based support links (import `Mail`, `MessageCircle` from lucide)

**`src/i18n/landingTranslations.ts`**
- Update `hero_title_2`, `cta_start`, and `no_laptop` across all 11 languages
- Hero title 2 becomes the subhead text
- CTA becomes outcome-based
- No-laptop line becomes the reassurance line

**`src/index.css`**
- Remove `@keyframes scroll` animation (no longer needed since social proof strip is now static)

