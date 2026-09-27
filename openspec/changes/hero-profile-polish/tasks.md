# Tasks

## 1. Hero CTAs

- [ ] 1.1 Change both hero CTAs from `sm:w-auto` to `sm:flex-1` in `Hero.astro` and verify equal widths on desktop with TargetHover intact
- [ ] 1.2 Restyle the secondary hero CTA and `#contact-direct` to `foreground` contrast (`text-foreground`, `border-foreground/30`, `hover:border-foreground`) and verify computed colors match the reference in both themes

## 2. Profile type scale

- [ ] 2.1 Keep profile row values in `text-foreground` in `About.astro` (labels muted) with dividers, reveal and structural cleanup, and verify computed color equals trajectory roles

## 3. Tests and regression

- [ ] 3.1 Extend `hero-ctas.spec.ts` (equal widths, foreground contrast both themes), `contact-section.spec.ts` (direct contrast) and `about-edge.spec.ts` (profile reveal, dividers, foreground match, 3 locales), and verify they pass
- [ ] 3.2 Run audits, `astro check` and the full e2e suite, and verify 100% pass
