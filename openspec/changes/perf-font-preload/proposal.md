## Why

O `audit.mjs` mostra que fontes (161.9 KB) e JS (29 KB) somam ~30% do peso transferido, e o `<head>` não declara `preload` das woff2 críticas — elas só são descobertas ao parsear o CSS, atrasando a primeira pintura de texto. `astro.config.mjs` também deixa `compressHTML` e `inlineStylesheets` implícitos ( Defaults do Astro 7) e `prefetch` está desligado, então links interiores não são pré-carregados. Por fim, `ThemeToggle.js` pesa 13.1 KB (45% do JS do site) apesar de `theme-toggle.ts` usar apenas `toggleTheme(createAnimation('circle', 'center', false))` — o resto de `theme-transition.ts` (variantes rectangle/gif/polygon/circle-blur, funções `setCrazy*`) está morto.

## What Changes

- Pré-carrega as woff2 críticas (`manrope-latin` para corpo, `fraunces-latin` para serif) no `<head>` do `BaseLayout.astro` via `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- Torna explícitos em `astro.config.mjs`: `compressHTML: true`, `build.inlineStylesheets: 'auto'`, `prefetch: { defaultStrategy: 'hover' }`.
- Adiciona `loading="lazy"` e `decoding="async"` em imagens below-the-fold (`data.cover` no `PostLayout`/`BlogPostPage`, se houver `<Image>`).
- Poda `theme-transition.ts` para reter apenas a branch `circle/center` (a única chamada do site) e remove as funções `setCrazy*` e `setTheme` não usadas de `theme.ts`.
- Auditoria final via `node scripts/audit.mjs` comparando contra `docs/audit-baseline.json` (esperado: queda no `js` e estabilidade no `html`/`css`).

## Capabilities

### New Capabilities
- `font-preload`: Marca as fontes críticas como prioritárias no `<head>` para reduzir LCP/ECP.
- `astro-build-tuning`: Configurações explícitas de build (compressão HTML, inline de CSS, prefetch) para reduzir round-trips e antecipar navegações.
- `theme-toggle-trimmed`: Bundle do theme toggle poda funções mortas e variantes de animação não usadas, mantendo só a transição circle/center.

### Modified Capabilities
- `seo`: `BaseLayout.astro` recebe `<link rel="preload">` no `<head>` (sem mudar meta tags).

## Non-Goals

- Migrar webp para AVIF (decidido em separado: só lazy/async nesta rodada).
- Adicionar `manifest.webmanifest` ou image-sitemap (change `seo-extras-manifest-imagesitemap`).
- Refatorar `ArrowLink` (change `link-component-refactor`).
- Trocar a animação do theme toggle por outra variante.
- Remover `<ClientRouter />` ou View Transitions.

## Impact

- `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/lib/theme-transition.ts`, `src/lib/theme.ts`, `src/layouts/PostLayout.astro` (se a cover existir como `<Image>`).
- Nenhum contrato público de `theme.ts` é removido (`getTheme`, `toggleTheme`, `applyStoredTheme`, `THEME_CHANGE_EVENT` seguem exportados).
- `npm run test:e2e` deve permanecer 23/23 (o teste de reduced-motion valida a transição circle/center).
