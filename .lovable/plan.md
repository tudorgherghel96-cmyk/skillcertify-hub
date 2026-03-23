

# Redesign Card 9 (Lesson 4.2 Asbestos) — Three Types of Asbestos

## Current state
Card 9 is an `image` card with a long caption cramming all three asbestos types into one block:
> "Three types of asbestos: Blue (Crocidolite) — most dangerous, Brown (Amosite) — commonly found in insulation, White (Chrysotile) — most common, found in cement sheets and brake linings."

This is hard to scan and digest on mobile — all three types blur together in a single caption paragraph.

## Redesign approach
Convert card 9 into a `remember_this` card with `heroImage` showing the asbestos types image, and structured numbered items for each type. This uses the existing RememberThis component's hero image + numbered list layout, which provides clear visual separation per item.

## Plan

1. **Update card 9** from `image` to `remember_this` with structured content:
   - `card_type`: `remember_this`
   - `heroImage`: keep the existing image (`4.2_photo_2.webp` from storage, referenced via Supabase URL or local path)
   - `text`: Reformatted as a numbered list with title

   New `content_json`:
   ```json
   {
     "text": "THREE TYPES OF ASBESTOS: 1) Blue (Crocidolite) — most dangerous 2) Brown (Amosite) — commonly found in insulation 3) White (Chrysotile) — most common, found in cement sheets and brake linings",
     "heroImage": "4.2_photo_2.webp"
   }
   ```

   The `formatRememberText` parser will automatically detect:
   - Title: "THREE TYPES OF ASBESTOS"
   - Three numbered items with clear separation
   - Each type gets its own visual card with a numbered badge

2. **Keep media fields** pointing to the same image so `heroImage` resolves via the existing media URL logic. Set `media_bucket = 'final-correct-media'` and `media_file = '4.2_photo_2.webp'` as before.

3. **Check heroImage resolution** — the RememberThis component accepts `heroImage` as a direct prop. Need to verify the SwipeContainer passes the `heroImage` from `content_json` to the component.

### Database operation
Single UPDATE to card 9 changing `card_type` and `content_json`. No position shifts needed.

### Result
Students see:
- The asbestos types image at the top (hero)
- Title: "THREE TYPES OF ASBESTOS"
- Three clearly separated numbered cards:
  1. Blue (Crocidolite) — most dangerous
  2. Brown (Amosite) — commonly found in insulation
  3. White (Chrysotile) — most common, found in cement sheets and brake linings

