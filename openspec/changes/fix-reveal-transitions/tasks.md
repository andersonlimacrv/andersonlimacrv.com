# Tasks: fix-reveal-transitions

## 1. Reveal

- [x] 1.1 Diagnóstico no browser: confirmada a causa — após ClientRouter, `reveal-present` some do `<html>` (swap restaura atributos estáticos) e o `<script>` do componente não re-executa (cache de módulo). Medido `present: false` pós-navegação.
- [x] 1.2 Criar `src/components/ui/reveal.ts`: init em `astro:page-load`/`after-swap`, reaplica `reveal-present`, observa `[data-reveal]` com WeakSet, reduced-motion imediato.
- [x] 1.3 `Reveal.astro` → `<script> import './reveal'`; remover `theme-applied` (morta) de `BaseLayout.astro`.
- [x] 1.4 `e2e/reveal.spec.ts`: guard home (ocultas → visíveis ao scroll, nenhuma presa), round-trip ClientRouter (polling), `/blog`, reduced-motion, cascata (utilitário vence custom).

## 2. CSS

- [x] 2.1 `global.css`: custom em `@layer components`; `html`/`::selection`/`:focus-visible`/scrollbar em `@layer base`.
- [x] 2.2 Remover mortos: `--chart-*`, `--sidebar-*`, `--shadow-x/y/blur/spread/opacity/color`, `--shadow-soft`, `--ease-expo-in` + mapeamentos `@theme`; `CrossMark.astro` (sem uso).
- [x] 2.3 Conversões: `.site-main` → `pt-(--header-h)`; `.hatch-*` → `@utility hatch-diagonal`/`hatch-square`.
  - **REVERTIDA pelo usuário (2026-08-29)**: `src/styles/hatches.css` removido (preferência visual "mais clean"); componente `BlueprintMorphEnd` troca as cruzes cardeais por 4 traços (2 verticais topo/base, 2 horizontais lados, gap 1rem, sem rotate — bbox previsível); `BlueprintMorphBoard` perde o quadriculado (`.bp-grid` removido junto com o texto-debug `kkkkk`); regra estrutural `.bp-end` restaurada (inset:0 — sem ela o container do círculo final fica estático). e2e `blueprint-morph.spec.ts` atualizados (traços com gap 16px ± tol, ausência do `.bp-grid`). Audit CSS final: 28 itens, 0 mortas, 0 tokens sem uso.
- [x] 2.4 Exceção aprovada: header/menu/locale permanecem customizados (estados JS/hooks), agora em `@layer components` com nota.

## 3. Auditoria

- [x] 3.1 `scripts/css-audit.mjs`: extração de classes/@utility/tokens, uso real em src, allowlist de hooks, `docs/css-audit.md`, `--fail-on-dead`.
- [x] 3.2 Integração no `scripts/audit.mjs`; resultado final: 30 itens — 26 usadas, 4 hooks, 0 mortas, 0 tokens sem uso.

## 4. Verificação

- [x] 4.1 `npm run check` 0 erros; `npm run test:e2e` — 100 passed / 6 failed (5 pré-existentes + flake intermitente do target-hover, pré-existente); reveal 5/5 verde.
- [x] 4.2 `e2e/scrollbar.spec.ts`: varredura atravessa `CSSLayerBlockRule` (regras agora em camadas) — mantém asserção.
- [x] 4.3 `scripts/e2e.mjs` + `playwright.config.ts`: bind/host `127.0.0.1` (IPv4) — elimina ERR_CONNECTION_REFUSED intermitente do bind IPv6-only do astro; dupla verificação de estabilidade no ensureServer.
- [x] 4.4 Métricas: CSS 50.1 → 47.6 KB raw; total -2.1 KB raw vs auditoria anterior; gzip ~neutro.