# Proposal: projects-flowing-polish

## Why

A validação visual do FlowingMenu em Projetos apontou 4 ajustes: fundo do menu diverge da página, tipografia fora do registro `TYPE` (viola o `typography-audit`), tags precisam de layout responsivo próprio (direita no desktop, centralizadas abaixo no mobile) e falta uma affordance de link — o `TargetSimbol` (mira) à direita de cada linha.

## What Changes

- Fundo do menu (`--fm-bg`) passa de `var(--card)` para `var(--background)`; hover inalterado.
- Tipografia 100% via `TYPE`: nova variante `flowingTitle`, descrição `body`, tags idênticas ao `ProjectLink`, `LabPage`/`EdgeReveal` convertidos (zera violações do audit).
- Tags à direita no desktop (`row` + `margin-left: auto`), centralizadas abaixo do texto ≤768px.
- `TargetSimbol` à direita de cada linha (spin no hover/toque/entrada, sem `cursor-target` — nada de corners aqui).

## Capabilities

### New Capabilities

- `projects-flowing-polish`: refinamento visual do FlowingMenu em Projetos (fundo, tipos, tags responsivas, TargetHover) mantendo variantes A/B e todos os comportamentos.

### Modified Capabilities

Nenhuma.

## Impact

- **Alterado**: `typography.ts` (+1 variante), `FlowingMenu.astro`/`.ts`, `LabPage.astro`, `EdgeReveal.astro`, e2e (tags posição + corners).
- **Performance**: zero JS novo (`target-simbol.ts` já carrega globalmente via `TargetSimbol.astro`); CSS escopado ±1 KB.
- **Risco**: nenhum — componente `TargetSimbol` reusado como nos demais links (footer, shares).

## Non-goals

- Não mudar overlay do hover, variantes, dados ou comportamento do motor.
- Não tocar no `EdgeReveal` além da conversão tipográfica.
