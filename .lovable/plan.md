
The reason it is still not working is that the shuffle is currently unstable, not missing.

What I found:
- The database for lesson `4.4`, card `6` is correct: it is a `pattern_card` with 6 hazard/disease pairs.
- `PatternCard.tsx` does already contain a shuffle now.
- But `SwipeContainer.tsx` rebuilds the `hazards` and `diseases` arrays with `.map()` on every render.
- Because of that, `PatternCard` receives a fresh `diseases` array every render, so this line keeps reshuffling:
  ```ts
  const shuffledDiseases = useMemo(() => guaranteedShuffle(diseases), [diseases]);
  ```
- In practice, every tap can trigger a re-render and the right column can reshuffle again, which makes the interaction feel broken and inconsistent.
- So the real issue is: the shuffle is tied to a prop that changes identity every render.

Why that matches what you’re seeing:
- Sometimes it can still appear effectively unshuffled.
- Sometimes the disease list can move around after you tap, which makes matching feel like it is not working.
- This is a rendering/state bug, not a lesson data bug.

Plan:
1. Fix `PatternCard.tsx` so the shuffled disease order is created once per card load, not on every re-render.
2. Reset that shuffled order only when the actual card data changes, not when local state changes.
3. Keep the current touch protections, and strengthen button event handling only if needed after stabilising the shuffle.
4. Re-test lesson `4.4`, card `6` on mobile width and confirm:
   - the right column starts in a different order,
   - the order stays stable while tapping,
   - matches register reliably.

Files to update:
- `src/components/lesson/cards/PatternCard.tsx`

Technical detail:
```text
Current problem:
SwipeContainer creates new diseases[] each render
→ PatternCard useMemo([diseases]) reruns
→ shuffledDiseases changes during interaction

Correct behavior:
shuffle once when the card mounts or when the source pair set changes
→ keep that shuffled order stable during selection/matching
```

Unrelated note:
- The `Function components cannot be given refs` warning in the console is a separate issue around `LessonComplete`/confetti and is not what is breaking this match-pairs card.
