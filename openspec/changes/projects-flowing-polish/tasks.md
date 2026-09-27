# Tasks

## 1. Registry and FlowingMenu

- [ ] 1.1 Add `flowingTitle` variant to `typography.ts` and verify `astro check` passes
- [ ] 1.2 Convert `FlowingMenu.astro` to TYPE (label/marquee `flowingTitle`, desc `body`, tags as `ProjectLink`), switch `--fm-bg` to `var(--background)`, and verify `/lab` renders with zero `typography-audit` violations
- [ ] 1.3 Restructure tags (`.menu-link-text` wrapper, right side desktop / centered below ≤768px), add `TargetSimbol` on the right (no `cursor-target`), update `buildPart()` to use `TYPE.flowingTitle`, and verify the reticle spins on row hover

## 2. Lab and edge typography

- [ ] 2.1 Convert `LabPage.astro` (h1 `titleH1`, h2 `titleH2`, eyebrows `label`) and `EdgeReveal.astro` (`flowingTitle`/`label`, no `uppercase` in scoped CSS), and verify `typography-audit` reports 0 violations

## 3. Tests and regression

- [ ] 3.1 Extend `e2e/projects-flowing.spec.ts` (tags right on desktop / centered below on mobile via bounding boxes, reticle on the right spinning on hover) and verify it passes
- [ ] 3.2 Run `css-audit`, full e2e suite and `astro check`, and verify 100% pass
