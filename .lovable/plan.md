

# Fix Trust Badges, Logos, and Footer on Landing Page

## Changes Overview

### 1. New Assets (3 files to copy)
- Copy `user-uploads://IMG_4161.jpg` to `src/assets/skillcertify-icon.png` (replace existing icon with the blue gradient badge)
- Copy `user-uploads://IMG_4341.PNG` to `src/assets/my-cscs-logo.png` (myCSCS app icon)
- Copy `user-uploads://IMG_4342.PNG` to `src/assets/cscs-full-logo.png` (CSCS full logo with text)

### 2. Landing.tsx Changes

**Hero logo (line ~89):** Remove `brightness-0 invert` from the SkillCertify logo `<img>` className.

**Trust badges (lines ~130-148):** Replace the 3-badge layout with 2 badges:
- Badge 1: GQA logo + "APPROVED"
- Badge 2: myCSCS logo + "INTEGRATED"  
- Delete the middle "Ofqual Regulated" badge entirely

**Footer logo (line ~224):** Remove `brightness-0 invert` from the footer SkillCertify logo. Add the CSCS full logo (`cscs-full-logo.png`) next to it, both centered side-by-side at `h-10`.

**Footer credentials (line ~231):** Change from `GQA Centre Number: XXXXXX | Ofqual Recognition: XXXXXX` to just `GQA Centre Number: XXXXXX`.

**Imports:** Add imports for `myCscsLogo` and `cscsFullLogo` from the new asset files.

### Technical Details

**File: `src/pages/Landing.tsx`**

Import additions:
```typescript
import myCscsLogo from "@/assets/my-cscs-logo.png";
import cscsFullLogo from "@/assets/cscs-full-logo.png";
```

Trust badges section becomes:
```tsx
<div className="flex items-center justify-center gap-4 pt-4">
  <div className="flex items-center justify-center h-10 px-3 rounded-lg border border-secondary-foreground/15 bg-secondary-foreground/5 gap-2">
    <img src={gqaLogo} alt="GQA" className="h-6 w-auto" />
    <span className="text-[10px] sm:text-xs font-semibold text-secondary-foreground/60 tracking-wide uppercase">Approved</span>
  </div>
  <div className="flex items-center justify-center h-10 px-3 rounded-lg border border-secondary-foreground/15 bg-secondary-foreground/5 gap-2">
    <img src={myCscsLogo} alt="myCSCS" className="h-6 w-auto rounded" />
    <span className="text-[10px] sm:text-xs font-semibold text-secondary-foreground/60 tracking-wide uppercase">Integrated</span>
  </div>
</div>
```

Footer logos become side-by-side:
```tsx
<div className="flex items-center justify-center gap-4">
  <img src={skillcertifyLogo} alt="SkillCertify" className="h-10" />
  <img src={cscsFullLogo} alt="CSCS - Construction Skills Certification Scheme" className="h-10 w-auto" />
</div>
```

Footer credentials line:
```tsx
<p className="text-xs text-secondary-foreground/60">
  GQA Centre Number: XXXXXX
</p>
```

