# Proposal: hero-tech-text

## Summary
Render the hero name ("Anderson Carvalho") with React Bits TechText (MIT), ported 1:1 to vanilla TS: canvas lens revealing dashed glyph outlines, draggable glyphs with spring physics, selection frame with specks and dimension labels, idle sweep. Only adaptations: theme colors, theme type scale, h1 semantics preserved.

## Motivation
TechText matches the blueprint/technical aesthetic already present in the hero (BlueprintMorph). Full interactivity as requested, on all viewports.

## Scope
- New: `src/components/ui/tech-text.ts`, `TechText.astro`, `src/styles/tech-text.css` (+ BaseLayout import).
- Edit: `Hero.astro` h1 only (sr-only text + canvas overlay, same box).
- New e2e: `e2e/tech-text.spec.ts`.
- Non-goals: prop API beyond data-attributes, behavior tweaks, other pages.
