# Tasks

## 1. Signature and stagger CSS

- [x] 1.1 Update `global.css` reveal block (24px, 0.7s, delay consumption, nth-child stagger 0–480ms with cap) and verify the lab-free home still has zero violations in audits

## 2. Per-element coverage

- [x] 2.1 Add hero stagger (group + 4 items) and heading reveals, and verify hero settles opacity 1 in 3 locales
- [x] 2.2 Convert blocks to groups (About socials/perfil, trajectory lists, FlowingMenu, Blog/BlogIndex cards, Contact channels/fields, footer) and verify each group staggers in order
- [x] 2.3 Rewrite `reveal.spec` t1 (below-fold only), update `locale-layout` hero test, add stagger order test, bump transition settles, and verify green
- [x] 2.4 Stabilization: global `reveal.ts` import in `BaseLayout`, hero reveals on init, optical test timeout 120s, single-rAF loop in `flowing-menu.ts`

## 3. Regression

- [x] 3.1 Run `astro check`, build and the full e2e suite: 198 passed, 1 failed (pre-existing `target-hover-persistence` round-trip, unrelated to this change)
