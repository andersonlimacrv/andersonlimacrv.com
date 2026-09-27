# Tasks

## 1. Lab route shell

- [ ] 1.1 Create `src/pages/lab.astro` (+ `es`/`en` variants per i18n pattern) with `noindex, nofollow`, `ComponentLab` section and locale strings, and verify `astro build` emits `/lab` with robots meta and no lab markup in `/index.html`
- [ ] 1.2 Add pt/es/en lab strings to `src/i18n/ui.ts` and verify `astro check` passes with no missing-locale type error

## 2. FlowingMenu port

- [ ] 2.1 Create `src/components/lab/FlowingMenu.astro` + `flowing-menu.ts` (data-* props, scoped `<style>` mapping `--fm-*` to site tokens, local `astro:assets` thumbs) and verify `/lab` shows 4 keyboard-focusable links with marquee reveal on hover
- [ ] 2.2 Wire lifecycle (`astro:page-load`/`astro:after-swap` re-init with WeakSet, `destroy()` cancels rAF/listeners, `IntersectionObserver` pauses offscreen, reduced-motion static) and verify no rAF runs when menu is offscreen via devtools/hook

## 3. EdgeReveal port

- [ ] 3.1 Create `src/components/lab/EdgeReveal.astro` + `edge-reveal.ts` (`[data-edge-reveal]` + `[data-reveal-layer]`, 4-edge WAAPI translate 600 ms expo, text fixed with `difference` blend, `aria-hidden` layers) and verify row/stack/square/button demos reveal from the entry edge
- [ ] 3.2 Wire focus/blur, `hover: none` tap toggle and instant swap under `prefers-reduced-motion`, and verify keyboard tab shows visible focus plus reveal on each element

## 4. Audit and tests

- [ ] 4.1 Run `npm run build` + `scripts/css-audit.mjs` and record JS/CSS gzip bytes for `/lab` vs `/` in the change notes, verifying `/` gains 0 bytes of lab JS/CSS
- [ ] 4.2 Add `e2e/lab-flowing-edge.spec.ts` (lab renders `data-lab` hooks, hover/focus opens `.is-open`, reduced-motion static, light/dark contrast smoke) and verify `npm run test:e2e` passes for the new spec without breaking existing specs
- [ ] 4.3 Keyboard + screen-reader pass (`h1` order, landmarks, `aria-hidden` layers, `:focus-visible`, `alt` on thumbs) and verify with `astro preview` manual check in pt + one alternate locale
