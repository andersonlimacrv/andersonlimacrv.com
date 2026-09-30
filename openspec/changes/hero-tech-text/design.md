# Design: hero-tech-text

## Decisions
1. **Faithful port** — `tech-text.ts` mirrors `TechText.jsx` logic (layout, sprites, lens, springs, specks, labels, sweep, drag, IO pause, DPR cap 2). Defaults identical (reach 200, softness 0.7, dash 4/2, stroke 1.5, specks 15, speed 1).
2. **Colors from theme** — text = computed container color (foreground); accent = resolved `--primary`; re-resolved on `<html>` class mutation (theme toggle), sprites rebuilt.
3. **Type scale from theme** — font size defaults to container computed size (`TYPE.hero`), weight 800 + letter-spacing −0.03 via data-attributes to mirror the token.
4. **h1 semantics** — real text stays in flow (`sr-only` after enhance); canvas overlay `aria-hidden`; no-JS shows plain text.
5. **Sizing** — h1 box sizes the canvas (absolute inset-0); text hidden with `visibility` so layout is unchanged.
6. **Drag overlay (z)** — dragged glyph flies above all page layers via a lazy `fixed inset-0 z-200 pointer-events-none` canvas; `drawFrame`/`drawSpecks` take an output target (main canvas by default); main loop skips the dragged index; scroll/`Esc`/drop ends the drag and the spring returns the glyph. Zero steady-state cost.
7. **No ghost frames** — `dataset.bound` guard (survives HMR re-execution), dispose of detached roots on `astro:after-swap` (loops, listeners and overlay removed), tick self-disposes when detached; during overlay drag the main canvas skips its own `drawFrame` (single frame source).
8. **Bigger name** — `--text-hero` raised to `clamp(3.5rem, 8vw, 6.5rem)` (token only used by the hero h1); canvas follows the computed size automatically.
11. **Two lines** — h1 splits the name into two row boxes (`Anderson` / `Carvalho`), each a relative row with fallback text + its own `TechText` overlay; single `sr-only` keeps the full accessible name; each canvas sizes to its row.
12. **One animation for both lines** — engine supports `\n`: per-line measure/center/baseline, flat glyph list with line bands for hit-testing, union word box for the single sweep path; one canvas, one lens, one loop; cross-line drag verified.
9. **Exact frame while dragging** — frame box snaps to the grabbed glyph on `pointerdown` and is set (not glided) every frame during drag, so the reference hugs the letter like on hover; glyph keeps its smooth chase (0.03).
10. **Zero-lag drag + overlay hardening** — dragged glyph uses direct drive (`offset = pointer − grab`, spring only on release); overlay gets explicit `style.width/height` (immune to stylesheet state) and a `(resolution)` listener re-syncs DPR/layout on zoom or monitor switch. Probe matrix (1280/1920/2560 dpr2 + mobile dpr3): rigid tracking, 0.0px blob drift on desktop, mobile visually exact.

## Risks
- Canvas text not selectable (matches original `user-select: none`).
- Extra rAF on hero while sweeping; IO-gated offscreen, same budget class as KineticGrid.
