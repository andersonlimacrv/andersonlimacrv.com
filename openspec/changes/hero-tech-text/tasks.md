# Tasks: hero-tech-text

- [x] 1. Write `src/components/ui/tech-text.ts` (faithful port with data-attribute settings, theme re-resolve, init guards)
- [x] 2. Write `src/components/ui/TechText.astro` + `src/styles/tech-text.css`, import CSS in `BaseLayout.astro`
- [x] 3. Integrate into `Hero.astro` h1 (sr-only text + overlay, same layout box)
- [x] 4. `npm run check`, build, audits (0 errors, 15 pages, css-audit clean)
- [x] 5. Write `e2e/tech-text.spec.ts` (5 tests: render 3 locales, semantics, hover, drag rigid tracking, reduced-motion), full suite 203 passed / 1 pre-existing `target-hover-persistence` failure; `data-source` author-name assertion moved to `span.sr-only`
- [x] 6. Stabilization: rgba resolver for any CSS color (oklch), `speed 0.55`, `specks 0`, drag overlay z-200, ghost-instance hardening, exact frame on drag, direct drive, multi-line engine, `--text-hero` 2-line sizing; perf measured (6KB gzip, 0 longtasks, loop sleeps offscreen)
