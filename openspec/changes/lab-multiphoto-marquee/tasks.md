# Tasks

## 1. Multi-image marquee

- [ ] 1.1 Add `imagesPerPart` prop + 3 `getImage` crops with alternating display widths to `FlowingMenu.astro` (default 1 keeps current markup byte-for-byte) and verify `astro check` passes
- [ ] 1.2 Cycle N images per part in `buildPart()` via `data-images`/`data-widths`, and verify hover marquee still opens with all images visible

## 2. Lab block C

- [ ] 2.1 Render variant C demo (`imagesPerPart={3}`) in `LabPage.astro` with `lab.variantC` strings (pt/es/en), and verify all 3 locales show the heading
- [ ] 2.2 Add e2e asserting 3 same-line lazy images per part in block C and exactly 1 per part elsewhere, and verify it passes

## 3. Regression

- [ ] 3.1 Run full e2e suite and `astro check`, and verify 100% pass
