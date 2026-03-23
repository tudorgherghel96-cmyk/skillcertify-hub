

# Split Card 9 in Lesson 3.3: Image Only + New Text Card

## Current state
Card 9 (lesson 3.3) is an `image` card with:
- Image: `3.3_photo_2.webp`
- Caption: "Fall PREVENTION (guardrails) always comes before fall ARREST (harnesses). TEST TIP: The hierarchy is AVOID > PREVENT > ARREST > MINIMISE."

## Plan
1. **Update card 9** — remove the caption text, keep it as image-only
   - Set `content_json` to `{"alt": "Guardrails and edge protection", "caption": ""}` (empty caption)

2. **Insert new card at position 10** — a `remember_this` card with the text content
   - Text: "Fall PREVENTION (guardrails) always comes before fall ARREST (harnesses)."
   - Include the test tip about the hierarchy (AVOID > PREVENT > ARREST > MINIMISE)
   - Shift existing cards 10+ forward by 1 position

3. **No code changes needed** — the existing `remember_this` and `image` renderers handle these card types already

### Database operations (via insert tool)
- UPDATE card 9 to clear caption
- UPDATE cards 10, 11 → positions 11, 12
- INSERT new `remember_this` card at position 10

