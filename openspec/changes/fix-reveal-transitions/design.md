# Design: fix-reveal-transitions

## Context

`Reveal.astro` usava um `<script>` próprio: adicionava `reveal-present` no `<html>` e observava `[data-reveal]` uma única vez. Com View Transitions (ClientRouter), o Astro restaura os atributos do `<html>` a partir do HTML estático (apagando `reveal-present`) e módulos idênticos já carregados NÃO re-executam (cache de módulo do browser). Resultado medido no browser: após a 1ª navegação, `present: false` e nenhum elemento observado — transições mortas.

O CSS customizado do site era todo unlayered: na cascata, regra unlayered vence utilitários do Tailwind v4 silenciosamente; tokens mortos (`--chart-*`, `--sidebar-*`, `--shadow-x/y/blur/spread/opacity/color`, `--shadow-soft`, `--ease-expo-in`) e a classe `theme-applied` (sem regra) inflavam o CSS.

## Goals / Non-Goals

**Goals**: reveal funcional também após navegações; cascata determinística (utilitários vencem custom); CSS morto removido; auditoria automatizada de regras customizadas.
**Non-Goals**: converter o CSS do header para utilitárias (exceção aprovada); adicionar dependências; mudar o visual do efeito de reveal.

## Decisions

1. **Reveal como módulo co-localizado (`reveal.ts`) com ciclo de vida Astro**: init em `astro:page-load` + `astro:after-swap` (padrão `elastic-line.ts`/`kinetic-grid.ts`), reaplica `reveal-present` (idempotente) e observa elementos novos com dedupe por `WeakSet`. Reduced-motion: `is-visible` em tudo, sem IO. O `<script>` do componente vira `import './reveal'`.
2. **Camadas na cascata**: regras customizadas do site em `@layer components`; `html`/`::selection`/`:focus-visible`/scrollbar pseudo em `@layer base`. Ordem v4 `theme < base < components < utilities` → utilitários sempre vencem custom. Verificado por e2e de cascata (probe `data-reveal .is-visible opacity-0` → 0).
3. **Mortos removidos**: tokens chart/sidebar/shadow-helpers/soft/ease-expo-in (e mapeamentos `@theme` correspondentes); classe `theme-applied`; componente `CrossMark.astro` sem uso.
4. **Conversões seguras**: `.site-main` → `pt-(--header-h)` (utilitária v4, var shorthand); hachuras → `@utility hatch-diagonal`/`hatch-square` (composáveis).
5. **Header/locale/menu permanecem customizados** (exceção aprovada): estados JS (`.is-open`, `.is-hidden`, `--menu-open`), hooks de teste, animações com aritmética; agora dentro de `@layer components` com justificativa auditável.
6. **Auditoria automatizada**: `scripts/css-audit.mjs` extrai classes/utilitárias/tokens dos styles, cruza com uso real (`.astro`/`.ts`; CSS-only = órfã), allowlist de hooks JS (`is-hidden`, `is-open`, `target-hover-corner--*`, etc.), gera `docs/css-audit.md` e é chamado pelo `audit.mjs`. `--fail-on-dead` para CI.
7. **e2e do scrollbar**: as regras agora vivem em `CSSLayerBlockRule`; o spec passou a atravessar camadas (`CSSGroupingRule`/`CSSLayerBlockRule`) preservando a intenção da asserção.

## Risks / Trade-offs

- [Round-trip ClientRouter sob carga paralela] → waits fixos substituídos por `expect.poll` (robustez).
- [Cascade test depender de ordem de camadas do Tailwind] → ordem é estável no v4 (documentada); teste falha alto se regressar.
- [css-audit regex-based] → falso-positivo de comentários mitigado (strip `/* */`); bordas conhecidas documentadas no script.

## Migration Plan

Mudança visual neutra (reveal corrige comportamento; CSS idêntico visualmente). Deploy = build estático. Verificação: `check`, suíte e2e (100+5), `build` + `audit` (CSS -2.5 KB raw vs anterior). Rollback: reverter commits.

## Open Questions

Nenhuma.