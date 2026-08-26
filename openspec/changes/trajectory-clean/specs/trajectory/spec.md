# Capability: trajectory

## Purpose

Coluna Trajetória clean lista única com badges, sem linha vertical, sem summary, sem dot, sem yearRange.

## ADDED Requirements

### Requirement: Lista clean única com badges

A coluna 02 SHALL renderizar uma `<ul>` única (não `<ol>` agrupada) com 7 rows (`careerJourney filtrado para work 4` + `education 3`) vindas de `src/data/timeline.ts:41` via `getTimeline(locale)` e `isEducationRole` filtro. Cada row SHALL ser `<li class="flex justify-between items-center gap-2 sm:gap-4 border-b border-border py-3.5 last:border-b-0">` com `min-w-0 flex-1 truncate` à esquerda (`Company / Role`) e `shrink-0 flex items-center gap-2 sm:gap-3` à direita (`badge` + `period` mono curto). Sem `summary`, sem dot, sem `yearRange`.

#### Scenario: 7 rows com badge localizado

- **WHEN** a página carrega em `pt`
- **THEN** a coluna 02 contém 7 `<li>` cada com `Company / Role` e badge `Trabalho` (4) ou `Formação` (3) com classe `rounded-lg border border-border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground`.
- **WHEN** em `en`
- **THEN** badges são `Work` (4) / `Education` (3); em `es` `Trabajo` (4) / `Formación` (3).

#### Scenario: Period à direita mono curto

- **WHEN** a página carrega
- **THEN** cada row exibe `period` curto `formatPeriodShort` (ex. `2022 — presente`, `2026 — 2027`, `2012 — 2014`) com `trajectory-period font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap` à direita do badge, `title` com period completo para a11y.

#### Scenario: Sem summary, dot e yearRange

- **WHEN** a página carrega
- **THEN** nenhum row contém `summary`, nenhum `span` dot `rounded-full`, e nenhum `yearRange` `2007—2027` dentro do wrapper.

### Requirement: Sem linha vertical ou CrossMark

A coluna 02 SHALL NOT conter `w-px bg-border` linha vertical nem `CrossMark` `t-top`/`t-bottom`.

#### Scenario: Ausência de elementos antigos

- **WHEN** a página carrega
- **THEN** não existe `span.w-px.bg-border` nem `.cross-mark` dentro de `section[data-col="trajetoria"]`.

### Requirement: Responsividade e a11y

A lista SHALL usar `gap-4 sm:gap-6`, `text-[12px] sm:text-[13px]` e `truncate` para evitar overflow horizontal em `390px`. A `<ul>` SHALL ter `aria-label={t.aboutTimelineLabel}`.

#### Scenario: Mobile sem overflow

- **WHEN** viewport 390px
- **THEN** `document.documentElement.scrollWidth <= clientWidth`.
