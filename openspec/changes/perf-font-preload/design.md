## Context

Build SSG estável, 15 páginas (pt/es/en), 36 arquivos no `dist/`. `audit.mjs` gera `docs/audit.md`: fontes 161.9 KB (6 woff2), JS 29.0 KB (`ClientRouter` 15.9 KB + `ThemeToggle` 13.1 KB). `BaseLayout.astro` define `@font-face` em `global.css:8-79` mas não associa `<link rel="preload">`. `astro.config.mjs:7-19` é minimalista. `theme-toggle.ts` chama apenas `toggleTheme(createAnimation('circle', 'center', false))` — ver `src/components/theme-toggle.ts:13`.

## Goals / Non-Goals

**Goals:**
- Reduzir LCP/ECP antecipando o download das woff2 mais críticas no `<head>`.
- Tornar explícitas as configurações de build do Astro 7 que afetam output e UX (`compressHTML`, `inlineStylesheets`, `prefetch`).
- Cortar 50-70% do peso do `ThemeToggle.js` removendo funções/variantes mortas.
- Lazy-loading explícito em imagens abaixo da dobra.

**Non-Goals:**
- AVIF / `<Picture>` (deferido).
- Sonsera-alternativa de tema (não trocar a variante de animação).
- Refactor de componentes diversos (`ArrowLink` etc.).

## Decisions

**Preload de fontes via import estático no `BaseLayout`** — Astro 7 + Vite resolvem `import url from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'` para um chunk `_astro/<hash>.woff2`. Usar essa URL no `<link rel="preload" as="font" type="font/woff2" crossorigin>`. Razão: o `@font-face` em `global.css:13` resolve para o mesmo URL final — o navegador une o preload ao `@font-face` e evita round-trip. Alternativa: caminho hardcoded `/fonts/...` (rejeitado — perde hash e).

**Apenas 2 woff2 em preload** — `manrope-latin` (corpo, onipresente) e `fraunces-latin` (serif, usada em blockquote e hero-display). JetBrains Mono só aparece em labels pequenos e tem swap imperceptível; preload aumentaria consumo no primeiro paint sem benefício. Razão: limitar preload ao caminho crítico de leitura.

**`build.inlineStylesheets: 'auto'`** — Astro já inline por estilo ≤4kB em auto (default), mas declarar explicitamente protege contra mudanças de default em minor bumps. Razão: documentação intencional.

**`prefetch: { defaultStrategy: 'hover' }`** — Astro 7 marca `prefetch` como experimental mas estável o suficiente para hover-only. Reduz保温 de largura de banda vs `prefetchAll`. Razão: ganho de navegação interior sem custo de carregar tudo.

**`compressHTML: true` explícito** — Default já é true, mas deixar explícito documenta a intenção. Razão: nenhum.

**Poda de `theme-transition.ts`** — Manter apenas `createAnimation('circle', 'center', false)`. Remover: variants `rectangle`, `gif`, `polygon`, `circle-blur`, `circle` com `start !== 'center'`, `getPositionCoords`, `generateSVG`, `getTransformOrigin` (vão junto, eram auxiliares das variants removidas). Manter tipos `AnimationVariant`/`AnimationStart` exportados como alias estreitos (para não quebrar imports nominais) ou removê-los do tema se `theme-toggle.ts` não referencia — mas `theme.ts` ainda referencia, então simplificar para `'circle'`/`'center'` literal. Razão: tree-shake de `createAnimation` é ineficaz porque a função tem switch interno com template strings inline; só removendo código-fonte o esbuild corta as strings.

**Remoção de `setCrazy*` e `setTheme`** — `grep` confirma que só `toggleTheme` é importado. Remover `setCrazyLightTheme`, `setCrazyDarkTheme`, `setCrazySystemTheme`, `setTheme` (wrapperdor ocioso). Manter `setThemeAnimated` interno (é chamado por `toggleTheme`). Razão: YAGNI; possível custo de manutenção zero.

**Lazy em `data.cover`** — Procurar `<Image>` no `PostLayout`/`BlogPostPage`; se existir, adicionar `loading="lazy" decoding="async"`. Se cover está no `<head>` como `og:image` (via `image={data.cover ?? undefined}`), isso é meta — o elemento `<img>` no corpo é que recebe lazy. Razão: hero acima da dobra só se for retrato da home (já eager).

## Risks / Trade-offs

- [Preload sem `crossorigin` quebra woff2 em alguns browsers] → Sempre incluir `crossorigin` (fontes são fetched anon-auth e precisam do atributo mesmo sem CORS real).
- [Poda de variáveis de animação pode quebrar teste de reduced-motion] → Teste `theme-toggle.spec.ts:119` valida que sem `::view-transition` o tema cai direto — não depende da variante; nossa poda mantém `circle/center` que é o caminho padrão.
- [`prefetch` experimental pode mudar] → Aceitável; está no Astro 7 há várias minor sem quebra.
- [Import de woff2 com `?url` adiciona URL com hash — URL final no `<link>` precisa casar com o `@font-face` em `global.css`] → Astro normaliza ambos para o mesmo chunk; confirmar via `dist/index.html` depois do build.
