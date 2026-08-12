## Why

O prompt exige um sistema de design editorial premium com tokens centralizados (tipografia, cor, raio, sombras) e a base de estilo deve existir antes das páginas. Este change define os design tokens em CSS custom properties, consumidos por todas as páginas e componentes.

## What Changes

- Define tokens de cor (claro/escuro) via CSS custom properties em `src/styles/global.css`: `--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--secondary`, `--radius`.
- Implementa tema escuro via `[data-theme="dark"]` e integração com `prefers-color-scheme`.
- Define escala tipográfica fluida com `clamp()` para display (Manrope 600–800), corpo (400–500) e mono (JetBrains Mono 600).
- Tokens de tipografia: famílias (`--font-sans`, `--font-mono`, `--font-serif`), tamanhos, line-heights, tracking.
- Tokens de elevação: sombras suaves `0 30px 70px -32px hsl(...)`, backdrop blur para elementos fixos.
- Tokens de layout: container width, max width de leitura (~65–75ch), raio 4px.
- Utility classes base (Tailwind `@layer`) para eyebrow chips, headings display, gradientes radiais sutis ancorados nos cantos.
- Nenhuma alteração de páginas — apenas a fundação de estilo.

## Capabilities

### New Capabilities
- `design-tokens`: Sistema de design tokens (cor, tipografia, elevação, layout) implementado como CSS custom properties com suporte a claro/escuro.

### Modified Capabilities
<!-- nenhuma -->

## Impact

- `src/styles/global.css` é o único arquivo de aplicação alterado.
- Consumido por `BaseLayout` e todas as páginas subsequentes.
