# Proposal: fix-reveal-transitions

## Why

As seções da home devem aparecer com transição suave (reveal) ao entrar na viewport, mas há suspeita de que as transições não estão ocorrendo/estão inconsistentes. Além disso, o CSS customizado do site está em camadas não auditáveis: regras unlayered sobrescrevem utilitários Tailwind v4 silenciosamente e há tokens/classes mortos.

## What Changes

- **Reveal**: diagnóstico no browser do estado de cada `[data-reveal]` (home, `/blog`, ClientRouter, reduced-motion); correção da causa encontrada (init via `astro:page-load`, IO/limiares, re-arm pós-swap); remoção da classe morta `theme-applied`.
- **Cascata auditável**: CSS customizado envolto em `@layer components` (ordem v4: theme < base < components < utilities) — utilitários passam a vencer custom de forma determinística; regras de elementos/`html` vão para `@layer base`.
- **Código morto removido**: tokens `--chart-*`, `--sidebar-*`, `--shadow-x/y/blur/spread/opacity/color`, `--shadow-soft`, `--ease-expo-in`; componente `CrossMark.astro` sem uso.
- **Conversões seguras para Tailwind v4**: `.site-main` → `pt-[var(--header-h)]` no componente; hachuras `.hatch-*` → `@utility` (composáveis/variantáveis); verificação de utilitários v4 já corretos (`@utility transition-micro`, `@theme inline`, `@source`).
- **Exceção documentada**: CSS do header (`.site-*`, `.site-menu*`, `.site-locale-*`) permanece customizado — estados JS, hooks de teste e risco de regressão visual; regra auditável via allowlist.
- **Auditoria automatizada**: `scripts/css-audit.mjs` gerando `docs/css-audit.md` a cada run (regras usadas / mortas / allowlist), integrado ao `scripts/audit.mjs`.
- **Testes**: novo `e2e/reveal.spec.ts` (todas as seções aparecem, guard contra `opacity:0` permanente, /blog, ClientRouter, reduced-motion) + teste de cascata (utilitário vence custom).

## Capabilities

### New Capabilities

- `reveal-transitions`: transição de entrada das seções (oculto → visível ao entrar na viewport), com re-arm em navegação, reduced-motion e guard contra conteúdo permanentemente oculto.

### Modified Capabilities

- `design-tokens`: remoção de tokens mortos (`--chart-*`, `--sidebar-*`, `--shadow-*` não usados, `--shadow-soft`, `--ease-expo-in`) e organização em camadas (`@layer base/components`) com cascata determinística.

## Impact

- **Código**: `Reveal.astro` (init/limpeza), `src/styles/global.css` + `hatches.css` (camadas, mortos, `@utility`), `BaseLayout.astro`/componentes que usam `.site-main` (conversão segura), remoção de `CrossMark.astro`.
- **Scripts**: `scripts/css-audit.mjs` novo; `scripts/audit.mjs` chama o css-audit e grava `docs/css-audit.md`.
- **Testes**: `e2e/reveal.spec.ts` novo; suíte existente deve permanecer verde (nenhum seletor removido).
- **Métricas**: CSS esperado menor (remoção de mortos); delta JS ~0.

## Non-goals

- Não converter o CSS do header/toolbar/menu/locale para utilitárias (exceção aprovada: estados JS + hooks de teste + risco de regressão; verificado por allowlist no css-audit).
- Não adicionar dependências (ex.: plugin typography para `.post-content`).
- Não mudar o mecanismo visual das seções (mesmo efeito opacity+translate; apenas garantir que ocorre).