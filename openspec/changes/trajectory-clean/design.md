## Context

`About.astro:43-55` agrupa `careerJourney` por ano e renderiza `w-[3.2rem]` ano + `w-px bg-border` linha + `CrossMark` `src/components/ui/CrossMark.astro`. Referência Image 1 pede `EXPERIENCE`/`EDUCATION` como lista `border-b` com `Company / Role` e `period` mono, badge como `PostCard.astro:36` `rounded-lg border border-border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground`. Tokens já existem `src/styles/global.css:110` `--border`, `--muted-foreground`, `--foreground`.

## Goals / Non-Goals

**Goals:** clean, responsivo, badges localizados, 0 JS extra, sem `summary`/dot/`yearRange`.
**Non-Goals:** ver proposal.md.

## Decisions

### Lista única com badges em vez de timeline vertical
`TrajectoryClean.astro` junta `timeline.careerJourney` (7) e `timeline.education` (3) em 10 rows, ordena por ano desc extraído de `period` (ou mantém ordem `careerJourney` desc + `education` desc intercalada — simples concat + sort). Cada row `li.flex.justify-between.items-center.gap-4.border-b.border-border.py-3.5` com `min-w-0 flex-1 truncate` à esquerda e `shrink-0 flex items-center gap-3` à direita. Esquerda `Company` `font-medium text-foreground` + ` / ` `text-muted-foreground/60` + `Role` `text-muted-foreground`. Direita `badge` + `period` `font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground`. Razão: replica Image 1, usa só utilities Tailwind existentes, sem `position:absolute` da linha.

### Badge como em PostCard/ProjectLink/PostLayout
`span.rounded-lg.border.border-border.px-2.py-0.5.font-mono.text-[0.6875rem].uppercase.tracking-[0.16em].text-muted-foreground` `src/components/ui/PostCard.astro:36`. Conteúdo `t.aboutBadgeWork` / `t.aboutBadgeEducation` de `src/i18n/ui.ts`. Para `kind==='work'` (origem `careerJourney` onde role não é formação acadêmica? simplifica: todo `careerJourney` = work, todo `education` = education) — evita heurística frágil; mantém `kind` explícito no merge. Alternativa filtrar `careerJourney` por regex de formação rejeitada (complexo e locale-dependente).

### Sem summary, sem dot, sem yearRange
`summary` `src/data/timeline.ts:8` tem 1 linha por entry mas Image 1 não mostra — removido para clean e ganho de perf (~1KB html). Dot `w-2.5 bg-foreground` `src/components/sections/About.astro:668` removido (pedido). `yearRange` `src/components/sections/About.astro:39` removido. `CrossMark` import removido.

### i18n 3 línguas
`ui.pt/es/en` já tem `aboutTrajectoryColumn` `src/i18n/ui.ts:88/190/292`; adiciona `aboutBadgeWork`/`aboutBadgeEducation` com tradução `Trabalho`/`Trabajo`/`Work` e `Formação`/`Formación`/`Education`. Uso via `t.aboutBadgeWork` em `TrajectoryClean.astro`, nunca hard-coded, segue `translatePath` `src/i18n/ui.ts:337`.

### Responsividade
`About.astro:74` `flex-col lg:flex-row` já empilha colunas no mobile; dentro da lista, `gap-4 sm:gap-6`, `text-[12px] sm:text-[13px]` esquerda, `text-[11px] sm:text-xs` period, `truncate` evita overflow `e2e/about-section.spec.ts:81`. Hover `transition-micro` `src/styles/global.css:686` opcional `hover:text-foreground` no `li`.

## Risks / Trade-offs

- 10 rows vs 6 groups → aumento de DOM mas redução de wrappers (menos `div` aninhados) e remoção de `CrossMark` SVG → peso html/gzip deve cair.
- Perda de `summary` pode reduzir SEO de conteúdo trajeto — mitigado por `education` + `experienceDetails` já existem em `timeline.ts` mas não renderizados; se SEO precisar, re-adiciona `summary` em `sr-only` ou tooltip.
- Ordenação cronológica: concat + sort por ano extraído mantém mais recente topo (2026 → 2007) igual ao `careerJourney` desc.
