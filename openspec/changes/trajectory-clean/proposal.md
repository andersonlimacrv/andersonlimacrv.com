## Why

A coluna Trajetória atual (`src/components/sections/About.astro:557-772`) usa timeline vertical contínua com linha `w-px`, marcadores `T`/`CrossMark` e agrupamento por ano — pesado visualmente e com 4 níveis por entry (period, role, company, summary). A referência [Image 1] pede lista clean minimalista: `flex justify-between border-b` por row, `Company / Role` à esquerda e `period` à direita, com badge tipado como em `PostCard`/`ProjectLink`/`PostLayout`. Dados continuam de `src/data/timeline.ts:41` (`getTimeline(locale)`), sem mudar shape.

## What Changes

- Novo `src/components/sections/TrajectoryClean.astro` — lista única ordenada `careerJourney (7) + education (3) = 10` rows, sem `summary`, sem bolinha, sem `yearRange` `src/components/sections/About.astro:30-39`, sem `CrossMark`/linha vertical. Cada row: `Company / Role` (`font-sans` + `muted-foreground`), `period` `font-mono uppercase` à direita e badge `rounded-lg border` (`Work`/`Education` localizado).
- `src/components/sections/About.astro:504-774` troca bloco `<ol careerGroups>` por `<TrajectoryClean locale={locale} />`, mantém colunas `flex-col lg:flex-row` `src/components/sections/About.astro:74` e `data-col="trajetoria"`.
- `src/i18n/ui.ts:26` adiciona `aboutBadgeWork`/`aboutBadgeEducation` em `pt/es/en`.
- `specs/trajectory` substitui requisito `Timeline vertical contínua agrupada por ano` por `Lista clean com badges`.

## Capabilities

### New Capabilities
- `trajectory-clean`: lista de trajetória minimalista com badges.

### Modified Capabilities
- `about-section`: remove timeline vertical, adota lista clean.

## Non-goals

- Não alterar coluna Perfil, morph, tokens OKLCH `src/styles/global.css:93`, ou `TargetHover`.
- Não adicionar JS novo ou filtrar fora `timeline.ts` — usa ambas as coleções juntas.
- Não manter `summary`, bolinha ou `yearRange`.

## Impact

- `src/components/sections/TrajectoryClean.astro` (novo)
- `src/components/sections/About.astro` (substitui bloco 557-772)
- `src/i18n/ui.ts` (2 chaves ×3 locales)
- `openspec/changes/trajectory-clean/specs/trajectory/spec.md` (nova capability)
- `e2e/about-section.spec.ts` (atualiza de 6 groups para 10 rows + badge checks)
- `docs/perf-seo-checklist.md` / `docs/audit.md` via `scripts/audit.mjs`
