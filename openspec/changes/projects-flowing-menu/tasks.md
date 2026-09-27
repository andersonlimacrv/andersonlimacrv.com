# Tasks

## 1. FlowingMenu variants

- [ ] 1.1 Extend `FlowingMenu.astro` with `variant`, `description`/`tags`/`external` item fields and `<img loading="lazy">` marquee media, and verify `astro check` passes and `/lab` still renders the demo unchanged by default
- [ ] 1.2 Update `buildPart()` in `flowing-menu.ts` to create `<img>` (fixed width/height, lazy, async decode, empty alt) and verify hover marquee still opens with the image visible

## 2. Lab A/B comparison

- [ ] 2.1 Render variant A (full) and B (minimal) demos in `LabPage.astro` with `lab.variantA/variantB` locale strings (pt/es/en), keeping `data-lab="flowing"` on block A, and verify all 3 locales show both headings
- [ ] 2.2 Visually validate A vs B on `/lab` (light/dark, 1280px + 390px) and record the chosen variant for Projects in the change notes

## 3. Projects wiring

- [ ] 3.1 Replace the `ProjectLink` grid in `Projects.astro` with `<FlowingMenu variant="full">` mapped from `getProjects(locale)`, and verify `astro check` passes with `src/data/projects.ts` untouched
- [ ] 3.2 Run `npm run build` + `node scripts/css-audit.mjs` and record home JS/CSS delta vs the lab baseline, verifying LCP-critical paths (fonts, hero) are unchanged

## 4. Tests and regression

- [ ] 4.1 Add `e2e/projects-flowing.spec.ts` (localized rows, hover opens marquee, external link attrs, reduced-motion full info, no horizontal overflow) and verify it passes
- [ ] 4.2 Run the full e2e suite and verify 100% pass with no regressions in existing specs
