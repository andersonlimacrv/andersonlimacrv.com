# Proposal: lab-flowing-edge-reveal

## Why

As referências `references/components/` (FlowingMenu vanilla + EdgeReveal "Rover"/ManyHovers) precisam ser avaliadas no stack real do projeto (Astro + Tailwind v4, zero JS por padrão) antes de qualquer uso na home. Uma rota isolada de testes permite medir custo real de JS/CSS, contraste nos dois temas e comportamento com `prefers-reduced-motion` sem afetar LCP/CLS/SEO da home.

## What Changes

- Nova rota isolada `/lab` (`lab.astro`, `robots noindex`, fora da nav) hospedando uma seção de testes `ComponentLab`.
- Port do FlowingMenu (`script.ts` 15 KB, WAAPI + rAF, zero deps) para `FlowingMenu.astro` + `flowing-menu.ts` co-localizado, com tokens theme-aware e imagens locais via `astro:assets`.
- Port do EdgeReveal (`ManyHovers.html`, WAAPI `translate` 600 ms expo, sem rAF contínuo) para `EdgeReveal.astro` + `edge-reveal.ts` via atributo `[data-edge-reveal]`.
- Auditoria de performance registrada no design: peso gzip, rAF pausado fora da viewport, `IntersectionObserver`, `prefers-reduced-motion`, View Transitions re-init.
- Novo teste e2e `lab-flowing-edge.spec.ts` + checagem no `css-audit`.

## Capabilities

### New Capabilities

- `component-lab`: rota `/lab` isolada de testes visuais, fora da home/nav, com `noindex` e zero impacto no bundle da home.
- `flowing-menu`: menu com marquee infinito e reveal top/bottom via WAAPI + rAF, theme-aware, com reduced-motion e pausa fora da viewport.
- `edge-reveal`: overlay de fundo que entra pela borda mais próxima (4 lados), texto fixo com `mix-blend-mode: difference`, via WAAPI sem loop contínuo.

### Modified Capabilities

Nenhuma (mudança aditiva; home, blog e seções existentes intactos).

## Impact

- **Novo**: `src/pages/lab.astro`, `src/components/lab/*`, `e2e/lab-flowing-edge.spec.ts`, specs da change.
- **Alterado**: `src/i18n/ui.ts` (strings da lab pt/es/en); nada na `HomePage.astro`.
- **Performance**: JS da lab carregado só em `/lab` (~5 KB gzip FlowingMenu + ~2 KB EdgeReveal estimados); home com 0 byte adicional.
- **Referências**: `references/components/FlowingMenu.htm`, `ManyHovers.html`, `script.ts`, `tailwind.css`.

## Non-goals

- Não usar FlowingMenu/EdgeReveal na home, blog ou contato nesta change (só na `/lab`).
- Não adicionar GSAP, React ou qualquer dependência npm nova.
- Não usar imagens remotas do Unsplash em produção (trocar por assets locais).
- Não globalizar `border-radius: 999px` ou tokens `#120F17` hardcoded (ficam escopados na lab).
