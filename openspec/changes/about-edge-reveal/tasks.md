# Tasks

## 1. Global pattern

- [ ] 1.1 Create `src/styles/edge-reveal.css` (base `[data-edge-reveal]`/`[data-reveal-layer]`/`.edge-ink` with token color swap, no font utilities, no new tokens), move `edge-reveal.ts` to `src/lib/` with the `<a>` click-toggle guard, update `EdgeReveal.astro` import, wire both into `BaseLayout.astro`, and verify `astro check` passes and the lab spec still passes
- [ ] 1.2 Add `.cursor-target-inset` corner rules (4 edges, +4px inside) to `src/styles/target-hover.css` and verify `css-audit` reports no dead classes

## 2. About wiring

- [ ] 2.1 Revert the 5 social links in `About.astro` to the original markup (no reveal, `cursor-target` kept) and delete the orphaned `.cursor-target-inset` rules, and verify hover corners behave as before
- [ ] 2.2 Apply `data-edge-reveal` + `.edge-ink` + layer to trajectory rows in `TrajectoryClean.astro` (both lists, no `tabindex`, layout untouched) and verify hover reveal without layout shift

## 3. Tests and regression

- [ ] 3.1 Add `e2e/about-edge.spec.ts` (trajectory hover, socials reverted with TargetHover, reduced-motion, 3 locales) and verify it passes
- [ ] 3.2 Run `css-audit`, `typography-audit` (0 new violations), full e2e suite and `astro check`, and verify 100% pass
