## Purpose

Tuning de carregamento e build do Astro 7 + poda de JS morto para reduzir tempo até primeira pintura de texto e tamanho do bundle do client.

## ADDED Requirements

### Requirement: Preload de fontes críticas no `<head>`
O site SHALL marcar as woff2 críticas (`manrope-latin-wght-normal.woff2` e `fraunces-latin-wght-normal.woff2`) como `<link rel="preload" as="font" type="font/woff2" crossorigin>` no `<head>` do `BaseLayout.astro`.

#### Scenario: Preload coincide com a fonte definida em `@font-face`
- **WHEN** o navegador parseia o `<head>` da home
- **THEN** encontra dois `<link rel="preload" as="font" type="font/woff2" crossorigin>` apontando para as URLs com hash que aparecem nos `@font-face` de `global.css`
- **AND** ambas as fontes são servidas do diretório `_astro/` com cache Buster de hash

#### Scenario: Without preload test
- **WHEN** se remove o preload
- **THEN** o `audit.mjs` continua válido (HTML válido) mas o Lighthouse LCP piora (verificação manual opcional)

### Requirement: Configurações de build do Astro declaradas explicitamente
O `astro.config.mjs` SHALL declarar `compressHTML: true`, `build: { inlineStylesheets: 'auto' }` e `prefetch: { defaultStrategy: 'hover' }`.

#### Scenario: Build com compressão e inline de CSS
- **WHEN** se roda `npm run build`
- **THEN** o HTML gerado tem whitespace removido
- **AND** estilos ≤4kB são inlined no `<head>`
- **AND** estilos maiores seguem como `<link>` externo

#### Scenario: Prefetch em hover
- **WHEN** o usuário hover sobre um `<a href>` interno
- **THEN** o navegador prefetche o destino no hover (sem navigate)

### Requirement: Lazy-loading explícito em imagens below-the-fold
Todas as `<Image>`/`<img>` abaixo da primeira dobra SHALL declarar `loading="lazy"` e `decoding="async"`.

#### Scenario: Hero mantém eager
- **WHEN** se inspeciona o retrato hero de `HomePage.astro`
- **THEN** mantém `loading="eager" fetchpriority="high"`

#### Scenario: Cover de post com lazy
- **WHEN** se inspeciona a `<Image>` da cover do `PostLayout`/`BlogPostPage`
- **THEN** contém `loading="lazy" decoding="async"`

### Requirement: Bundle do theme toggle podado
`theme-transition.ts` SHALL exportar somente `createAnimation` com suporte à variante `circle`/`center` (sem `blur`). `theme.ts` SHALL remover `setCrazyLightTheme`, `setCrazyDarkTheme`, `setCrazySystemTheme` e `setTheme`.

#### Scenario: Comportamento do toggle preservado
- **WHEN** se clica no toggle na home
- **THEN** a transição `circle`/`center` acontece como antes
- **AND** a classe `.dark` é alternada no `<html>` e persiste em `localStorage`

#### Scenario: Reduced-motion sem view transition
- **WHEN** o `prefers-reduced-motion: reduce` está ativo
- **THEN** o tema muda instantaneamente sem `::view-transition`

#### Scenario: Tamanho do bundle cai
- **WHEN** se roda `node scripts/audit.mjs` após a poda
- **THEN** o arquivo `ThemeToggle*.js` no `dist/_astro/` pesa < 6 KB (raw) vs 13.1 KB no baseline
