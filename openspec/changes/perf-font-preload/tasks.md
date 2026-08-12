## 1. Preload de fontes críticas no `<head>`

- [x] 1.1 Em `src/layouts/BaseLayout.astro`, importar as URLs das woff2 críticas via `import manropeLatinUrl from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'` e `import frauncesLatinUrl from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url'`
- [x] 1.2 Adicionar `<link rel="preload" as="font" type="font/woff2" crossorigin href={manropeLatinUrl} />` e o equivalente para Fraunces no `<head>` (antes do `<slot name="head" />`)
- [x] 1.3 Confirmar no `dist/index.html` que as URLs com hash nos `<link>` casam com as URLs dos `@font-face` em `_astro/global.*.css`

## 2. Configurações explícitas de build (astro.config.mjs)

- [x] 2.1 Adicionar `compressHTML: true`
- [x] 2.2 Adicionar `build: { inlineStylesheets: 'auto' }`
- [x] 2.3 Adicionar `prefetch: { defaultStrategy: 'hover' }`
- [x] 2.4 Confirmar que o build segue verde e que o HTML de `dist/index.html` está minificado

## 3. Lazy-loading em imagens below-the-fold

> Nota: `PostLayout`/`BlogPostPage` usam `data.cover` apenas como meta OG
> (`image={data.cover ?? undefined}`); nenhuma `<Image>` é renderizada no
> corpo. Os 9 posts atuais nem têm `cover:` no front-matter. Tarefa 3.1
> não se aplica — manter só o regression check do hero.

- [x] 3.1 ~~Adicionar `loading="lazy" decoding="async"` em `<Image>` da cover~~ — N/A: cover só existe como meta OG; sem `<img>` no corpo do post. Verificado em `src/layouts/PostLayout.astro:42,63` (ambas passam `image` para `BaseLayout` — meta, não `<img>`).
- [x] 3.2 Garantir que o retrato hero em `HomePage.astro` mantém `loading="eager" fetchpriority="high"` (regression check)

## 4. Poda de `theme-transition.ts`

- [x] 4.1 Reter apenas a branch `variant === 'circle' && start === 'center'` de `createAnimation`; remover branches `rectangle`, `gif`, `polygon`, `circle-blur`, `circle` com `start !== 'center'`
- [x] 4.2 Remover funções auxiliares `getPositionCoords`, `generateSVG`, `getTransformOrigin` (só eram usadas pelas branches removidas)
- [x] 4.3 Simplificar tipos `AnimationVariant` e `AnimationStart` para os literals efetivamente suportados (`'circle'` e `'center'`) ou removê-los se `theme.ts`/`theme-toggle.ts` não referencia-los externamente
- [x] 4.4 Confirmar que `theme-toggle.ts` segue chamando `toggleTheme(createAnimation('circle', 'center', false))` sem mudança

## 5. Poda de `theme.ts`

- [x] 5.1 Remover `setCrazyLightTheme`, `setCrazyDarkTheme`, `setCrazySystemTheme`
- [x] 5.2 Remover `setTheme` (wrapper ocioso que só chama `setThemeAnimated`)
- [x] 5.3 Manter exports `getTheme`, `isDark`, `toggleTheme`, `applyStoredTheme`, `THEME_CHANGE_EVENT`, `readStored` (usados por `theme-toggle.ts` e `BaseLayout`)

## 6. Validação

- [x] 6.1 `npm run check` sem erros (TypeScript)
- [x] 6.2 `npm run test:e2e` verde (23/23), com atenção ao `theme-toggle.spec.ts:119` (reduced-motion) e `theme-toggle.spec.ts:19` (transição ativa)
- [x] 6.3 `node scripts/audit.mjs` e comparar vs `docs/audit-baseline.json`:
  - confirmar que o `dist/_astro/ThemeToggle*.js` cai para < 6 KB (raw)
  - confirmar que `dist/index.html` contém `<link rel="preload" as="font" ...>` para manrope-latin e fraunces-latin
  - confirmar que o gzip total cai em relação ao baseline
