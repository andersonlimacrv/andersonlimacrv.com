# Design

## Context

Ver `proposal.md`. `FlowingMenu.astro` tem CSS próprio de fonte (viola `typography-audit` via `text-transform: uppercase`), `--fm-bg: var(--card)`, tags em coluna sob a descrição e links sem `cursor-target`. Registro em `typography.ts`; TargetHover global (`lib/target-hover.ts`) com `MutationObserver` e corte mobile/touch.

## Goals / Non-Goals

**Goals:** fundo = página; 0 violações tipográficas; tags direita/desktop + centro/mobile; corners visíveis sem clip.

**Non-Goals:** hover overlay, motor, variantes, dados — intactos.

## Decisions

1. **`flowingTitle` no registro** (`font-sans font-semibold text-h2 leading-[1.2] tracking-tight uppercase`) — título da linha e marquee compartilham a voz; `uppercase` vive no registro (caixa é controlada por ele). Descrição `body`, tags = markup do `ProjectLink`, lab/edge em variantes existentes. `buildPart()` importa `TYPE` (padrão documentado para classes dinâmicas em `.ts`).
2. **Tags: `row` + `margin-left: auto`** — novo wrapper `.menu-link-text` (título+descrição) à esquerda, tags à direita centralizadas verticalmente; ≤768px volta a coluna centralizada (mesmo corte do menu mobile e do TargetHover).
3. **Mira à direita, só na variante full** — `<TargetSimbol size={25}>` como último filho do link (row: após as tags com `margin-left` extra de respiro, zerada no mobile; mobile: empilha abaixo, centralizada). A variante `minimal` (B) não renderiza mira. Spin automático no hover do `<a>` pai, no toque e na entrada na viewport (`target-simbol.ts`); `aria-hidden` (o link já tem nome acessível). Sem `cursor-target` de propósito e sem JS novo.
4. **Fundo** — só o token `--fm-bg`; borda/separadores permanecem.

## Risks / Trade-offs

- [Risco] Mira compete visualmente com o marquee no hover → Mitigação: 25px, `opacity-60` em repouso (padrão do componente) e canto direito fora do fluxo do texto.
- [Risco] `text-h2` (mín. 1.5rem) maior que o clamp atual (mín. 1.25rem) → Mitigação: escala editorial oficial; validado visualmente na lab.
- Trade-off: linhas full um pouco mais altas com tags ao lado — aceito (mais respiro editorial).

## Migration Plan

1. `typography.ts` + `FlowingMenu` (markup/CSS/TS) → check + lab visual.
2. `LabPage` + `EdgeReveal` → audits a zero.
3. E2E + full suite. Rollback por arquivo (mudança só visual).
